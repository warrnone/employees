export default function PermissionsPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Permissions</h1>
          <p className="text-sm text-slate-500 mt-1">
            จัดการสิทธิ์การเข้าถึงเมนูและการใช้งานในระบบ
          </p>
        </div>

        <button className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
          + เพิ่ม Permission
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-6 py-4 text-left">Module</th>
              <th className="px-6 py-4 text-left">Action</th>
              <th className="px-6 py-4 text-left">Description</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t border-slate-200">
              <td className="px-6 py-4">employees</td>
              <td className="px-6 py-4">view</td>
              <td className="px-6 py-4">ดูข้อมูลพนักงาน</td>
            </tr>

            <tr className="border-t border-slate-200">
              <td className="px-6 py-4">employees</td>
              <td className="px-6 py-4">create</td>
              <td className="px-6 py-4">เพิ่มข้อมูลพนักงาน</td>
            </tr>

            <tr className="border-t border-slate-200">
              <td className="px-6 py-4">employees</td>
              <td className="px-6 py-4">edit</td>
              <td className="px-6 py-4">แก้ไขข้อมูลพนักงาน</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}