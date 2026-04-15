import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";
import bcrypt from "bcryptjs";

/* =========================
   GET: list user accounts
========================= */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim().toLowerCase() || "";

    const { data, error } = await supabaseAdmin
      .from("user_accounts")
      .select(`
        id,
        auth_user_id,
        employee_id,
        username,
        is_active,
        last_login_at,
        created_at,
        employees (
          employee_code,
          first_name_th,
          last_name_th
        )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const mappedData = (data || []).map((item) => ({
      id: item.id,
      auth_user_id: item.auth_user_id,
      employee_id: item.employee_id || "",
      username: item.username,
      is_active: item.is_active,
      last_login_at: item.last_login_at,
      created_at: item.created_at,
      employee_code: item.employees?.employee_code || "-",
      employee_name:
        `${item.employees?.first_name_th || ""} ${item.employees?.last_name_th || ""}`.trim() || "-",
    }));

    const filteredData = search
      ? mappedData.filter((item) => {
          return (
            item.username?.toLowerCase().includes(search) ||
            item.employee_code?.toLowerCase().includes(search) ||
            item.employee_name?.toLowerCase().includes(search)
          );
        })
      : mappedData;

    return NextResponse.json({
      success: true,
      data: filteredData,
    });
  } catch (error) {
    console.error("GET_USER_ACCOUNTS_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "ไม่สามารถดึงข้อมูลผู้ใช้งานระบบได้",
      },
      { status: 500 }
    );
  }
}

/* =========================
   POST: create user account
========================= */
export async function POST(req) {
  try {
    const body = await req.json();

    const employee_id = body?.employee_id || null;
    const username = body?.username?.trim();
    const password = body?.password?.trim();
    const is_active = body?.is_active ?? true;

    if (!username) {
      return NextResponse.json(
        { success: false, error: "กรุณากรอก Username" },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { success: false, error: "กรุณากรอกรหัสผ่าน" },
        { status: 400 }
      );
    }

    const { data: existingUser, error: existingUserError } = await supabaseAdmin
      .from("user_accounts")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (existingUserError) throw existingUserError;

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Username นี้มีอยู่แล้ว" },
        { status: 400 }
      );
    }

    if (employee_id) {
      const { data: existingEmployee, error: existingEmployeeError } =
        await supabaseAdmin
          .from("user_accounts")
          .select("id")
          .eq("employee_id", employee_id)
          .maybeSingle();

      if (existingEmployeeError) throw existingEmployeeError;

      if (existingEmployee) {
        return NextResponse.json(
          { success: false, error: "พนักงานคนนี้มีบัญชีผู้ใช้งานแล้ว" },
          { status: 400 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const fakeEmail = `${username.toLowerCase()}@local.user`;

    const { data: createdAuthUser, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: fakeEmail,
        password,
        email_confirm: true,
        user_metadata: {
          username,
        },
      });

    if (authError) throw authError;

    const auth_user_id = createdAuthUser.user?.id;

    if (!auth_user_id) {
      throw new Error("ไม่สามารถสร้าง auth user ได้");
    }

    const { data, error } = await supabaseAdmin
      .from("user_accounts")
      .insert([
        {
          auth_user_id,
          employee_id,
          username,
          is_active,
          password_hash: hashedPassword,
        },
      ])
      .select(`
        id,
        auth_user_id,
        employee_id,
        username,
        is_active,
        last_login_at,
        created_at,
        employees (
          employee_code,
          first_name_th,
          last_name_th
        )
      `)
      .single();

    if (error) {
      await supabaseAdmin.auth.admin.deleteUser(auth_user_id);
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "เพิ่มผู้ใช้งานระบบสำเร็จ",
      data: {
        id: data.id,
        auth_user_id: data.auth_user_id,
        employee_id: data.employee_id || "",
        username: data.username,
        is_active: data.is_active,
        last_login_at: data.last_login_at,
        created_at: data.created_at,
        employee_code: data.employees?.employee_code || "-",
        employee_name:
          `${data.employees?.first_name_th || ""} ${data.employees?.last_name_th || ""}`.trim() || "-",
      },
    });
  } catch (error) {
    console.error("CREATE_USER_ACCOUNT_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "ไม่สามารถบันทึกข้อมูลผู้ใช้งานระบบได้",
      },
      { status: 500 }
    );
  }
}