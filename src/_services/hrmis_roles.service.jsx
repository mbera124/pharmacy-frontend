import hrmis_request from "../_helpers/requests";
import { ROLES } from "../_helpers/apis";

const fetchAllRoles = () => {
  return hrmis_request(ROLES);
};

const createRole = (values) => {
  return hrmis_request.post(ROLES, values);
};

const editRole = (values, id) => {
  return hrmis_request.put(`${ROLES}/${id}`, values);
};
const deleteRole = (id) => {
  return hrmis_request.delete(`${ROLES}/${id}`);
};

const updateRolePermissions = (id, values) => {
  return hrmis_request.put(`${ROLES}/${id}/permissions`, values);
};

const fetchRolePermissions = (id) => {
  return hrmis_request(`${ROLES}/${id}/permissions`);
};

export const hrRolesService = {
  fetchAllRoles,
  createRole,
  editRole,
  deleteRole,
  updateRolePermissions,
  fetchRolePermissions,
};
