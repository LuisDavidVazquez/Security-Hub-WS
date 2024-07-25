import axios from "axios";
import dotenv from "dotenv"

dotenv.config()

const url = process.env.API_REST_URL;

export const authenticateSocket = async (token : string) => {
  const response = await axios.post(`${url}/users/auth/${token}`);
  if (response.data.err) {
    throw new Error("Token de autenticación inválido");
  }
  return true;
};
