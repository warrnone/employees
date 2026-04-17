"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Tag,
  Button,
  Avatar,
  List,
  Typography,
} from "antd";
import {
  TeamOutlined,
  ApartmentOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
  ArrowUpOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SolutionOutlined,
  BankOutlined,
  DeploymentUnitOutlined,
} from "@ant-design/icons";
import useAuth from "@/hooks/useAuth";
import { hasPermission } from "@/lib/permissions";

const { Title, Text } = Typography;

export default function AdminPage() {
  const router = useRouter();
  const { user, loadingUser } = useAuth();

  const canView = hasPermission(user, "dashboard.view");

  useEffect(() => {
    if (loadingUser) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!canView) {
      router.replace("/admin");
    }
  }, [user, canView, loadingUser, router]);

  const summaryCards = useMemo(
    () => [
      {
        title: "พนักงานทั้งหมด",
        value: 248,
        suffix: "คน",
        icon: <TeamOutlined />,
        growth: "+12%",
        note: "อัปเดตจากเดือนที่ผ่านมา",
      },
      {
        title: "บัญชีผู้ใช้งาน",
        value: 86,
        suffix: "บัญชี",
        icon: <UserOutlined />,
        growth: "+5%",
        note: "พร้อมเข้าใช้งานระบบ",
      },
      {
        title: "Roles & Permissions",
        value: 24,
        suffix: "รายการ",
        icon: <SafetyCertificateOutlined />,
        growth: "+3%",
        note: "โครงสร้างสิทธิ์ปัจจุบัน",
      },
      {
        title: "หน่วยงาน / ฝ่าย",
        value: 37,
        suffix: "หน่วย",
        icon: <ApartmentOutlined />,
        growth: "+8%",
        note: "โครงสร้างองค์กรล่าสุด",
      },
    ],
    []
  );

  const quickMenus = useMemo(
    () => [
      {
        title: "พนักงาน",
        desc: "จัดการข้อมูลพนักงานหลักในระบบ",
        icon: <TeamOutlined />,
        href: "/admin/employees",
      },
      {
        title: "ผู้ใช้งานระบบ",
        desc: "จัดการบัญชีสำหรับเข้าใช้งาน",
        icon: <UserOutlined />,
        href: "/admin/user-accounts",
      },
      {
        title: "Roles",
        desc: "กำหนดบทบาทการใช้งาน",
        icon: <SafetyCertificateOutlined />,
        href: "/admin/roles",
      },
      {
        title: "Permissions",
        desc: "จัดการสิทธิ์แยกตาม module",
        icon: <SolutionOutlined />,
        href: "/admin/permissions",
      },
      {
        title: "บริษัท / สาขา",
        desc: "โครงสร้างระดับบริษัทและสังกัด",
        icon: <BankOutlined />,
        href: "/admin/companies",
      },
      {
        title: "แผนก / ฝ่าย / หน่วย",
        desc: "จัดการโครงสร้างองค์กรภายใน",
        icon: <DeploymentUnitOutlined />,
        href: "/admin/departments",
      },
    ],
    []
  );

  const activities = useMemo(
    () => [
      {
        title: "อัปเดตสิทธิ์ผู้ใช้งาน HR Manager",
        time: "10 นาทีที่แล้ว",
        status: "success",
      },
      {
        title: "เพิ่มประเภทการจ้างใหม่",
        time: "35 นาทีที่แล้ว",
        status: "processing",
      },
      {
        title: "แก้ไขข้อมูลโครงสร้างหน่วยงาน",
        time: "1 ชั่วโมงที่แล้ว",
        status: "default",
      },
      {
        title: "สร้างบัญชีผู้ใช้งานใหม่",
        time: "วันนี้ 08:45",
        status: "success",
      },
    ],
    []
  );

  if (loadingUser) return null;
  if (!user) return null;
  if (!canView) return null;

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="space-y-6 p-4 lg:p-6">
        {/* Hero */}
        <Card
          bordered={false}
          className="overflow-hidden rounded-[28px] shadow-sm"
          bodyStyle={{ padding: 0 }}
        >
          <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 px-6 py-8 text-white lg:px-8 lg:py-10">
            <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
              <div className="h-full w-full bg-[radial-gradient(circle_at_top_right,white,transparent_55%)]" />
            </div>

            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-3 flex items-center gap-2">
                  <Tag className="m-0 rounded-full border-0 bg-white/15 px-3 py-1 text-white">
                    Employee Master
                  </Tag>
                  <Tag className="m-0 rounded-full border-0 bg-emerald-500/20 px-3 py-1 text-emerald-200">
                    Dashboard
                  </Tag>
                </div>

                <Title level={2} className="!mb-2 !text-white">
                  ยินดีต้อนรับ{user?.full_name ? `, ${user.full_name}` : ""}
                </Title>

                <Text className="text-white/80 text-base">
                  ภาพรวมการจัดการข้อมูลพนักงาน โครงสร้างองค์กร และสิทธิ์ผู้ใช้งาน
                  ในระบบ Employee Master
                </Text>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Button
                    type="primary"
                    size="large"
                    className="!rounded-2xl !border-0 !bg-white !px-5 !text-slate-900 hover:!bg-slate-100"
                    onClick={() => router.push("/admin/employees")}
                  >
                    ไปหน้าพนักงาน
                  </Button>

                  <Button
                    size="large"
                    className="!rounded-2xl !border-white/20 !bg-white/10 !px-5 !text-white hover:!border-white/30 hover:!bg-white/15 hover:!text-white"
                    onClick={() => router.push("/admin/user-accounts")}
                  >
                    จัดการผู้ใช้งาน
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4 self-start rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur">
                <Avatar
                  size={64}
                  icon={<UserOutlined />}
                  className="!bg-emerald-500"
                />
                <div>
                  <div className="text-lg font-semibold">
                    {user?.full_name || user?.username || "-"}
                  </div>
                  <div className="text-sm text-white/70">
                    {user?.role_name || user?.role_code || "User"}
                  </div>
                  <div className="mt-2">
                    <Tag className="m-0 rounded-full border-0 bg-emerald-400/20 px-3 py-1 text-emerald-200">
                      Active Session
                    </Tag>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Summary */}
        <Row gutter={[16, 16]}>
          {summaryCards.map((item) => (
            <Col xs={24} sm={12} xl={6} key={item.title}>
              <Card
                bordered={false}
                className="rounded-[24px] shadow-sm"
                bodyStyle={{ padding: 20 }}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-lg text-slate-700">
                    {item.icon}
                  </div>

                  <Tag className="m-0 rounded-full border-0 bg-emerald-50 text-emerald-700">
                    <ArrowUpOutlined /> {item.growth}
                  </Tag>
                </div>

                <Statistic
                  title={<span className="text-slate-500">{item.title}</span>}
                  value={item.value}
                  suffix={item.suffix}
                  valueStyle={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                />

                <div className="mt-3 text-sm text-slate-400">{item.note}</div>
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]}>
          {/* Quick actions */}
          <Col xs={24} xl={14}>
            <Card
              title={
                <div>
                  <div className="text-lg font-semibold text-slate-800">
                    เมนูลัดสำหรับผู้ดูแลระบบ
                  </div>
                  <div className="text-sm font-normal text-slate-400">
                    เข้าถึงเมนูหลักได้รวดเร็วขึ้น
                  </div>
                </div>
              }
              bordered={false}
              className="rounded-[24px] shadow-sm"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {quickMenus.map((menu) => (
                  <button
                    key={menu.title}
                    type="button"
                    onClick={() => router.push(menu.href)}
                    className="group rounded-[22px] border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
                  >
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition group-hover:bg-slate-900 group-hover:text-white">
                      {menu.icon}
                    </div>
                    <div className="text-base font-semibold text-slate-800">
                      {menu.title}
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      {menu.desc}
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </Col>

          {/* System health */}
          <Col xs={24} xl={10}>
            <Card
              title={
                <div>
                  <div className="text-lg font-semibold text-slate-800">
                    ภาพรวมระบบ
                  </div>
                  <div className="text-sm font-normal text-slate-400">
                    สถานะข้อมูลและความพร้อมใช้งาน
                  </div>
                </div>
              }
              bordered={false}
              className="rounded-[24px] shadow-sm"
            >
              <div className="space-y-5">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-slate-500">ความสมบูรณ์ของข้อมูลพนักงาน</span>
                    <span className="font-semibold text-slate-700">84%</span>
                  </div>
                  <Progress percent={84} showInfo={false} strokeColor="#0f172a" />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-slate-500">ความพร้อมของสิทธิ์ผู้ใช้งาน</span>
                    <span className="font-semibold text-slate-700">91%</span>
                  </div>
                  <Progress percent={91} showInfo={false} strokeColor="#059669" />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-slate-500">โครงสร้างองค์กรที่ตั้งค่าครบ</span>
                    <span className="font-semibold text-slate-700">76%</span>
                  </div>
                  <Progress percent={76} showInfo={false} strokeColor="#2563eb" />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-3 flex items-center gap-2 text-slate-700">
                    <CheckCircleOutlined className="text-emerald-600" />
                    <span className="font-semibold">System Status</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Tag className="m-0 rounded-full border-0 bg-emerald-100 text-emerald-700">
                      API Ready
                    </Tag>
                    <Tag className="m-0 rounded-full border-0 bg-blue-100 text-blue-700">
                      Auth Connected
                    </Tag>
                    <Tag className="m-0 rounded-full border-0 bg-amber-100 text-amber-700">
                      Permission Active
                    </Tag>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {/* Activity */}
          <Col xs={24} xl={12}>
            <Card
              title={
                <div>
                  <div className="text-lg font-semibold text-slate-800">
                    กิจกรรมล่าสุด
                  </div>
                  <div className="text-sm font-normal text-slate-400">
                    ตัวอย่าง timeline สำหรับ dashboard
                  </div>
                </div>
              }
              bordered={false}
              className="rounded-[24px] shadow-sm"
            >
              <List
                dataSource={activities}
                renderItem={(item) => (
                  <List.Item className="!px-0">
                    <div className="flex w-full items-start gap-3">
                      <div
                        className={`mt-1 h-9 w-9 shrink-0 rounded-xl flex items-center justify-center ${
                          item.status === "success"
                            ? "bg-emerald-100 text-emerald-700"
                            : item.status === "processing"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <ClockCircleOutlined />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-slate-800">
                          {item.title}
                        </div>
                        <div className="mt-1 text-sm text-slate-400">
                          {item.time}
                        </div>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          {/* Overview */}
          <Col xs={24} xl={12}>
            <Card
              title={
                <div>
                  <div className="text-lg font-semibold text-slate-800">
                    ภาพรวมการใช้งาน
                  </div>
                  <div className="text-sm font-normal text-slate-400">
                    ข้อมูลสรุประดับระบบ
                  </div>
                </div>
              }
              bordered={false}
              className="rounded-[24px] shadow-sm"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm text-slate-400">Role ปัจจุบัน</div>
                  <div className="mt-1 text-lg font-semibold text-slate-800">
                    {user?.role_name || user?.role_code || "-"}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm text-slate-400">Username</div>
                  <div className="mt-1 text-lg font-semibold text-slate-800">
                    {user?.username || "-"}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm text-slate-400">Employee Code</div>
                  <div className="mt-1 text-lg font-semibold text-slate-800">
                    {user?.employee_code || "-"}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm text-slate-400">Permissions</div>
                  <div className="mt-1 text-lg font-semibold text-slate-800">
                    {Array.isArray(user?.permissions) ? user.permissions.length : 0}
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
                ตอนนี้หน้า dashboard ใช้ข้อมูลตัวอย่างเพื่อออกแบบ UI ก่อน
                ภายหลังสามารถต่อ API จริงสำหรับ employee count, roles count,
                active users, recent activity ได้ทันที
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}