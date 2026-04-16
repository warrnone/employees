import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

/* =========================
   GET: list assigned permissions by role
========================= */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const role_id = searchParams.get("role_id")?.trim() || "";

    if (!role_id) {
      return NextResponse.json(
        { success: false, error: "กรุณาระบุ role_id" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("role_permissions")
      .select(`
        id,
        role_id,
        permission_id,
        permissions (
          id,
          module_code,
          action_code,
          permission_code,
          permission_name,
          description,
          is_active,
          is_system
        )
      `)
      .eq("role_id", role_id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: (data || []).map((item) => ({
        id: item.id,
        role_id: item.role_id,
        permission_id: item.permission_id,
        permission: item.permissions || null,
      })),
    });
  } catch (error) {
    console.error("GET_ROLE_PERMISSIONS_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "ไม่สามารถดึงข้อมูลสิทธิ์ของ Role ได้",
      },
      { status: 500 }
    );
  }
}

/* =========================
   PUT: replace permissions for role
========================= */
export async function PUT(req) {
  try {
    const body = await req.json();

    const role_id = body?.role_id || null;
    const permission_ids = Array.isArray(body?.permission_ids)
      ? [...new Set(body.permission_ids.filter(Boolean))]
      : [];

    if (!role_id) {
      return NextResponse.json(
        { success: false, error: "กรุณาเลือก Role" },
        { status: 400 }
      );
    }

    const { data: role, error: roleError } = await supabaseAdmin
      .from("roles")
      .select("id, role_code, role_name")
      .eq("id", role_id)
      .single();

    if (roleError) throw roleError;

    const { error: deleteError } = await supabaseAdmin
      .from("role_permissions")
      .delete()
      .eq("role_id", role_id);

    if (deleteError) throw deleteError;

    if (permission_ids.length > 0) {
      const rows = permission_ids.map((permission_id) => ({
        role_id,
        permission_id,
      }));

      const { error: insertError } = await supabaseAdmin
        .from("role_permissions")
        .insert(rows);

      if (insertError) throw insertError;
    }

    return NextResponse.json({
      success: true,
      message: `บันทึกสิทธิ์ของ Role ${role.role_name} สำเร็จ`,
    });
  } catch (error) {
    console.error("SAVE_ROLE_PERMISSIONS_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "ไม่สามารถบันทึกสิทธิ์ของ Role ได้",
      },
      { status: 500 }
    );
  }
}