import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/*
|--------------------------------------------------------------------------
| Demo user สำหรับเริ่มระบบก่อน
| ภายหลังค่อยเปลี่ยนเป็น query จาก database จริง
|--------------------------------------------------------------------------
*/
const DEMO_USER = {
  id: "user-001",
  employee_id: "emp-001",
  username: "admin",
  password_hash: bcrypt.hashSync("1234", 10),
  is_active: true,
  role: "admin",
  employee: {
    employee_code: "EMP000001",
    first_name_th: "System",
    last_name_th: "Admin",
  },
};

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

    /*
    |--------------------------------------------------------------------------
    | ตอนนี้ใช้ DEMO_USER ไปก่อน
    | ถ้าภายหลังต่อ DB จริง ให้ query จาก user_accounts
    |--------------------------------------------------------------------------
    */
    const user =
      username === DEMO_USER.username ? DEMO_USER : null;

    if (!user) {
      return NextResponse.json(
        { error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    if (!user.is_active) {
      return NextResponse.json(
        { error: "บัญชีนี้ถูกปิดการใช้งาน" },
        { status: 403 }
      );
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        user_id: user.id,
        employee_id: user.employee_id,
        username: user.username,
        role: user.role,
        employee_code: user.employee.employee_code,
        full_name:
          `${user.employee.first_name_th} ${user.employee.last_name_th}`,
      },
      process.env.JWT_SECRET || "dev-secret-key",
      { expiresIn: "1d" }
    );

    const response = NextResponse.json({
      success: true,
      message: "เข้าสู่ระบบสำเร็จ",
      user: {
        id: user.id,
        employee_id: user.employee_id,
        username: user.username,
        role: user.role,
        employee_code: user.employee.employee_code,
        full_name:
          `${user.employee.first_name_th} ${user.employee.last_name_th}`,
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