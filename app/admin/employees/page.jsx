export default function EmployeesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">พนักงาน</h1>
          <p className="text-sm text-slate-500 mt-1">
            จัดการข้อมูลพนักงานทั้งหมดในระบบ
          </p>
        </div>

        <button className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
          + เพิ่มพนักงาน
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm">
        <input
          type="text"
          placeholder="ค้นหาชื่อ / รหัสพนักงาน / ฝ่าย"
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-6 py-4 text-left">รหัสพนักงาน</th>
              <th className="px-6 py-4 text-left">ชื่อ</th>
              <th className="px-6 py-4 text-left">สังกัด</th>
              <th className="px-6 py-4 text-left">ฝ่าย</th>
              <th className="px-6 py-4 text-left">ตำแหน่ง</th>
              <th className="px-6 py-4 text-left">สถานะ</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t border-slate-200">
              <td className="px-6 py-4">EMP000001</td>
              <td className="px-6 py-4">สมชาย ใจดี</td>
              <td className="px-6 py-4">สำนักงานใหญ่</td>
              <td className="px-6 py-4">IT</td>
              <td className="px-6 py-4">Frontend Developer</td>
              <td className="px-6 py-4">Active</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}