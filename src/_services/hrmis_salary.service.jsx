import request from "../_helpers/requests";
import {
  GET_PROCESSED_SALARIES,
  PROCESS_SALARY,
  GET_POSTED_SALARIES,
  SALARY_POSTING,
  GENERATE_PAYSLIP,
} from "../_helpers/apis";

const getProcessedSalaries = (month, year, StaffNumber) => {
  return request(
    `${GET_PROCESSED_SALARIES}?salaryMonth=${month}&salaryYear=${year}&staffNumber=${StaffNumber}`
  );
};
const getAllProcessedSlaries = (params) => {
  return request(GET_PROCESSED_SALARIES, params);
};
const getPostedSalaries = (month, year, staffNumber) => {
  return request(
    `${GET_POSTED_SALARIES}?salaryMonth=${month}&salaryYear=${year}&staffNumber=${staffNumber}`
  );
};
const getAllPostedSalaries = () => {
  return request(GET_POSTED_SALARIES);
};

const processSalary = (data) => {
  return request.post(PROCESS_SALARY, data);
};
const postSalary = (data) => {
  return request.post(SALARY_POSTING, data);
};
const generateEmail = (month, year, staffNumber) => {
  return request(
    `${GENERATE_PAYSLIP}?salaryMonth=${month}&salaryYear=${year}&staffNumber=${staffNumber}`
  );
};

export const hrSalary = {
  getProcessedSalaries,
  processSalary,
  getPostedSalaries,
  postSalary,
  getAllProcessedSlaries,
  getAllPostedSalaries,
  generateEmail,
};
