import { message } from "antd";
import JwtDecode from "jwt-decode";
import * as CryptoJS from "crypto-js";
import { customHistory } from "./history";

let accessToken;
let user;

export const setAccessToken = (params, login = false) => {
  localStorage.setItem("access_token", params);
  accessToken = params;
  if (params) {
    setUser(params, login);
  }
};

export const getAccessToken = () => {
  return accessToken;
};

export const removeAccess = (params) => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("hr_id");
  setAccessToken(null);
};

export const setRefreshToken = (params) => {
  localStorage.setItem("hr_id", encryptJwtToken(params));
};

export function encryptJwtToken(token) {
  const encryptedToken = CryptoJS.AES.encrypt(
    token,
    "eW&$8Qv_#XKm*7T6"
  ).toString();
  return encryptedToken;
}

export function decryptJwtToken(encryptedToken) {
  const bytes = CryptoJS.AES.decrypt(encryptedToken, "eW&$8Qv_#XKm*7T6");
  const token = bytes.toString(CryptoJS.enc.Utf8);
  return token;
}

export const setUser = async (params, login) => {
  try {
    let decoded = JwtDecode(params);

    const { aud, scope, exp, iat, jti, client_id, ...newData } = decoded;
    user = newData;
    if (!user.first_time_login) {
      // history.push("/");
    }

    if (!user.first_time_login && login) {
      customHistory.push("/home");
    }
  } catch (error) {
    message.error(error.message);
  }
};

//Fetching the users details
export const getUser = () => {
  return user;
};

//Users permission validation
export const validatePermission = (params) => {
  // if (!validateEnvironment(params)) {
  //   return false;
  // }
  if (!user?.authorities) return false;

  return !!user.authorities.find((permission) => permission === params);
};

export const getParams = (location) => {
  let searchParams = new URLSearchParams(location.search);
  return {
    query: searchParams.get("query") || "",
  };
};

export const setParams = ({ query }) => {
  let searchParams = new URLSearchParams();
  searchParams.set("query", query || "");
  return searchParams.toString();
};

export const fileDownload = (data, name = "") => {
  const file = new Blob([data]);
  const url = window.URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", name);
  document.body.appendChild(link);
  link.click();

  // Cleanup
  window.URL.revokeObjectURL(link.href);
  document.body.removeChild(link);
};

export const websocketUrl = () => {
  let token = getAccessToken();
  let url = "/ws/websocket";
  if (token) {
    url += "?access_token=" + token;
  }
  return url;
};
