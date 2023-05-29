import axios from "axios";
import logout from '../common/logout'
import Cookies from "universal-cookie";

const cookies = new Cookies()

let base = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_LOCAL_API_SYS_URL : process.env.REACT_APP_API_SYS_URL;
export const apiConnection = axios.create({
  baseURL: base,
  headers: {
    Authorization: cookies.get('token')
  },
});

apiConnection.defaults.withCredentials = true;

apiConnection.interceptors.response.use(
  (resp) => {
    return resp
  },
  (error) => {
    console.error('Erro retornado pelo endpoint', error)
    if (error?.response?.status === 401) {
      alert('Por favor, faça login novamente!')

      logout()

      return;
    }

    return Promise.reject(error);
  }
);