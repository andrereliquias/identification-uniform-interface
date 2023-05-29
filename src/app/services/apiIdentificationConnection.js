import axios from "axios";
import logout from '../common/logout'


let base = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_LOCAL_API_IDENTIFICATION_URL : process.env.REACT_APP_API_IDENTIFICATION_URL;
export const apiIdentificationConnection = axios.create({
  baseURL: base
});

apiIdentificationConnection.defaults.withCredentials = true;

apiIdentificationConnection.interceptors.response.use(
  (resp) => {
    return resp
  },
  (error) => {

    if (error.response.status === 401) {
      alert('Por favor, faça login novamente!')

      logout()

      return;
    }

    return Promise.reject(error);
  }
);