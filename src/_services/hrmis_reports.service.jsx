import hrmis_request from "../_helpers/requests";
import { HrmisREPORTS } from "../_helpers/apis";

const fetchHrmisReport = (params) => {
  let responseType = null;
  if (params.format !== "HTML") {
    responseType = "blob";
  }
  return hrmis_request.get(HrmisREPORTS, { responseType, params });
};

const fetchHrmisReportWithUrl = (url, params) => {
  let responseType = null;
  if (params.format !== "HTML") {
    responseType = "blob";
  }

  return hrmis_request.get(url, { responseType, params });
};
const generateReport = (params) => {
  return hrmis_request.get(`${HrmisREPORTS}`, { params, responseType: "blob" });
};

export const hrmisReportsService = {
  fetchHrmisReport,
  fetchHrmisReportWithUrl,
  generateReport,
};
