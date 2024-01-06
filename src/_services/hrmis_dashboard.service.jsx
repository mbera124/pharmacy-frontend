import hrmis_request from "../_helpers/requests";
import {
  EMPLOYEES_BY_JOB_CATEGORY,
  SALARIES_BY_DEPARTMENT,
  TOTAL_EMPLOYEES,
  TOTAL_SALARIES,
  TOTAL_EMPLOYEES_BY_BENEFITS,
  TOTAL_EMPLOYEES_BY_DEDUCTIONS,
} from "../_helpers/apis";

const fetchTotalEmployees = (params) => {
  return hrmis_request(TOTAL_EMPLOYEES, { params });
};

const fetchSalariesByDepartment = (params) => {
  return hrmis_request(SALARIES_BY_DEPARTMENT, { params });
};
const fetchEmployeesByJobCategory = (params) => {
  return hrmis_request(EMPLOYEES_BY_JOB_CATEGORY, { params });
};
const fetchTotalandAverageSalaries = (params) => {
  return hrmis_request(TOTAL_SALARIES, { params });
};

const fetchTotalEmployeesByBenefits = (params) => {
  return hrmis_request(TOTAL_EMPLOYEES_BY_BENEFITS, { params });
};
const fetchTotalEmployeesByDeductions = (params) => {
  return hrmis_request(TOTAL_EMPLOYEES_BY_DEDUCTIONS, { params });
};

export const hrDashboard = {
  fetchTotalEmployees,
  fetchSalariesByDepartment,
  fetchEmployeesByJobCategory,
  fetchTotalandAverageSalaries,
  fetchTotalEmployeesByBenefits,
  fetchTotalEmployeesByDeductions,
};
