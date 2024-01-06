import request from "../_helpers/requests";
import { APPROVAL, APPROVAL_HISTORY, MODULE_APPROVER } from "../_helpers/apis";

const fetchApprovals = (params) => {
  return request(`${APPROVAL}`, { params });
};
const createApprovals = (values) => {
  return request.post(APPROVAL, values);
};
const editApprovals = (id, values) => {
  return request.put(`${APPROVAL}/${id}`, values);
};

const deleteApprover = (id) => {
  return request.delete(`${MODULE_APPROVER}/${id}`);
};

const createApprover = (values) => {
  return request.post(MODULE_APPROVER, values);
};
const getApprovers = (module_name) => {
  return request(`${MODULE_APPROVER}/${module_name}`);
};

const fetchApprovalHistory = (module_name, requestNo) => {
  return request(`${APPROVAL_HISTORY}/${module_name}/${requestNo}`);
};

export const hrmisApprovalService = {
  fetchApprovals,
  createApprovals,
  deleteApprover,
  createApprover,
  getApprovers,
  fetchApprovalHistory,
  editApprovals,
};
