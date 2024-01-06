import qs from "qs";
import request from "../_helpers/requests";
import { AUTH_CONFIG } from "../../Config";
import {
  USER,
  ROLES,
  RESET_PASSWORD,
  CHANGE_PASSWORD,
  UPDATE_PASSWORD,
} from "../_helpers/apis";
import { removeAccess } from "../_helpers/globalVariables";
import { decryptJwtToken } from "../_helpers/globalVariables";

const config = {
  url: AUTH_CONFIG.AUTH_URL,
  mode: "cors",
  credentials: "include",
  handlerEnabled: "false",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  auth: {
    username: AUTH_CONFIG.CLIENT_ID,
    password: AUTH_CONFIG.CLIENT_SECRET,
  },
  method: "post",
  data: "",
};

export const authenticate = (username,password) => {

  const credentials = {
    grant_type: "password",
    username: username,
    password: password,
  };
  config.data = qs.stringify(credentials);
  return request(config);
};
export const reset_password = (params) => {
  return request.post(RESET_PASSWORD, null, { params });
};
export const change_password = (params) => {
  return request(CHANGE_PASSWORD, { params });
};
export const updatePassword = (params) => {
  return request.post(UPDATE_PASSWORD, null, { params });
};

function logout() {
  removeAccess();
  history.push("/login");
}

function register() {}

const fetchUser = (params) => {
  return request(USER, { params });
};

const fetchAllRoles = () => {
  return request(ROLES);
};

const createUser = (values) => {
  return request.post(USER, values);
};
const editUser = (username, values) => {
  return request.put(`${USER}/${username}`, values);
};

const fetchUserByUsername = (username) => {
  return request.get(`${USER}/${username}`);
};

const refreshToken = () => {
  const credentials = {
    grant_type: "refresh_token",
    refresh_token: decryptJwtToken(localStorage.getItem("hr_id")),
  };

  config.data = qs.stringify(credentials);

  return request(config);
};

export const userService = {
  logout,
  register,
  fetchUser,
  fetchAllRoles,
  createUser,
  reset_password,
  change_password,
  authenticate,
  refreshToken,
  editUser,
  fetchUserByUsername,
  updatePassword,
};
