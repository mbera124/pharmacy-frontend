import hrmis_request from '../_helpers/requests';
import { NSSF_TIERS } from '../_helpers/apis';

const fetchTiers = (params) => {
  return hrmis_request(`${NSSF_TIERS}`, { params });
};
const fetchTiersTypes = (params) => {
  return hrmis_request(`${NSSF_TIERS}/calculation-type`, { params });
};
const createTier = (values) => {
  return hrmis_request.post(NSSF_TIERS, values);
};
const editTier = (id, values) => {
  return hrmis_request.put(`${NSSF_TIERS}/${id}`, values);
};

const deleteTier = (id) => {
  return hrmis_request.delete(`${NSSF_TIERS}/${id}`);
};

export const hrmisNssfTierService = {
  fetchTiers,
  createTier,
  deleteTier,
  editTier,
  fetchTiersTypes,
};
