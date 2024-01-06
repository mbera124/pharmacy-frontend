import hrmis_request from "../_helpers/requests";
import { HOLIDAY } from "../_helpers/apis";

const fetchHolidays = (params) => {
  return hrmis_request("api/holidays", { params });
};

const createHoliday = (values) => {
  return hrmis_request.post(HOLIDAY, values);
};

const updateHoliday = (id, values) => {
  return hrmis_request.put(`${HOLIDAY}/${id}`, values);
};

const deleteHoliday = (id) => {
  return hrmis_request.delete(`${HOLIDAY}/ ${id}`);
};

export const hrmisHolidayService = {
  fetchHolidays,
  createHoliday,
  updateHoliday,
  deleteHoliday,
};
