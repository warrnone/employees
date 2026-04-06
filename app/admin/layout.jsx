"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { swalSuccess , swalError } from "../components/Swal";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const menus = [
    {
      title: "MAIN",
      items: [
        { label: "Dashboard", href: "/admin" },
      ],
    },
    {
      title: "ORGANIZATION",
      items: [
        { label: "สังกัด", href: "/admin/branches" },
        { label: "ฝ่าย", href: "/admin/departments" },
        { label: "หน่วย", href: "/admin/units" },
        { label: "ตำแหน่ง", href: "/admin/positions" },
      ],
    },
    {
      title: "EMPLOYEE MASTER",
      items: [
        { label: "พนักงาน", href: "/admin/employees" },
        { label: "ประเภทการจ้าง", href: "/admin/employment-types" },
        { label: "สถานะพนักงาน", href: "/admin/employee-statuses" },
      ],
    },
    {
      title: "USER ACCESS",
      items: [
        { label: "ผู้ใช้งานระบบ", href: "/admin/user-accounts" },
        { label: "Roles", href: "/admin/roles" },
        { label: "Permissions", href: "/admin/permissions" },
      ],
    },
  ];

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      swalSuccess("Logout สำเร็จ");
      router.refresh();
    } catch (error) {
      swalError(error);
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  const isActiveMenu = (href) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar — fixed ไม่เลื่อนตาม scroll */}
      <aside className="fixed top-0 left-0 h-screen w-72 bg-slate-900 text-white flex flex-col border-r border-slate-800 z-10">
        <div className="px-6 py-5 border-b border-slate-800">
          <h1 className="text-2xl font-bold tracking-tight">Employee Master</h1>
          <p className="text-sm text-slate-400 mt-1">Admin System</p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {menus.map((group) => (
            <div key={group.title}>
              <p className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                {group.title}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = isActiveMenu(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                        active
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-800">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${
              loggingOut
                ? "bg-slate-600 text-slate-300 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            {loggingOut ? "Signing out..." : "Logout"}
          </button>
        </div>
      </aside>

      {/* Main — เพิ่ม ml-72 ให้ไม่ทับ sidebar */}
      <div className="flex-1 flex flex-col min-w-0 ml-72">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Admin Panel</h2>
            <p className="text-xs text-slate-500">Manage employee master data</p>
          </div>
          <div className="text-sm text-slate-500">Welcome, Admin</div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}