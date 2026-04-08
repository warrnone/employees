"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { sidebarMenus } from "./components/sidebarMenus";
import { swalSuccess, swalError , swalConfirm  } from "../components/Swal";
import { Button, Tooltip, Tag } from "antd";
import { LogoutOutlined,LoadingOutlined } from "@ant-design/icons";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const menus = sidebarMenus;

  const handleLogout = async () => {
    const result = await swalConfirm(
      "ออกจากระบบ?",
      "คุณต้องการออกจากระบบ Admin ใช่หรือไม่"
    );

    if (!result.isConfirmed) return;

    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      swalSuccess("Logout สำเร็จ");
      router.push("/login");
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

      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-64 bg-[#0a1628] text-white flex flex-col z-10">

        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0f6e56] flex items-center justify-center text-white text-xs font-bold">
              HW
            </div>
            <div>
              <p className="text-sm font-semibold text-white leading-tight">Employee Master</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Hanuman World · Admin</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {menus.map((group) => (
            <div key={group.title}>
              <p className="px-2 mb-1.5 text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
                {group.title}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActiveMenu(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                        active
                          ? "bg-[#0f6e56] text-white font-medium"
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span>{item.label}</span>
                      {active && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-300" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Logout ใน sidebar */}
        <div className="p-3 border-t border-white/10">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
              loggingOut
                ? "text-slate-500 cursor-not-allowed"
                : "text-slate-400 hover:bg-red-500/10 hover:text-red-400"
            }`}
          >
            {loggingOut ? <LoadingOutlined spin /> : <LogoutOutlined />}
            <span>{loggingOut ? "Signing out..." : "Logout"}</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 ml-64">

        {/* Header */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Admin Panel</h2>
            <p className="text-xs text-slate-400">Manage employee master data</p>
          </div>

          <div className="flex items-center gap-3">
            <Tag color="green" className="rounded-full px-3 text-xs font-medium border-0 bg-emerald-50 text-emerald-700">
              Admin
            </Tag>

            <div className="w-px h-5 bg-slate-200" />

            <Tooltip title="Logout" placement="bottom">
              <Button
                type="text"
                danger
                icon={loggingOut ? <LoadingOutlined spin /> : <LogoutOutlined />}
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center gap-1.5 text-slate-400 hover:text-red-500 text-xs"
              >
                {loggingOut ? "Signing out..." : "Logout"}
              </Button>
            </Tooltip>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}