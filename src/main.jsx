import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "antd/dist/reset.css";
import "bootstrap/dist/css/bootstrap.css";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import { CustomBrowserRouter } from "./_helpers/history";
import { ConfigProvider } from "antd";
import frFR from 'antd/locale/fr_FR';
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <CustomBrowserRouter>
    <ConfigProvider locale={frFR}>
      <App />
      </ConfigProvider>
    </CustomBrowserRouter>
  </Provider>
);
