import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

function getEmployeeTypeDigit({ nationality, employmentType, positionLevel }) {
  const level = String(positionLevel || "").toUpperCase();

  if (["P9", "P10", "P11", "P12"].includes(level)) {
    return "9";
  }

  if (employmentType === "part_time" || employmentType === "intern") {
    return "4";
  }

  if (nationality === "thai") {
    return "1";
  }

  if (nationality === "non_b") {
    return "2";
  }

  if (nationality === "myanmar") {
    return "3";
  }

  return "5";
}

function getYear2Digits(dateStr) {
  const year = new Date(dateStr).getFullYear();
  return String(year).slice(-2);
}

function padRunning(no) {
  return String(no).padStart(5, "0");
}

/* =========================
   GET: list employees
========================= */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim().toLowerCase() || "";
    const page = Number(searchParams.get("page") || 1);
    const pageSize = Number(searchParams.get("pageSize") || 20);
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error , count  } = await supabaseAdmin
      .from("employees")
      .select(`
        id,
        employee_code,
        first_name_th,
        last_name_th,
        first_name_en,
        last_name_en,
        nick_name,
        gender,
        phone,
        email,
        nationality,
        hire_date,
        employment_type,
        status,
        employee_status_id,
        branch_id,
        department_id,
        division_id,
        unit_id,
        position_id,
        created_at,
        employee_statuses (
          status_name,
          color
        ),
        branches (
          branch_name
        ),
        departments (
          department_name
        ),
        divisions (
          division_name
        ),
        units (
          unit_name
        ),
        positions (
          position_name,
          position_level
        )
      `, { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    const mappedData = (data || []).map((item) => ({
      id: item.id,
      employee_code: item.employee_code,
      first_name_th: item.first_name_th,
      last_name_th: item.last_name_th,
      first_name_en: item.first_name_en || "",
      last_name_en: item.last_name_en || "",
      full_name_th: `${item.first_name_th || ""} ${item.last_name_th || ""}`.trim(),
      nick_name: item.nick_name || "",
      gender: item.gender || "",
      phone: item.phone || "",
      email: item.email || "",
      nationality: item.nationality || "",
      hire_date: item.hire_date || "",
      employment_type: item.employment_type || "",
      status: item.status,
      employee_status_id: item.employee_status_id || "",
      employee_status_name: item.employee_statuses?.status_name || "-",
      employee_status_color: item.employee_statuses?.color || "slate",
      branch_id: item.branch_id || "",
      department_id: item.department_id || "",
      division_id: item.division_id || "",
      unit_id: item.unit_id || "",
      position_id: item.position_id || "",
      branch_name: item.branches?.branch_name || "-",
      department_name: item.departments?.department_name || "-",
      division_name: item.divisions?.division_name || "-",
      unit_name: item.units?.unit_name || "-",
      position_name: item.positions?.position_name || "-",
      position_level: item.positions?.position_level || "",
      created_at: item.created_at,
    }));

    const filteredData = search
      ? mappedData.filter((item) => {
          return (
            item.employee_code?.toLowerCase().includes(search) ||
            item.first_name_th?.toLowerCase().includes(search) ||
            item.last_name_th?.toLowerCase().includes(search) ||
            item.full_name_th?.toLowerCase().includes(search) ||
            item.branch_name?.toLowerCase().includes(search) ||
            item.department_name?.toLowerCase().includes(search) ||
            item.division_name?.toLowerCase().includes(search) ||
            item.unit_name?.toLowerCase().includes(search) ||
            item.position_name?.toLowerCase().includes(search) ||
            item.employee_status_name?.toLowerCase().includes(search)
          );
        })
      : mappedData;

    return NextResponse.json({
      success: true,
      data: filteredData,
      pagination: {
        page,
        pageSize,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
    });
  } catch (error) {
    console.error("GET_EMPLOYEES_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "ไม่สามารถดึงข้อมูลพนักงานได้",
      },
      { status: 500 }
    );
  }
}

