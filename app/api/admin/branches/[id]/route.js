import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
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
      .update({
        branch_code,
        branch_name,
        company_name,
        phone,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(`
        id,
        branch_code,
        branch_name,
        company_name,
        phone,
        status,
        sort_order,
        created_at,
        updated_at
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
      message: "แก้ไขข้อมูลสังกัดสำเร็จ",
      data,
    });
  } catch (error) {
    console.error("UPDATE_BRANCH_ERROR:", error);

    return NextResponse.json(
      { error: "ไม่สามารถแก้ไขข้อมูลสังกัดได้" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    const { error } = await supabaseAdmin
      .from("branches")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "ลบข้อมูลสังกัดสำเร็จ",
    });
  } catch (error) {
    console.error("DELETE_BRANCH_ERROR:", error);

    return NextResponse.json(
      { error: "ไม่สามารถลบข้อมูลสังกัดได้" },
      { status: 500 }
    );
  }
}