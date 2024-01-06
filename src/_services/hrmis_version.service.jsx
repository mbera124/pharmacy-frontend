import hrmis_request from "../_helpers/requests";

const getBackendVersion = () => {
  return hrmis_request.get("api/actuator/info");
};

export const appVersion = {
  getBackendVersion,
};
