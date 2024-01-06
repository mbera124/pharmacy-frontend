import hrmis_request from "../_helpers/requests";
import { LEAVE_TYPE } from "../_helpers/apis";

const fetchLeaveTypes = (params) => {
  return hrmis_request("api/leave-types", { params });
};

const fetchLeaveTypeById = (id) => {
  return hrmis_request(`${LEAVE_TYPE}/${id}`);
};

const createLeave = (values) => {
  return hrmis_request.post(LEAVE_TYPE, values);
};

const updateLeaveType = (id, values) => {
  return hrmis_request.put(`${LEAVE_TYPE}/${id}`, values);
};

const deleteLeaveType = (id) => {
  return hrmis_request.delete(`${LEAVE_TYPE}/ ${id}`);
};

export const leaveTypeService = {
  fetchLeaveTypes,
  createLeave,
  updateLeaveType,
  deleteLeaveType,
  fetchLeaveTypeById,
};
