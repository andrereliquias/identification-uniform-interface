import { useQuery, QueryClient } from "react-query";
import { apiConnection } from "../services/apiConnection";

const queryClient = new QueryClient();

export const fetchPositions = async (companyId, token) => {
  if(!!!companyId) return [];
  
  try {
    const { data } = await apiConnection.get(
      `/positions?companyId=${companyId}`,
      {
        headers: {
          Authorization: token
        },
      }
    );

    return data;

  } catch (error) {
    console.error("Ocorreu um erro ao capturar as posições")
    return []
  }
};

export const usePosition = (companyId, token) => {
  return useQuery(
    `position-${companyId}`,
    () => fetchPositions(companyId, token),
    {
      enabled: !!companyId
    },
    {
      staleTime: 60 * 1000,
      initialData: () => queryClient.getQueryData(`position-${companyId}`),
      initialDataUpdatedAt: () =>
        queryClient.getQueryState(`position-${companyId}`)?.dataUpdatedAt,
    }
  );
};
