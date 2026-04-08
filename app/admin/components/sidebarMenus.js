import { DashboardOutlined,ApartmentOutlined,TeamOutlined,UserOutlined,BankOutlined,SolutionOutlined,IdcardOutlined,SafetyOutlined,KeyOutlined,UsergroupAddOutlined,} from "@ant-design/icons";

export const sidebarMenus = [
  {
    title: "MAIN",
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: <DashboardOutlined />,
      },
    ],
  },
  {
    title: "ORGANIZATION",
    items: [
      {
        label: "สังกัด",
        href: "/admin/branches",
        icon: <BankOutlined />,
      },
      {
        label: "ฝ่าย",
        href: "/admin/departments",
        icon: <ApartmentOutlined />,
      },
      {
        label: "หน่วย",
        href: "/admin/units",
        icon: <TeamOutlined />,
      },
      {
        label: "ตำแหน่ง",
        href: "/admin/positions",
        icon: <SolutionOutlined />,
      },
    ],
  },
  {
    title: "EMPLOYEE MASTER",
    items: [
      {
        label: "พนักงาน",
        href: "/admin/employees",
        icon: <IdcardOutlined />,
      },
      {
        label: "ประเภทการจ้าง",
        href: "/admin/employment-types",
        icon: <UsergroupAddOutlined />,
      },
      {
        label: "สถานะพนักงาน",
        href: "/admin/employee-statuses",
        icon: <SafetyOutlined />,
      },
    ],
  },
  {
    title: "USER ACCESS",
    items: [
      {
        label: "ผู้ใช้งานระบบ",
        href: "/admin/user-accounts",
        icon: <UserOutlined />,
      },
      {
        label: "Roles",
        href: "/admin/roles",
        icon: <SafetyOutlined />,
      },
      {
        label: "Permissions",
        href: "/admin/permissions",
        icon: <KeyOutlined />,
      },
    ],
  },
];