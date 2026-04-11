import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim().toLowerCase() || "";

    const { data, error } = await supabaseAdmin
      .from("divisions")
      .select(`
        id,
        division_code,
        division_name,
        department_id,
        status,
        sort_order,
        created_at,
        departments (
          department_name
        )
      `)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;

    const mappedData = (data || []).map((division) => ({
      id: division.id,
      division_code: division.division_code,
      division_name: division.division_name,
      department_id: division.department_id,
      department_name: division.departments?.department_name || "-",
      status: division.status,
      sort_order: division.sort_order,
      created_at: division.created_at,
    }));

    const filteredData = search
      ? mappedData.filter((item) => {
          return (
            item.division_code?.toLowerCase().includes(search) ||
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
    console.error("GET_DIVISIONS_ERROR:", error);

    return NextResponse.json(
      { error: "ไม่สามารถดึงข้อมูลฝ่ายได้" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const division_code = body?.division_code?.trim();
    const division_name = body?.division_name?.trim();
    const department_id = body?.department_id || null;
    const status = body?.status || "active";

    if (!division_code || !division_name) {
      return NextResponse.json(
        { error: "กรุณากรอกรหัสฝ่ายและชื่อฝ่าย" },
        { status: 400 }
      );
    }

    if (!department_id) {
      return NextResponse.json(
        { error: "กรุณาเลือกแผนก" },
        { status: 400 }
      );
    }

    const { data: existingDivision } = await supabaseAdmin
      .from("divisions")
      .select("id")
      .eq("division_code", division_code)
      .maybeSingle();

    if (existingDivision) {
      return NextResponse.json(
        { error: "รหัสฝ่ายนี้มีอยู่แล้ว" },
        { status: 400 }
      );
    }

    const { data: division, error: insertError } = await supabaseAdmin
      .from("divisions")
      .insert([
        {
          division_code,
          division_name,
          department_id,
          status,
        },
      ])
      .select(`
        id,
        division_code,
        division_name,
        department_id,
        status,
        sort_order,
        created_at,
        departments (
          department_name
        )
      `)
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({
      success: true,
      message: "เพิ่มข้อมูลฝ่ายสำเร็จ",
      data: {
        id: division.id,
        division_code: division.division_code,
        division_name: division.division_name,
        department_id: division.department_id,
        department_name: division.departments?.department_name || "-",
        status: division.status,
        sort_order: division.sort_order,
        created_at: division.created_at,
      },
    });
  } catch (error) {
    console.error("CREATE_DIVISION_ERROR:", error);

    return NextResponse.json(
      { error: "ไม่สามารถบันทึกข้อมูลฝ่ายได้" },
      { status: 500 }
    );
  }
}