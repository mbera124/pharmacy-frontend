import axios from "axios";
import { AUTH_CONFIG } from "../../Config";
import { notification, message } from "antd";
import {
  removeAccess,
  setAccessToken,
  getAccessToken,
} from "./globalVariables";
import { userService } from "../_services";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { CHANGE_PASSWORD } from "./apis";

const isHandlerEnabled = (config = {}) => {
  return config.hasOwnProperty("handlerEnabled") && !config.handlerEnabled
    ? false
    : true;
};

const requestHandler = (request) => {
  if (isHandlerEnabled(request)) {
    // let currentLang = JSON.parse(localStorage.getItem("current_lang"));
    // let token = getAccessToken();
        let token = localStorage.getItem("access_token");

    if (
      token &&
      request.url !== AUTH_CONFIG.AUTH_URL &&
      request.url !== CHANGE_PASSWORD
    ) {
      request.headers["Authorization"] = `Bearer ${token}`;
      request.headers["Content-Type"] = `application/json`;
    }
    // if (currentLang) {
    //   request.headers["Accept-Custom-Lang"] = `${currentLang.be_key}`;
    // }
    request.headers["Access-Control-Allow-Origin"] = "*";
  }
  return request;
};

// const { REACT_APP_PROXY, REACT_APP_WS_PORT, NODE_ENV } = process.env;

const instance = axios.create({
  mode: 'cors',
  baseURL: `http://localhost:9000`,
});

instance.interceptors.request.use((request) => requestHandler(request));

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    //   const language = store?.getState()?.i18n?.phrases;

    const expectedError =
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500;
    if (!expectedError) {
      // Error notification
      notification["error"]({
        message: "System Error",
        description: "An unexpected error occurred.",
      });
    } else {
      const { response } = error;
      const { request, ...errorObject } = response;
      switch (errorObject.status) {
        case 401:
          if (
            errorObject.data &&
            errorObject.data.message != null &&
            errorObject.data.message === "Access is denied"
          ) {
            message.error("Access is denied");
            //   history.push('/access-denied');
          } else {
            message.error(errorObject.data?.error_description);
          }
          break;
        case 403:
          message.error("Unauthorized Access");
          break;
        case 409:
          // Error Notification
          notification["warning"]({
            message: "Server Error",
            description:
              errorObject.data?.message || errorObject.data?.error_description,
          });
          break;
        default:
          // Error Notification
          notification["warning"]({
            message: "Server Message",
            description:
              errorObject.data?.message || errorObject.data?.error_description,
          });
      }
    }

    return Promise.reject(error);
  }
);

const refreshAuthLogic = (failedRequest) =>
  failedRequest.response.data.error === "invalid_token" &&
  userService
    .refreshToken()
    .then((response) => {
      let access_token = response.data.access_token;
      setAccessToken(access_token);

      failedRequest.response.config.headers[
        "Authorization"
      ] = `Bearer ${access_token}`;

      return Promise.resolve();
    })
    .catch((error) => {
      removeAccess();
      message.info("Please log in to continue");

      return Promise.reject(error);
    });

createAuthRefreshInterceptor(instance, refreshAuthLogic, {
  statusCodes: [401],
});

export default instance;
