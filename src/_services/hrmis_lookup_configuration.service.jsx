import request from "../_helpers/requests";
import {
  PAYROLL_ITEMS_CONFIGURATIONS,
  EMPLOYEE_PAYROLL_ITEMS_CONFIGURATION,
} from "../_helpers/apis";

const fetchPayrollItemsByType = (params) => {
  return request(`${PAYROLL_ITEMS_CONFIGURATIONS}?payrollItemsType=${params}`);
};
const getAllPayrollItems = (params) => {
  return request(PAYROLL_ITEMS_CONFIGURATIONS, { params });
};
const updatePayrollItem = (id, data) => {
  return request.put(`${PAYROLL_ITEMS_CONFIGURATIONS}/${id}`, data);
};
const deletePayrollItem = (id) => {
  return request.delete(`${PAYROLL_ITEMS_CONFIGURATIONS}/${id}`);
};
const deleteEmployeePayrollItem = (id) => {
  return request.delete(`${EMPLOYEE_PAYROLL_ITEMS_CONFIGURATION}/${id}`);
};

const createPayrollItem = (data) => {
  return request.post(PAYROLL_ITEMS_CONFIGURATIONS, data);
};
const createEmployeePayrollItem = (data) => {
  return request.post(EMPLOYEE_PAYROLL_ITEMS_CONFIGURATION, data);
};
const getEmployeePayrollItem = (staffNumber) => {
  return request.get(
    `${EMPLOYEE_PAYROLL_ITEMS_CONFIGURATION}/${staffNumber}/search`
  );
};
const UpdateEmployeePayrollItem = (id, data) => {
  return request.put(`${EMPLOYEE_PAYROLL_ITEMS_CONFIGURATION}/${id}`, data);
};

export const hrLookupConfigurationService = {
  fetchPayrollItemsByType,
  getAllPayrollItems,
  updatePayrollItem,
  deletePayrollItem,
  createPayrollItem,
  getEmployeePayrollItem,
  deleteEmployeePayrollItem,
  UpdateEmployeePayrollItem,
  createEmployeePayrollItem,
};
