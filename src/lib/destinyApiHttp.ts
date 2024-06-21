import { HttpClientConfig } from 'bungie-api-ts/destiny2';
import axios, { AxiosRequestConfig } from 'axios';
import { stringify } from 'query-string';

const API_KEY = process.env.REACT_APP_BUNGIE_API_KEY;

async function _$http<Return>(
  config: HttpClientConfig,
  withCredentials: boolean
): Promise<Return> {
  if (!API_KEY) {
    throw new Error('no API key');
  }

  const urlWithParams = `${config.url}${
    config.params ? `?${stringify(config.params)}` : ''
  }`;

  const axiosConfig: AxiosRequestConfig = {
    url: urlWithParams,
    method: config.method,
    headers: withCredentials ? { 'X-API-Key': API_KEY } : {},
    withCredentials,
  };

  if (config.method === 'POST') {
    axiosConfig.data = config.body;
  }

  try {
    const response = await axios(axiosConfig);
    return response.data;
  } catch (error) {
    throw new Error(
      (error as any).response?.data?.msg || (error as any).message
    );
  }
}

export async function $http<Return>(config: HttpClientConfig): Promise<Return> {
  return await _$http(config, true);
}

export async function $manifestHttp<Return>(
  config: HttpClientConfig
): Promise<Return> {
  return await _$http(config, false);
}
