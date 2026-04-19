import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../config/axios.config";
import type { AxiosRequestConfig } from "axios";
interface IAuthenticatedQuery{
    key:string[],
    url:string,
    config?: AxiosRequestConfig
}
const useAuthenticatedQuery = ({key,url,config}:IAuthenticatedQuery) => {
  return useQuery({
    queryKey : key,
    queryFn: async () => {
      const { data } = await axiosInstance.get(url, config);
      return data;
    },
  });
};

export default useAuthenticatedQuery;