import Settings from "./components/Settings";
import Relief from "./components/relief/Relief";
import Pension from "./components/pension/Pension";
import GlobalConfig from "./components/globalConfig/GlobalConfig";
import Users from "./components/users/Users";
import Approval from "./components/approval/Approval";
import RolesAndPermissions from "./components/rolesAndPermission/RolesAndPermissions";
import NssfTiers from "./components/nssfTiers/NssfTiers";

export const routes = [
  {
    key: '/settings',
    exact: true,
    element: <Settings />,
    name: 'Settings',
  },
  {
    key: 'settings/relief',
    exact: true,
    element: <Relief />,
    name: 'relief',
  },
  {
    key: 'settings/pension',
    exact: true,
    element: <Pension />,
    name: 'pension',
  },
  {
    key: 'settings/globalconfig',
    exact: true,
    element: <GlobalConfig />,
    name: 'globalconfig',
  },
  {
    key: 'settings/users',
    exact: true,
    element: <Users />,
    name: 'users',
  },
  {
    key: 'settings/approval',
    exact: true,
    element: <Approval />,
    name: 'approval',
  },
  {
    key: 'settings/rolesandpermissions',
    exact: true,
    element: <RolesAndPermissions />,
    name: 'rolesandpermission',
  },
  {
    key: 'settings/nssftiers',
    exact: true,
    element: <NssfTiers />,
    name: 'nssftiers',
  },
];