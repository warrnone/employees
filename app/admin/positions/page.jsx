export default function PositionsPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">ตำแหน่ง</h1>
          <p className="text-sm text-slate-500 mt-1">
            จัดการข้อมูลตำแหน่งงาน
          </p>
        </div>

        <button className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
          + เพิ่มตำแหน่ง
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-6 py-4 text-left">รหัสตำแหน่ง</th>
              <th className="px-6 py-4 text-left">ชื่อตำแหน่ง</th>
              <th className="px-6 py-4 text-left">หน่วย</th>
              <th className="px-6 py-4 text-left">สถานะ</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t border-slate-200">
              <td className="px-6 py-4">DEV-001</td>
              <td className="px-6 py-4">Frontend Developer</td>
              <td className="px-6 py-4">Application Development</td>
              <td className="px-6 py-4">Active</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}