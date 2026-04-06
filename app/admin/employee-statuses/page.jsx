export default function EmployeeStatusesPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-800">
        สถานะพนักงาน
      </h1>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-4 text-green-700">
          Active
        </div>

        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-4 text-yellow-700">
          Probation
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-red-700">
          Resign
        </div>
      </div>
    </div>
  );
}