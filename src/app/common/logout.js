import Cookies from 'universal-cookie'

export default function logout() {
  const cookies = new Cookies();

  cookies.remove("token");
  cookies.remove("userData");
  cookies.remove("credentials");

  window.location.href = '/login';
}