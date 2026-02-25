import axios from "axios";

const API = "http://localhost:5000/api/venues";

export const getVenues = async () => {
  return await axios.get(API);
};

export const createVenue = async (data) => {
  return await axios.post(API, data);
};

export const updateVenue = async (id, data) => {
  return await axios.put(`${API}/${id}`, data);
};

export const deleteVenue = async (id) => {
  return await axios.delete(`${API}/${id}`);
};