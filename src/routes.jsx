import Dashboard from "./views/Dashboard/components/Home";
import { routes as Settings } from "./views/settings/index";
import { routes as Organization } from "./views/Organization"
import { routes as LeaveManagement } from "./views/leaveManagement";
import { routes as PayRoll} from "./views/payroll"

export const routes = [
  {
    exact: true,
    element: <Dashboard />,
    key: '/home',
    name: 'Home',
  },
  ...Organization,
  ...PayRoll,
  ...LeaveManagement,
  ...Settings,
];
