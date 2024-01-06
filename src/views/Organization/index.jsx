import EmployeeList from "./components/employee/Employees";
import Organization from "./components/organization/Organization";
import AddEmployee from "./components/employee/AddEmployee";

export const routes = [
  {
    key: '/organization/employee',
    exact: true,
    element: <EmployeeList />,
    name: 'Employees',
  },
  {
    key: '/organization',
    exact: true,
    element: <Organization />,
    name: 'organization',
  },
  {
    key: '/organization/employee/add',
    exact: true,
    element: <AddEmployee />,
    name: 'new-employee',
  },
];
