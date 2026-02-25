import axios from "axios";

const API = "http://localhost:5000/api/resources";

export const getResources = async () => {
  return await axios.get(API);
};

export const createResource = async (data) => {
  return await axios.post(API, data);
};

export const deleteResource = async (id) => {
  return await axios.delete(`${API}/${id}`);
};