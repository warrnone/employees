"use client";

import { useEffect, useMemo, useState } from "react";
import {
  swalConfirm,
  swalError,
  swalSuccess,
} from "../../components/Swal";

const initialForm = {
  code: "",
  name: "",
  department_id: "",
  parent_unit_id: "",
  unit_level: "division",
  status: "active",
};

export default function UnitsPage() {
  const [search, setSearch] = useState("");
  const [units, setUnits] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [form, setForm] = useState(initialForm);

  const loadDepartments = async () => {
    try {
      const res = await fetch("/api/admin/departments", {
        method: "GET",
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Load departments failed");
      }

      setDepartments(data.data || []);
    } catch (err) {
      console.error(err);
      swalError(err.message || "ไม่สามารถโหลดข้อมูลฝ่ายได้");
    }
  };

  const loadUnits = async (keyword = "") => {
    try {
      setLoading(true);
      setError("");

      const url = keyword
        ? `/api/admin/units?search=${encodeURIComponent(keyword)}`
        : "/api/admin/units";

      const res = await fetch(url, {
        method: "GET",
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Load units failed");
      }

      setUnits(data.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
    loadUnits();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadUnits(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const resetForm = () => {
    setForm(initialForm);
    setEditingUnit(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    resetForm();
    setOpenModal(false);
  };

  const handleOpenEdit = (unit) => {
    setEditingUnit(unit);

    setForm({
      code: unit.unit_code || "",
      name: unit.unit_name || "",
      department_id: unit.department_id || "",
      parent_unit_id: unit.parent_unit_id || "",
      unit_level: unit.unit_level || "division",
      status: unit.status || "active",
    });

    setOpenModal(true);
  };

  const availableParentUnits = useMemo(() => {
    return units.filter(
      (unit) =>
        unit.department_id === form.department_id &&
        unit.unit_level === "division" &&
        unit.id !== editingUnit?.id
    );
  }, [units, form.department_id, editingUnit]);

  const handleSave = async () => {
    if (!form.code.trim() || !form.name.trim()) {
      swalError("กรุณากรอกรหัสหน่วยและชื่อหน่วย");
      return;
    }

    if (!form.department_id) {
      swalError("กรุณาเลือกฝ่าย / แผนก");
      return;
    }

    if (form.unit_level === "unit" && !form.parent_unit_id) {
      swalError("กรุณาเลือกหน่วยหลัก");
      return;
    }

    try {
      setSaving(true);

      const isEdit = !!editingUnit;

      const url = isEdit
        ? `/api/admin/units/${editingUnit.id}`
        : "/api/admin/units";

      const method = isEdit ? "PATCH" : "POST";

      const payload = {
        unit_code: form.code.trim(),
        unit_name: form.name.trim(),
        department_id: form.department_id,
        parent_unit_id:
          form.unit_level === "division"
            ? null
            : form.parent_unit_id || null,
        unit_level: form.unit_level,
        status: form.status,
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Save failed");
      }

      swalSuccess(
        isEdit
          ? "อัพเดทข้อมูลหน่วยเรียบร้อยแล้ว"
          : "เพิ่มข้อมูลหน่วยเรียบร้อยแล้ว"
      );

      handleCloseModal();
      loadUnits(search);
    } catch (err) {
      console.error(err);
      swalError(err.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (unit) => {
    const confirmed = await swalConfirm(
      `ต้องการลบหน่วย ${unit.unit_name} ใช่หรือไม่?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(unit.id);

      const res = await fetch(`/api/admin/units/${unit.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Delete failed");
      }

      swalSuccess("ลบข้อมูลเรียบร้อยแล้ว");
      loadUnits(search);
    } catch (err) {
      console.error(err);
      swalError(err.message || "เกิดข้อผิดพลาดในการลบข้อมูล");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">หน่วย</h1>
            <p className="text-sm text-slate-500 mt-1">
              จัดการข้อมูล Division และ Unit ภายในแต่ละฝ่าย
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
          >
            + เพิ่มหน่วย
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm">
        <input
          type="text"
          placeholder="ค้นหารหัสหน่วย / ชื่อหน่วย / ฝ่าย"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
        />
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-6 py-4 text-left">รหัสหน่วย</th>
                <th className="px-6 py-4 text-left">ชื่อหน่วย</th>
                <th className="px-6 py-4 text-left">ประเภท</th>
                <th className="px-6 py-4 text-left">ฝ่าย / แผนก</th>
                <th className="px-6 py-4 text-left">หน่วยหลัก</th>
                <th className="px-6 py-4 text-left">สถานะ</th>
                <th className="px-6 py-4 text-right">จัดการ</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-t border-slate-200">
                    <td className="px-6 py-4"><div className="h-4 w-20 animate-pulse rounded bg-slate-200" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-40 animate-pulse rounded bg-slate-200" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-20 animate-pulse rounded-full bg-slate-200" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-32 animate-pulse rounded bg-slate-200" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-24 animate-pulse rounded bg-slate-200" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-20 animate-pulse rounded-full bg-slate-200" /></td>
                    <td className="px-6 py-4"><div className="ml-auto h-8 w-24 animate-pulse rounded bg-slate-200" /></td>
                  </tr>
                ))
              ) : units.length > 0 ? (
                units.map((unit) => (
                  <tr key={unit.id} className="border-t border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {unit.unit_code}
                    </td>

                    <td className="px-6 py-4 text-slate-700">
                      {unit.unit_name}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          unit.unit_level === "division"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {unit.unit_level === "division" ? "Division" : "Unit"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {unit.department_name || "-"}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {unit.parent_unit_name || "-"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          unit.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {unit.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(unit)}
                          className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(unit)}
                          disabled={deletingId === unit.id}
                          className={`rounded-xl border px-3 py-2 text-xs font-medium ${
                            deletingId === unit.id
                              ? "border-slate-200 text-slate-400 cursor-not-allowed"
                              : "border-red-200 text-red-600 hover:bg-red-50"
                          }`}
                        >
                          {deletingId === unit.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-400">
                    ไม่พบข้อมูลหน่วย
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-xl font-bold text-slate-800">
                {editingUnit ? "แก้ไขหน่วย" : "เพิ่มหน่วย"}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  รหัสหน่วย
                </label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, code: e.target.value }))
                  }
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  ชื่อหน่วย
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  ประเภทหน่วย
                </label>
                <select
                  value={form.unit_level}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      unit_level: e.target.value,
                      parent_unit_id: "",
                    }))
                  }
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
                >
                  <option value="division">Division</option>
                  <option value="unit">Unit</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  ฝ่าย / แผนก
                </label>
                <select
                  value={form.department_id}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      department_id: e.target.value,
                      parent_unit_id: "",
                    }))
                  }
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
                >
                  <option value="">เลือกฝ่าย</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.department_name}
                    </option>
                  ))}
                </select>
              </div>

              {form.unit_level === "unit" && (
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    หน่วยหลัก (Division)
                  </label>
                  <select
                    value={form.parent_unit_id}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        parent_unit_id: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
                  >
                    <option value="">เลือกหน่วยหลัก</option>
                    {availableParentUnits.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.unit_name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  สถานะ
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className={`rounded-2xl px-5 py-3 text-sm font-semibold text-white ${
                  saving
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-slate-900 hover:bg-slate-800"
                }`}
              >
                {saving ? "Saving..." : editingUnit ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}