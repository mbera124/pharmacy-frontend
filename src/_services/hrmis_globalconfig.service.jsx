import request from "../_helpers/requests";
import { HRMIS_CONFIGURATION } from "../_helpers/apis";
const fetchConfigList = (params) => {
  return request.get(HRMIS_CONFIGURATION, { params });
};
const editConfig = (id, data) => {
  return request.put(`${HRMIS_CONFIGURATION}/${id}`, data);
};
const getConfigById = (id, params) => {
  return request.get(`${HRMIS_CONFIGURATION}/${id}`, params);
};

const getConfiguration = (configName) => {
  return request.get(`${HRMIS_CONFIGURATION}/${configName}/name`);
};

const getConfigurationGroups = () => {
  return request.get(`${HRMIS_CONFIGURATION}/groups`);
};

export const hrmisConfigService = {
  fetchConfigList,
  editConfig,
  getConfigById,
  getConfiguration,
  getConfigurationGroups,
};
