import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../config/axios.config";
import type { AxiosRequestConfig } from "axios";

interface IMutation {
  url: string;
  method?: "post" | "put" | "delete";
  config?: AxiosRequestConfig
}

const useAuthenticatedMutation = ({ url, method = "post", config }: IMutation) => {
  return useMutation({
    mutationFn: async (data?: any) => {
      const isFormData = data instanceof FormData;

      const response = await axiosInstance.request({
        url: typeof data === "number" ? `${url}/${data}` : url,
        method,
        data,
        ...config,
        headers: {
          ...config?.headers,
          ...(isFormData ? { "Content-Type": "multipart/form-data" } : {}),
        },
      });

      return response.data;
    },
  });
};

export default useAuthenticatedMutation;