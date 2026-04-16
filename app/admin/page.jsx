"use client";

import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Employee Master System
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800">
            Login success
          </h2>

          <p className="text-slate-500 mt-2">
            เข้าสู่ระบบสำเร็จแล้ว ตอนนี้สามารถเริ่มสร้างเมนู Employee Master ได้
          </p>
        </div>
      </div>
    </div>
  );
}