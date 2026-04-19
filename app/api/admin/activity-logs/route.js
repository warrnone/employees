import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search")?.trim().toLowerCase() || "";
    const module_name = searchParams.get("module_name")?.trim() || "";
    const action_type = searchParams.get("action_type")?.trim() || "";

    const page = Math.max(Number(searchParams.get("page") || 1), 1);
    const pageSize = Math.max(Number(searchParams.get("pageSize") || 20), 1);

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabaseAdmin
      .from("activity_logs")
      .select(`
        id,
        user_id,
        module_name,
        action_type,
        reference_table,
        reference_id,
        description,
        old_data,
        new_data,
        created_at
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    let filteredData = (data || []).filter((item) => {
      const matchSearch =
        !search ||
        item.module_name?.toLowerCase().includes(search) ||
        item.action_type?.toLowerCase().includes(search) ||
        item.reference_table?.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search) ||
        String(item.reference_id || "").toLowerCase().includes(search);

      const matchModule =
        !module_name || item.module_name === module_name;

      const matchAction =
        !action_type || item.action_type === action_type;

      return matchSearch && matchModule && matchAction;
    });

    const total = filteredData.length;
    const paginatedData = filteredData.slice(from, to + 1);

    return NextResponse.json({
      success: true,
      data: paginatedData,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("GET_ACTIVITY_LOGS_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "ไม่สามารถดึงข้อมูล activity logs ได้",
      },
      { status: 500 }
    );
  }
}