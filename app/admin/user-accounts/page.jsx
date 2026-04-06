export default function UserAccountsPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-800">
        ผู้ใช้งานระบบ
      </h1>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-6 py-4 text-left">Username</th>
              <th className="px-6 py-4 text-left">ชื่อพนักงาน</th>
              <th className="px-6 py-4 text-left">Role</th>
              <th className="px-6 py-4 text-left">สถานะ</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t border-slate-200">
              <td className="px-6 py-4">admin</td>
              <td className="px-6 py-4">System Admin</td>
              <td className="px-6 py-4">Super Admin</td>
              <td className="px-6 py-4">Active</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}