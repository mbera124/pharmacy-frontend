import { UserOutlined, PieChartOutlined, SettingOutlined } from "@ant-design/icons";
import { RiBarChart2Fill, RiDoorFill, RiDoorLine } from "react-icons/ri";
import {
  UilFileGraph,
  UilUserCheck,
  UilUsersAlt,
  UilMoneybag,
  UilClockEight,
  UilCalculator,
  UilReceiptAlt,
  UilNotebooks,
  UilEnvelopeStar,
  UilSetting,
  UilHome,
  UilChartLine
} from "@iconscout/react-unicons";
import { FcOrganization } from 'react-icons/fc';
export const NavigationItems = [
  {
    label: 'Dashboard',
    icon: <UilChartLine style={{ color: 'blue' }} />,
    key: '/home',
  },
  {
    label: 'Payroll Management',
    icon: <UilMoneybag style={{ color: 'brown' }} />,
    key: '/payroll_management',
  },
  {
    label: 'Leave Management',
    icon: <UilEnvelopeStar style={{ color: 'purple' }} />,
    key: '/leave',
  },
  {
    label: 'Accounting',
    icon: <UilCalculator />,
    key: '/accounting',
    children: [
      {
        label: 'Budgets',
        icon: <UilReceiptAlt />,
        key: '/accounting/budgets',
      },
    ],
  },
  {
    label: 'Shift Management',
    icon: <UilClockEight style={{color: "maroon"}} />,
    key: '/shift_management',
  },
  {
    label: 'Settings',
    icon: <UilSetting style={{color: "blue"}} />,
    key: '/settings',
  },
  {
    label: 'Organization',
    icon: <UilUserCheck style={{ color: 'green' }} />,
    key: '/employee',
    children: [
      {
        label: 'Employee Management',
        icon: <UilUsersAlt style={{ color: 'purple' }} />,
        key: '/organization/employee',
      },
      {
        label: 'Organization',
        icon: <UilHome style={{ color: 'brown' }} />,
        key: '/organization',
      },
    ],
  },
  {
    label: 'Reports',
    icon: <UilFileGraph style={{ color: 'brown' }} />,
    key: '/reports',
  },
];
