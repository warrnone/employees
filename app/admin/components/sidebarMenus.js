import { DashboardOutlined,ShopOutlined,ApartmentOutlined,ClusterOutlined,TeamOutlined,UserOutlined,BankOutlined,SolutionOutlined,IdcardOutlined,SafetyOutlined,KeyOutlined,UsergroupAddOutlined,} from "@ant-design/icons";

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
        label: "บริษัท",
        href: "/admin/companies",
        icon: <ShopOutlined  />,
      },
      {
        label: "สาขา",
        href: "/admin/branches",
        icon: <BankOutlined />,
      },
      {
        label: "แผนก",
        href: "/admin/departments",
        icon: <ApartmentOutlined />,
      },
      {
        label: "ฝ่าย",
        href: "/admin/divisions",
        icon: <ClusterOutlined />,
      },
      {
        label: "หน่วยงาน",
        href: "/admin/units",
        icon: <TeamOutlined />,
      },
      {
        label: "ตำแหน่ง",
        href: "/admin/positions",
        icon: <SolutionOutlined />,
      },
      {
        label: "ตำแหน่งตามหน่วย",
        href: "/admin/unit-positions",
        icon: <ApartmentOutlined />,
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
        label: "บทบาทผู้ใช้งานในระบบ",
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