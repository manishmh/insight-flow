// useFetch.ts
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import useAsync from "./useAsync";
import Cookies from 'js-cookie';

interface RequestOptions extends AxiosRequestConfig {
  body?: Record<string, any>;
}

interface ResponseData {
  data: any;
}

const accessToken = Cookies.get("accessToken");

const DEFAULT_OPTIONS: RequestOptions = {
  headers: {
    "Content-Type": "application/json",
    // Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
  },
};

export default function useFetch<T>(url: string, options: RequestOptions = {}, dependencies: any[] = []) {
  return useAsync<ResponseData, any>(async () => {
    const response: AxiosResponse<ResponseData> = await axios({
      url,
      method: options.method || 'get',
      data: options.body,
      ...DEFAULT_OPTIONS,
      ...options,
    });

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }

    return Promise.reject(response.data);
  }, dependencies);
}
