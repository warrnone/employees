import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function POST(req) {
  try {
    const body = await req.json();
    const username = body?.username?.trim();
    const password = body?.password;

    if (!username || !password) {
      return NextResponse.json(
        { error: "กรุณากรอก username และ password" },
        { status: 400 }
      );
    }

    // =========================
    // 1) หา user account จาก username
    // =========================
    const { data: userAccount, error: userError } = await supabaseAdmin
      .from("user_accounts")
      .select(`
        id,
        employee_id,
        username,
        password_hash,
        is_active
      `)
      .eq("username", username)
      .maybeSingle();

    if (userError) {
      console.error("USER_QUERY_ERROR:", userError);
      return NextResponse.json(
        { error: "เกิดข้อผิดพลาดในการค้นหาผู้ใช้งาน" },
        { status: 500 }
      );
    }

    if (!userAccount) {
      return NextResponse.json(
        { error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    if (!userAccount.is_active) {
      return NextResponse.json(
        { error: "บัญชีนี้ถูกปิดการใช้งาน" },
        { status: 403 }
      );
    }

    if (!userAccount.password_hash) {
      return NextResponse.json(
        { error: "บัญชีนี้ยังไม่มีรหัสผ่านในระบบ" },
        { status: 400 }
      );
    }

    console.log("LOGIN_USERNAME:", username);
    console.log("DB_USERNAME:", userAccount.username);
    console.log("INPUT_PASSWORD:", password);
    console.log("DB_HASH:", userAccount.password_hash);

    // =========================
    // 2) ตรวจสอบรหัสผ่าน
    // =========================
    const isPasswordValid = await bcrypt.compare(
      password,
      userAccount.password_hash
    );

    console.log("isPasswordValid:", isPasswordValid);
    

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    // =========================
    // 3) ดึงข้อมูล employee
    // =========================
    let employee = null;

    if (userAccount.employee_id) {
      const { data: employeeData, error: employeeError } = await supabaseAdmin
        .from("employees")
        .select(`
          id,
          employee_code,
          first_name_th,
          last_name_th,
          first_name_en,
          last_name_en
        `)
        .eq("id", userAccount.employee_id)
        .maybeSingle();

      if (employeeError) {
        console.error("EMPLOYEE_QUERY_ERROR:", employeeError);
        return NextResponse.json(
          { error: "เกิดข้อผิดพลาดในการดึงข้อมูลพนักงาน" },
          { status: 500 }
        );
      }

      employee = employeeData;
    }

    // =========================
    // 4) ดึง role ของ user
    // =========================
    const { data: roleRows, error: roleError } = await supabaseAdmin
      .from("user_role_assignments")
      .select(`
        role_id,
        roles (
          id,
          role_code,
          role_name
        )
      `)
      .eq("user_account_id", userAccount.id);

    if (roleError) {
      console.error("ROLE_QUERY_ERROR:", roleError);
      return NextResponse.json(
        { error: "เกิดข้อผิดพลาดในการดึงสิทธิ์ผู้ใช้งาน" },
        { status: 500 }
      );
    }

    const roles =
      roleRows
        ?.map((row) => row.roles)
        ?.filter(Boolean)
        ?.map((role) => ({
          id: role.id,
          role_code: role.role_code,
          role_name: role.role_name,
        })) || [];

    const primaryRole = roles[0]?.role_code || null;

    const fullNameTh = employee
      ? `${employee.first_name_th || ""} ${employee.last_name_th || ""}`.trim()
      : userAccount.username;

    // =========================
    // 5) สร้าง JWT
    // =========================
    const token = jwt.sign(
      {
        user_id: userAccount.id,
        employee_id: userAccount.employee_id,
        username: userAccount.username,
        role: primaryRole,
        roles: roles.map((r) => r.role_code),
        employee_code: employee?.employee_code || null,
        full_name: fullNameTh,
      },
      process.env.JWT_SECRET || "dev-secret-key",
      { expiresIn: "1d" }
    );

    // =========================
    // 6) ส่ง response + set cookie
    // =========================
    const response = NextResponse.json({
      success: true,
      message: "เข้าสู่ระบบสำเร็จ",
      user: {
        id: userAccount.id,
        employee_id: userAccount.employee_id,
        username: userAccount.username,
        role: primaryRole,
        roles: roles.map((r) => r.role_code),
        employee_code: employee?.employee_code || null,
        full_name: fullNameTh,
      },
    });

    response.cookies.set("employee_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error("LOGIN_ERROR:", error);

    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในระบบ" },
      { status: 500 }
    );
  }
}