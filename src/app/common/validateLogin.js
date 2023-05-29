import { apiConnection } from "../services/apiConnection";

export default async function validateLogin(token) {
  const response = await apiConnection.post('/validate', {}, {
    headers: {
      Authorization: token
    },
  })

  if (response.status === 204 && response.data.length === 0) {
    return true;
  }

  return false;
}