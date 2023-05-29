import { useQuery, QueryClient } from "react-query";
import { apiConnection } from "../services/apiConnection";

const queryClient = new QueryClient();

export const fetchUserData = async (userId, cookie) => {
  try {
    const userResponse = await apiConnection.get(`/users/${userId}`, {
      headers: {
        'Authorization': cookie
      }
    });
    let companyResponse;
    let positionResponse;

    if (!!userResponse.data?.companyId) {
      companyResponse = await apiConnection.get(
        `/companies/${userResponse.data.companyId}`,
        {
          headers: {
            'Authorization': cookie
          }
        }
      );

      positionResponse = await apiConnection.get(
        `/positions?companyId=${userResponse.data.companyId}`,
        {
          headers: {
            'Authorization': cookie
          }
        }
      );
    }

    return {
      user: userResponse.data,
      company: companyResponse?.data,
      position: positionResponse?.data,
    };
  } catch (error) {
    console.error("Erro ao pegar dados de usuário", error);
    return {
      user: null,
      company: null,
      position: null,
    };
  }
};

export const useUserData = (userId, cookie) => {
  return useQuery(
    `user-${userId}-${cookie}`,
    () => fetchUserData(userId, cookie),
    {
      enabled: !!userId && !!cookie,
    },
    {
      staleTime: 60 * 1000,
      initialData: () => queryClient.getQueryData(`user-${userId}-${cookie}`),
      initialDataUpdatedAt: () =>
        queryClient.getQueryState(`user-${userId}-${cookie}`)?.dataUpdatedAt,
    }
  );
};
