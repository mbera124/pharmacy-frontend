import hrmis_request from "../_helpers/requests";
import {
  LEAVE_APPROVER,
  LEAVE_APPROVAL,
  LEAVE_REJECTION,
} from "../_helpers/apis";

const createApprover = (person) => {
  return hrmis_request.post(LEAVE_APPROVER, person);
};

const approveLeave = (data) => {
  return hrmis_request.post(LEAVE_APPROVAL, data);
};

const rejectLeave = (data) => {
  return hrmis_request.post(LEAVE_REJECTION, data);
};

const updateApprover = (id, person) => {
  return hrmis_request.put(`${LEAVE_APPROVER}/${id}`, person);
};

const fetchAllApprovers = (params) => {
  return hrmis_request(`api/leave-approvers`, { params });
};

const deleteApprover = (id) => {
  return hrmis_request.delete(`${LEAVE_APPROVER}/${id}`);
};

export const leaveApproverService = {
  fetchAllApprovers,
  createApprover,
  updateApprover,
  deleteApprover,
  approveLeave,
  rejectLeave,
};
