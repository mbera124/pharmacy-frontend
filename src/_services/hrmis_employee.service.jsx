import hrmis_request from "../_helpers/requests";
import { HR_EMPLOYEE } from "../_helpers/apis";

const createEmployee = (person) => {
  return hrmis_request.post(HR_EMPLOYEE, person);
};

const updateEmployee = (id, person) => {
  return hrmis_request.put(`${HR_EMPLOYEE}/${id}`, person);
};

const fetchAllEmployees = (params) => {
  return hrmis_request(HR_EMPLOYEE, { params });
};

const fetchEmployees = (params) => {
  return hrmis_request(`api/employees`, { params });
};
function fetchEmployeesByDepartment(params) {
  return hrmis_request(HR_EMPLOYEE, { params });
}

const fetchEmployeesByCategory = (params) => {
  return hrmis_request(HR_EMPLOYEE, { params });
};

const fetchEmployeesPhoto = (employeeId) => {
  return hrmis_request(`${HR_EMPLOYEE}/${employeeId}/profile-photo`);
};

const deleteEmployeePhoto = (employeeId) => {
  return hrmis_request.delete(`${HR_EMPLOYEE}/${employeeId}/profile-photo`);
};

export const hrEmployeeService = {
  fetchAllEmployees,
  createEmployee,
  fetchEmployeesByCategory,
  fetchEmployeesByDepartment,
  updateEmployee,
  fetchEmployees,
  fetchEmployeesPhoto,
  deleteEmployeePhoto,
};
