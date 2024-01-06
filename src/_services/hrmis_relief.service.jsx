import request from "../_helpers/requests";
import { RELIEF } from "../_helpers/apis";

const fetchRelief = () => {
  return request.get(RELIEF);
};
const updateRelief = (id, values) => {
  return request.put(`${RELIEF}/${id}`, values);
};
const createRelief = (values) => {
  return request.post(RELIEF, values);
};
const deleteRelief = (id) => {
  return request.delete(`${RELIEF}/${id}`);
};
export const hrmisRelief = {
  fetchRelief,
  updateRelief,
  createRelief,
  deleteRelief,
};
