import hrmis_request from "../_helpers/requests";
import { LEAVE_APPLICATION } from "../_helpers/apis";

const fetchLeaves = (params) => {
  return hrmis_request(`${LEAVE_APPLICATION}`, { params });
};

const fetchLeaveById = (id) => {
  return hrmis_request(`${LEAVE_APPLICATION}/${id}`);
};

const createLeave = (values) => {
  return hrmis_request.post(LEAVE_APPLICATION, values);
};

const updateLeave = (id, values) => {
  return hrmis_request.put(`${LEAVE_APPLICATION}/${id}`, values);
};

const deleteLeave = (id) => {
  return hrmis_request.delete(`${LEAVE_APPLICATION}/ ${id}`);
};

const approveLeave = (id, values) => {
  return hrmis_request.patch(`${LEAVE_APPLICATION}/${id}`, values);
};

const fetchDaysSelected = (params) => {
  return hrmis_request(`${LEAVE_APPLICATION}/compute-days-applied`, { params });
};

const fetchLeaveBalances = (params) => {
  return hrmis_request(`${LEAVE_APPLICATION}/balances`, { params });
};

export const leaveApplication = {
  fetchLeaves,
  createLeave,
  updateLeave,
  deleteLeave,
  fetchLeaveById,
  approveLeave,
  fetchDaysSelected,
  fetchLeaveBalances,
};
