import request from "../_helpers/requests";
import { PENSION } from "../_helpers/apis";

const fetchPension = () => {
  return request.get(PENSION);
};
const updatePension = (id, values) => {
  return request.put(`${PENSION}/${id}`, values);
};
const createPension = (values) => {
  return request.post(PENSION, values);
};
const deletePension = (id) => {
  return request.delete(`${PENSION}/${id}`);
};
export const hrmisPension = {
  fetchPension,
  updatePension,
  createPension,
  deletePension,
};
