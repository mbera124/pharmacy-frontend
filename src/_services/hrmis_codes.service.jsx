import hrmis_request from "../_helpers/requests";
import { CODES } from "../_helpers/apis";

const fetchCodes = (params) => {
  return hrmis_request.get(CODES, { params });
};

const createCode = (data) => {
  return hrmis_request.post(CODES, data);
};
const editCode = (data, id) => {
  return hrmis_request.put(`${CODES}/${id}`, data);
};

const getCodeValues = (params) => {
  return hrmis_request.get(`${CODES}`, { params });
};
const getCodeTypes = () => {
  return hrmis_request.get(`${CODES}/types`);
};

const addCodeValue = (id, data) => {
  return hrmis_request.post(`${CODES}`, data);
};

export const hrCodesService = {
  fetchCodes,
  createCode,
  editCode,
  getCodeTypes,
  getCodeValues,
  addCodeValue,
};
