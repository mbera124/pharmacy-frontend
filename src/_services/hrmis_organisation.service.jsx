import hrmis_request from "../_helpers/requests";
import { ORGANIZATION, ORGANIZATION_LOGO } from '../_helpers/apis';

const fetchOrganization = (params) => {
  return hrmis_request(ORGANIZATION, { params });
};

const createOrganization = (values) => {
  return hrmis_request.post(ORGANIZATION, values);
};

const updateOrganization = (id, values) => {
  return hrmis_request.put(`${ORGANIZATION}/${id}`, values);
};

const fetchOrganizationLogo = (id) => {
  return hrmis_request(`${ORGANIZATION_LOGO}/${id}`);
};

const createOrganizationLogo = (id, values) => {
  return hrmis_request.post(`${ORGANIZATION_LOGO}/${id}`, values);
};

const updateOrganizationLogo = (id, values) => {
  return hrmis_request.put(`${ORGANIZATION_LOGO}/${id}`, values);
};

const deleteOrganizationLogo = (id) => {
  return hrmis_request.delete(`${ORGANIZATION_LOGO}/${id}`);
};

export const hrOrganization = {
  fetchOrganization,
  createOrganization,
  updateOrganization,
  deleteOrganizationLogo,
  updateOrganizationLogo,
  createOrganizationLogo,
  fetchOrganizationLogo,
};
