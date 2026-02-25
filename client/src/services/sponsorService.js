import axios from "axios";

const API = "http://localhost:5000/api/sponsors";

export const getSponsors = async () => {
  return await axios.get(API);
};

export const approveSponsor = async (id) => {
  return await axios.put(`${API}/approve/${id}`);
};

export const rejectSponsor = async (id, reason) => {
  return await axios.put(`${API}/reject/${id}`, { reason });
};