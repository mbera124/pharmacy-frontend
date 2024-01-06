import hrmis_request from "../_helpers/requests";

import { DEDUCTION, DEDUCTIONS } from "../_helpers/apis";

const createDeduction = (data) => {
  return hrmis_request.post(DEDUCTION, data);
};
const fetchDeductionByStaffNumber = (staffNumber, data) => {
  return hrmis_request(`${DEDUCTIONS}/${staffNumber}/search`, data);
};
const updateDeduction = (id, data) => {
  return hrmis_request.put(`${DEDUCTIONS}/${id}`, data);
};
const deleteDeduction = (id) => {
  return hrmis_request.delete(`${DEDUCTIONS}/${id}`);
};

export const hrDeductionsService = {
  createDeduction,
  fetchDeductionByStaffNumber,
  updateDeduction,
  deleteDeduction,
};
