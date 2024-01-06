import request from "../_helpers/requests";
import { HR_BANK, HR_BANK_BRANCH } from "../_helpers/apis";

const fetchAllBanks = () => {
  return request(HR_BANK);
};
const fetchAllBranchInBanks = () => {
  return request(HR_BANK_BRANCH);
};
const fetchAllBankBranch = (bankId) => {
  return request(HR_BANK + `/${bankId}/bank-branch`);
};

const createBank = (values) => {
  return request.post(HR_BANK, values);
};

const updateBanks = (bankId, params) => {
  return request.put(`${HR_BANK}/${bankId}`, params);
};

const createBankBranch = (bankId, values) => {
  return request.post(HR_BANK + `/${bankId}/bank-branch`, values);
};

export const bankService = {
  createBank,
  fetchAllBankBranch,
  fetchAllBranchInBanks,
  fetchAllBanks,
  updateBanks,
  createBankBranch,
};
