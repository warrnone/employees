"use client";

import { useMemo, useState } from "react";

export default function EmploymentTypesPage() {
  const [search, setSearch] = useState("");

  const [employmentTypes, setEmploymentTypes] = useState([
    {
      id: 1,
      type_code: "FULLTIME",
      type_name: "พนักงานประจำ",
      status: "active",
    },
    {
      id: 2,
      type_code: "CONTRACT",
      type_name: "พนักงานสัญญาจ้าง",
      status: "active",
    },
    {
      id: 3,
      type_code: "DAILY",
      type_name: "พนักงานรายวัน",
      status: "inactive",
    },
  ]);

  const [form, setForm] = useState({
    type_code: "",
    type_name: "",
    status: "active",
  });

  const [openModal, setOpenModal] = useState(false);

  const filteredEmploymentTypes = useMemo(() => {
    const keyword = search.toLowerCase();

    return employmentTypes.filter((item) => {
      return (
        item.type_code.toLowerCase().includes(keyword) ||
        item.type_name.toLowerCase().includes(keyword)
      );
    });
  }, [employmentTypes, search]);

  const handleCreate = () => {
    if (!form.type_code || !form.type_name) return;

    const newItem = {
      id: Date.now(),
      type_code: form.type_code,
      type_name: form.type_name,
      status: form.status,
    };

    setEmploymentTypes((prev) => [newItem, ...prev]);

    setForm({
      type_code: "",
      type_name: "",
      status: "active",
    });

    setOpenModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              ประเภทการจ้าง
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              จัดการข้อมูลประเภทการจ้างของพนักงานในระบบ
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpenModal(true)}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
          >
            + เพิ่มประเภทการจ้าง
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm">
        <input
          type="text"
          placeholder="ค้นหารหัสประเภทการจ้าง / ชื่อประเภทการจ้าง"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">
                  รหัสประเภทการจ้าง
                </th>
                <th className="px-6 py-4 text-left font-semibold">
                  ชื่อประเภทการจ้าง
                </th>
                <th className="px-6 py-4 text-left font-semibold">สถานะ</th>
                <th className="px-6 py-4 text-right font-semibold">จัดการ</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmploymentTypes.length > 0 ? (
                filteredEmploymentTypes.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-slate-200 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {item.type_code}
                    </td>

                    <td className="px-6 py-4 text-slate-700">
                      {item.type_name}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          item.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="rounded-xl border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    ไม่พบข้อมูลประเภทการจ้าง
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-xl font-bold text-slate-800">
                เพิ่มประเภทการจ้าง
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                กรอกข้อมูลประเภทการจ้างใหม่
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  รหัสประเภทการจ้าง
                </label>
                <input
                  type="text"
                  value={form.type_code}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      type_code: e.target.value,
                    }))
                  }
                  placeholder="เช่น FULLTIME"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  ชื่อประเภทการจ้าง
                </label>
                <input
                  type="text"
                  value={form.type_name}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      type_name: e.target.value,
                    }))
                  }
                  placeholder="เช่น พนักงานประจำ"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  สถานะ
                </label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
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
                onClick={() => setOpenModal(false)}
                className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleCreate}
                className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}