/* =========================
   POST: create employee
========================= */
export async function POST(req) {
  try {
    const body = await req.json();

    const first_name_th = body?.first_name_th?.trim();
    const last_name_th = body?.last_name_th?.trim();
    const first_name_en = body?.first_name_en?.trim() || null;
    const last_name_en = body?.last_name_en?.trim() || null;
    const nick_name = body?.nick_name?.trim() || null;
    const gender = body?.gender || null;
    const phone = body?.phone?.trim() || null;
    const email = body?.email?.trim() || null;
    const nationality = body?.nationality || null;
    const hire_date = body?.hire_date || null;
    const employment_type = body?.employment_type || null;
    const employee_status_id = body?.employee_status_id || null;
    const status = body?.status || "active";

    const branch_id = body?.branch_id || null;
    const department_id = body?.department_id || null;
    const division_id = body?.division_id || null;
    const unit_id = body?.unit_id || null;
    const position_id = body?.position_id || null;

    if (!first_name_th || !last_name_th) {
      return NextResponse.json(
        { success: false, error: "กรุณากรอกชื่อและนามสกุล" },
        { status: 400 }
      );
    }

    if (!hire_date) {
      return NextResponse.json(
        { success: false, error: "กรุณาเลือกวันที่เริ่มงาน" },
        { status: 400 }
      );
    }

    if (!branch_id || !department_id || !division_id || !unit_id || !position_id) {
      return NextResponse.json(
        { success: false, error: "กรุณาเลือกสาขา แผนก ฝ่าย หน่วยงาน และตำแหน่งให้ครบ" },
        { status: 400 }
      );
    }

    if (!nationality) {
      return NextResponse.json(
        { success: false, error: "กรุณาเลือกสัญชาติ" },
        { status: 400 }
      );
    }

    if (!employee_status_id) {
      return NextResponse.json(
        { success: false, error: "กรุณาเลือกสถานะพนักงาน" },
        { status: 400 }
      );
    }

    const { data: selectedPosition, error: positionError } = await supabaseAdmin
      .from("positions")
      .select("id, position_level")
      .eq("id", position_id)
      .single();

    if (positionError) throw positionError;

    const employee_type_digit = getEmployeeTypeDigit({
      nationality,
      employmentType: employment_type,
      positionLevel: selectedPosition?.position_level,
    });

    const employee_year_2d = getYear2Digits(hire_date);

    const { data: lastEmployee, error: lastError } = await supabaseAdmin
      .from("employees")
      .select("employee_running_no")
      .eq("employee_type_digit", employee_type_digit)
      .eq("employee_year_2d", employee_year_2d)
      .order("employee_running_no", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (lastError) throw lastError;

    const employee_running_no = (lastEmployee?.employee_running_no || 0) + 1;
    const employee_code = `${employee_type_digit}${employee_year_2d}${padRunning(
      employee_running_no
    )}`;

    const payload = {
      employee_code,
      first_name_th,
      last_name_th,
      first_name_en,
      last_name_en,
      nick_name,
      gender,
      phone,
      email,
      nationality,
      hire_date,
      employment_type,
      employee_status_id,
      status,
      branch_id,
      department_id,
      division_id,
      unit_id,
      position_id,
      employee_type_digit,
      employee_year_2d,
      employee_running_no,
    };

    const { data, error } = await supabaseAdmin
      .from("employees")
      .insert([payload])
      .select(`
        id,
        employee_code,
        first_name_th,
        last_name_th,
        first_name_en,
        last_name_en,
        nick_name,
        gender,
        phone,
        email,
        nationality,
        hire_date,
        employment_type,
        status,
        employee_status_id,
        branch_id,
        department_id,
        division_id,
        unit_id,
        position_id,
        created_at,
        employee_statuses (
          status_name,
          color
        ),
        branches (
          branch_name
        ),
        departments (
          department_name
        ),
        divisions (
          division_name
        ),
        units (
          unit_name
        ),
        positions (
          position_name,
          position_level
        )
      `)
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "เพิ่มข้อมูลพนักงานสำเร็จ",
      data: {
        id: data.id,
        employee_code: data.employee_code,
        first_name_th: data.first_name_th,
        last_name_th: data.last_name_th,
        first_name_en: data.first_name_en || "",
        last_name_en: data.last_name_en || "",
        full_name_th: `${data.first_name_th || ""} ${data.last_name_th || ""}`.trim(),
        nick_name: data.nick_name || "",
        gender: data.gender || "",
        phone: data.phone || "",
        email: data.email || "",
        nationality: data.nationality || "",
        hire_date: data.hire_date || "",
        employment_type: data.employment_type || "",
        status: data.status,
        employee_status_id: data.employee_status_id || "",
        employee_status_name: data.employee_statuses?.status_name || "-",
        employee_status_color: data.employee_statuses?.color || "slate",
        branch_id: data.branch_id || "",
        department_id: data.department_id || "",
        division_id: data.division_id || "",
        unit_id: data.unit_id || "",
        position_id: data.position_id || "",
        branch_name: data.branches?.branch_name || "-",
        department_name: data.departments?.department_name || "-",
        division_name: data.divisions?.division_name || "-",
        unit_name: data.units?.unit_name || "-",
        position_name: data.positions?.position_name || "-",
        position_level: data.positions?.position_level || "",
        created_at: data.created_at,
      },
    });
  } catch (error) {
    console.error("CREATE_EMPLOYEE_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "ไม่สามารถบันทึกข้อมูลพนักงานได้",
      },
      { status: 500 }
    );
  }
}