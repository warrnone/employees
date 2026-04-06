export default function RolesPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Roles</h1>
          <p className="text-sm text-slate-500 mt-1">
            จัดการบทบาทผู้ใช้งานในระบบ
          </p>
        </div>

        <button className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
          + เพิ่ม Role
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-6 py-4 text-left">Role Code</th>
              <th className="px-6 py-4 text-left">Role Name</th>
              <th className="px-6 py-4 text-left">Description</th>
              <th className="px-6 py-4 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t border-slate-200">
              <td className="px-6 py-4">SUPER_ADMIN</td>
              <td className="px-6 py-4">Super Admin</td>
              <td className="px-6 py-4">ดูแลระบบทั้งหมด</td>
              <td className="px-6 py-4">Active</td>
            </tr>

            <tr className="border-t border-slate-200">
              <td className="px-6 py-4">HR_ADMIN</td>
              <td className="px-6 py-4">HR Admin</td>
              <td className="px-6 py-4">จัดการข้อมูลพนักงาน</td>
              <td className="px-6 py-4">Active</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}