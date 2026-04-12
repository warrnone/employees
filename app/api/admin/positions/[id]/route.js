import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

/* =========================
   PATCH: update position
========================= */
export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const position_code = body?.position_code?.trim();
    const position_name = body?.position_name?.trim();
    const position_level = body?.position_level?.trim() || null;
    const status = body?.status || "active";

    if (!position_code || !position_name) {
      return NextResponse.json(
        {
          success: false,
          error: "กรุณากรอกรหัสตำแหน่งและชื่อตำแหน่ง",
        },
        { status: 400 }
      );
    }

    const { data: existingPosition } = await supabaseAdmin
      .from("positions")
      .select("id")
      .eq("position_code", position_code)
      .neq("id", id)
      .maybeSingle();

    if (existingPosition) {
      return NextResponse.json(
        {
          success: false,
          error: "รหัสตำแหน่งนี้มีอยู่แล้ว",
        },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabaseAdmin
      .from("positions")
      .update({
        position_code,
        position_name,
        position_level,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) throw updateError;

    const { data, error } = await supabaseAdmin
      .from("positions")
      .select(`
        id,
        position_code,
        position_name,
        position_level,
        status,
        sort_order,
        created_at
      `)
      .eq("id", id)
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "อัพเดทข้อมูลตำแหน่งสำเร็จ",
      data,
    });
  } catch (error) {
    console.error("UPDATE_POSITION_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "ไม่สามารถอัพเดทข้อมูลตำแหน่งได้",
      },
      { status: 500 }
    );
  }
}

/* =========================
   DELETE: delete position
========================= */
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    const { error } = await supabaseAdmin
      .from("positions")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "ลบข้อมูลตำแหน่งสำเร็จ",
    });
  } catch (error) {
    console.error("DELETE_POSITION_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "ไม่สามารถลบข้อมูลตำแหน่งได้",
      },
      { status: 500 }
    );
  }
}