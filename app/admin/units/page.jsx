export default function UnitsPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">หน่วย</h1>
          <p className="text-sm text-slate-500 mt-1">
            จัดการข้อมูลหน่วยในแต่ละฝ่าย
          </p>
        </div>

        <button className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
          + เพิ่มหน่วย
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-6 py-4 text-left">รหัสหน่วย</th>
              <th className="px-6 py-4 text-left">ชื่อหน่วย</th>
              <th className="px-6 py-4 text-left">ฝ่าย</th>
              <th className="px-6 py-4 text-left">สถานะ</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t border-slate-200">
              <td className="px-6 py-4">IT-INFRA</td>
              <td className="px-6 py-4">Infrastructure</td>
              <td className="px-6 py-4">IT</td>
              <td className="px-6 py-4">Active</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}