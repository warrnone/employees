export default function DepartmentsPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">ฝ่าย</h1>
          <p className="text-sm text-slate-500 mt-1">
            จัดการข้อมูลฝ่ายในองค์กร
          </p>
        </div>

        <button className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
          + เพิ่มฝ่าย
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-6 py-4 text-left">รหัสฝ่าย</th>
              <th className="px-6 py-4 text-left">ชื่อฝ่าย</th>
              <th className="px-6 py-4 text-left">สังกัด</th>
              <th className="px-6 py-4 text-left">สถานะ</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t border-slate-200">
              <td className="px-6 py-4">HR</td>
              <td className="px-6 py-4">Human Resources</td>
              <td className="px-6 py-4">สำนักงานใหญ่</td>
              <td className="px-6 py-4">Active</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}