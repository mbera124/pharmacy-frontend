import hrmis_request from "../_helpers/requests";
import { PERMISSION } from "../_helpers/apis";

const fetchPermission = (params) => {
  return hrmis_request(`${PERMISSION}`, { params });
};

export const hrmisPermission = {
  fetchPermission,
};
