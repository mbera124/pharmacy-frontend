import hrmis_request from "../_helpers/requests";
import { NHIFBRACKETS, PAYEEBRACKETS } from "../_helpers/apis";
const fetchAllNHIFBrackets = (params) => {
  return hrmis_request(NHIFBRACKETS, { params });
};
const createNHIFBracket = (data) => {
  return hrmis_request.post(NHIFBRACKETS, data);
};
const updateNHIFBracket = (id, data) => {
  return hrmis_request.put(`${NHIFBRACKETS}/${id}`, data);
};
const deleteNHIFBracket = (id) => {
  return hrmis_request.delete(`${NHIFBRACKETS}/${id}`);
};
const fetchAllPAYEEBrackets = (params) => {
  return hrmis_request(PAYEEBRACKETS, { params });
};
const createPAYEEBracket = (data) => {
  return hrmis_request.post(PAYEEBRACKETS, data);
};
const updatePAYEEBracket = (id, data) => {
  return hrmis_request.put(`${PAYEEBRACKETS}/${id}`, data);
};
const deletePAYEEBracket = (id) => {
  return hrmis_request.delete(`${PAYEEBRACKETS}/${id}`);
};

export const hrBracketsService = {
  fetchAllNHIFBrackets,
  createNHIFBracket,
  updateNHIFBracket,
  deleteNHIFBracket,
  fetchAllPAYEEBrackets,
  createPAYEEBracket,
  updatePAYEEBracket,
  deletePAYEEBracket,
};
