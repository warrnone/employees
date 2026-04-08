import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";

    let query = supabaseAdmin
      .from("branches")
      .select(`
        id,
        branch_code,
        branch_name,
        company_name,
        phone,
        status,
        sort_order,
        created_at
      `)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (search) {
      query = query.or(
        `branch_code.ilike.%${search}%,branch_name.ilike.%${search}%,company_name.ilike.%${search}%`
      );
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error("GET_BRANCHES_ERROR:", error);

    return NextResponse.json(
      { error: "ไม่สามารถดึงข้อมูลสังกัดได้" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const branch_code = body?.branch_code?.trim();
    const branch_name = body?.branch_name?.trim();
    const company_name = body?.company_name?.trim() || null;
    const phone = body?.phone?.trim() || null;
    const status = body?.status || "active";

    if (!branch_code || !branch_name) {
      return NextResponse.json(
        { error: "กรุณากรอกรหัสสังกัดและชื่อสังกัด" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("branches")
      .insert([
        {
          branch_code,
          branch_name,
          company_name,
          phone,
          status,
        },
      ])
      .select(`
        id,
        branch_code,
        branch_name,
        company_name,
        phone,
        status,
        sort_order,
        created_at
      `)
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "รหัสสังกัดนี้มีอยู่แล้ว" },
          { status: 400 }
        );
      }

      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "เพิ่มสังกัดสำเร็จ",
      data,
    });
  } catch (error) {
    console.error("CREATE_BRANCH_ERROR:", error);

    return NextResponse.json(
      { error: "ไม่สามารถบันทึกข้อมูลสังกัดได้" },
      { status: 500 }
    );
  }
}