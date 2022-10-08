import axios, { AxiosRequestConfig } from 'axios';
import { ElMessage } from 'element-plus';

import pinia from '../store';
import { useMainStore } from '../store/main';

import { addSignHeaders } from './signUtil';

const UNKNOWN_ERROR = '未知错误，请重试';

const store = useMainStore(pinia);

// 根据环境不同引入不同api地址
const { VITE_API_PATH } = import.meta.env;

// create an axios instance
const service = axios.create({
  baseURL: VITE_API_PATH, // url = base api url + request url
  timeout: 15000, // request timeout
});

// 请求拦截器
service.interceptors.request.use(
  config =>
    // const token = localStorage.get(ACCESS_TOKEN_KEY);
    // if (token && config.headers) {
    //   // 请求头token信息，请根据实际情况进行修改
    //   config.headers['Authorization'] = token;
    // }
    config,
  (error) => {
    Promise.reject(error);
  },
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const { data } = response;
    // 统一处理1，200错误码为 200
    if (data?.code === 1) {
      data.code = 200;
    }

    // 正常返回
    if (data?.code === 200 || data.appid) {
      return Promise.resolve(data.data || data);
    }

    // 登录过期
    if (data?.code === 401 || data?.code === 403) {
      ElMessage.warning({
        message: '登录信息过期,请重新登陆!',
      });
      store.update_token(undefined);
      // 跳转到登陆页
      // if (isQianKun) {
      //   window.location.href = PageEnum.BASE_LOGIN;
      // } else {
      //   history.replace(PageEnum.BASE_LOGIN);
      // }
      return;
    }

    ElMessage.error({
      message: data?.msg || '服务器错误',
    });
    return Promise.reject(response.data);
  },
  (error) => {
    // 处理 422 或者 500 的错误异常提示
    const errMsg = error?.response?.data?.message ?? UNKNOWN_ERROR;
    ElMessage.error(errMsg);
    error.message = errMsg;
    return Promise.reject(error);
  },
);

export type Response<T = any> = {
  code: number;
  message: string;
  data: T;
  msg: string;
  errorCode: string;
  errorDesc: string;
};

export type BaseResponse<T = any> = Promise<Response<T>>;

export const request = async <T = any>(config: AxiosRequestConfig): Promise<T> => {
  const { headers: optionsHeaders } = config;
  const headers: any = {
    'Content-Type': 'application/json',
    ...optionsHeaders,
  };
  const accessToken = store.loginedToken;

  if (accessToken) headers.Authorization = accessToken;

  addSignHeaders(headers, config.url!);

  // @ts-ignore
  return service
    .request<any, T>({
    ...config,
    headers,
  })
    .then(res => Promise.resolve(res))
    .catch(err => Promise.reject(err));
};
