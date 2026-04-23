import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();

    const username = body?.username?.trim();
    const password = body?.password?.trim();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "กรุณากรอก Username และ Password" },
        { status: 400 }
      );
    }

    // 🔍 หา user
    const { data: user, error } = await supabaseAdmin
      .from("user_accounts")
      .select(`
        id,
        auth_user_id,
        employee_id,
        role_id,
        username,
        password_hash,
        is_active,
        employees (
          employee_code,
          first_name_th,
          last_name_th
        ),
        roles (
          role_code,
          role_name
        )
      `)
      .eq("username", username)
      .maybeSingle();

    if (error) throw error;

    if (!user) {
      return NextResponse.json(
        { success: false, error: "ไม่พบผู้ใช้งาน" },
        { status: 401 }
      );
    }

    if (!user.is_active) {
      return NextResponse.json(
        { success: false, error: "บัญชีถูกปิดการใช้งาน" },
        { status: 403 }
      );
    }

    // 🔐 เช็ค password
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "รหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    // 🎉 login success
    return NextResponse.json({
      success: true,
      message: "เข้าสู่ระบบสำเร็จ",
      data: {
        id: user.id,
        auth_user_id: user.auth_user_id,
        employee_id: user.employee_id,
        username: user.username,
        role_id: user.role_id,
        role_code: user.roles?.role_code || "",
        role_name: user.roles?.role_name || "",
        employee_code: user.employees?.employee_code || "",
        employee_name:
          `${user.employees?.first_name_th || ""} ${user.employees?.last_name_th || ""}`.trim(),
      },
    });
  } catch (error) {
    console.error("LOGIN_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Login ไม่สำเร็จ",
      },
      { status: 500 }
    );
  }
}