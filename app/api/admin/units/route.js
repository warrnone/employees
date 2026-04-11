import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim().toLowerCase() || "";

    const { data, error } = await supabaseAdmin
      .from("units")
      .select(`
        id,
        unit_code,
        unit_name,
        division_id,
        status,
        sort_order,
        created_at,
        divisions (
          division_name,
          departments (
            department_name
          )
        )
      `)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;

    const mappedData = (data || []).map((unit) => ({
      id: unit.id,
      unit_code: unit.unit_code,
      unit_name: unit.unit_name,
      division_id: unit.division_id,
      division_name: unit.divisions?.division_name || "-",
      department_name:
        unit.divisions?.departments?.department_name || "-",
      status: unit.status,
      sort_order: unit.sort_order,
      created_at: unit.created_at,
    }));

    const filteredData = search
      ? mappedData.filter((item) => {
          return (
            item.unit_code?.toLowerCase().includes(search) ||
            item.unit_name?.toLowerCase().includes(search) ||
            item.division_name?.toLowerCase().includes(search) ||
            item.department_name?.toLowerCase().includes(search)
          );
        })
      : mappedData;

    return NextResponse.json({
      success: true,
      data: filteredData,
    });
  } catch (error) {
    console.error("GET_UNITS_ERROR:", error);

    return NextResponse.json(
      { error: "ไม่สามารถดึงข้อมูลหน่วยได้" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const unit_code = body?.unit_code?.trim();
    const unit_name = body?.unit_name?.trim();
    const division_id = body?.division_id || null;
    const status = body?.status || "active";

    if (!unit_code || !unit_name) {
      return NextResponse.json(
        { error: "กรุณากรอกรหัสหน่วยและชื่อหน่วย" },
        { status: 400 }
      );
    }

    if (!division_id) {
      return NextResponse.json(
        { error: "กรุณาเลือกฝ่าย" },
        { status: 400 }
      );
    }

    const { data: existingUnit } = await supabaseAdmin
      .from("units")
      .select("id")
      .eq("unit_code", unit_code)
      .maybeSingle();

    if (existingUnit) {
      return NextResponse.json(
        { error: "รหัสหน่วยนี้มีอยู่แล้ว" },
        { status: 400 }
      );
    }

    const { data: unit, error: insertError } = await supabaseAdmin
      .from("units")
      .insert([
        {
          unit_code,
          unit_name,
          division_id,
          status,
        },
      ])
      .select(`
        id,
        unit_code,
        unit_name,
        division_id,
        status,
        sort_order,
        created_at,
        divisions (
          division_name,
          departments (
            department_name
          )
        )
      `)
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({
      success: true,
      message: "เพิ่มข้อมูลหน่วยสำเร็จ",
      data: {
        id: unit.id,
        unit_code: unit.unit_code,
        unit_name: unit.unit_name,
        division_id: unit.division_id,
        division_name: unit.divisions?.division_name || "-",
        department_name:
          unit.divisions?.departments?.department_name || "-",
        status: unit.status,
        sort_order: unit.sort_order,
        created_at: unit.created_at,
      },
    });
  } catch (error) {
    console.error("CREATE_UNIT_ERROR:", error);

    return NextResponse.json(
      { error: "ไม่สามารถบันทึกข้อมูลหน่วยได้" },
      { status: 500 }
    );
  }
}