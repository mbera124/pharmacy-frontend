import PayrollTabs from "./PayrollTabs";

export const routes = [
  {
    key: '/payroll_management',
    exact: true,
    element: <PayrollTabs />,
    name: 'Payroll',
  },
];
