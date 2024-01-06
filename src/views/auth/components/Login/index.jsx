import ForgotPassword from "./ForgotPassword";

export const loginRoutes = [

  {
    key: "/forgot-password",
    exact: true,
    element: <ForgotPassword/>,
    name: "Forgot Password",
  },
];
