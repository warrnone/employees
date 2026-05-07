"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Layout, Avatar, Tag, Button, Tooltip } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  LoadingOutlined,
  HomeOutlined,
} from "@ant-design/icons";

import useAuth from "@/hooks/useAuth";
import { swalSuccess, swalError, swalConfirm } from "../components/Swal";

const { Header, Content } = Layout;

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { user, setUser } = useAuth();

  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    const result = await swalConfirm(
      "ออกจากระบบ?",
      "คุณต้องการออกจากระบบใช่หรือไม่"
    );

    if (!result.isConfirmed) return;
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Logout failed");
      }

      localStorage.removeItem("employee_user");
      setUser(null);

      swalSuccess("Logout สำเร็จ");
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("LOGOUT_ERROR:", error);
      swalError(error?.message || "Logout failed");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <Layout className="min-h-screen bg-slate-100">
      <Header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-[#06192c] px-4 lg:px-8">
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="flex items-center gap-3 text-left"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-sm font-bold text-white">
            HW
          </div>

          <div>
            <div className="text-base font-bold leading-tight text-white">
              HR Portal
            </div>
            <div className="text-xs leading-tight text-slate-400">
              Central HR Platform
            </div>
          </div>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <Tooltip title="กลับหน้า Portal">
            <Button
              type="text"
              icon={<HomeOutlined />}
              onClick={() => router.push("/admin")}
              className="!text-slate-300 hover:!bg-white/10 hover:!text-white"
            />
          </Tooltip>

          <Tag className="m-0 hidden rounded-full border-0 bg-white px-3 py-1 text-xs font-medium text-slate-800 sm:inline-flex">
            {user?.role_name || user?.role_code || "User"}
          </Tag>

          <Avatar
            icon={<UserOutlined />}
            className="!bg-slate-950"
          />

          <Tooltip title="Logout" placement="bottom">
            <Button
              type="text"
              danger
              icon={loggingOut ? <LoadingOutlined spin /> : <LogoutOutlined />}
              onClick={handleLogout}
              disabled={loggingOut}
              className="!text-red-400 hover:!bg-red-500/10 hover:!text-red-500"
            >
              <span className="hidden sm:inline">
                {loggingOut ? "Signing out..." : "Logout"}
              </span>
            </Button>
          </Tooltip>
        </div>
      </Header>

      <Content>{children}</Content>
    </Layout>
  );
}