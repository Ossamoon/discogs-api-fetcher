import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { MasterData, ReleaseData } from "./types";

export const fetchMaster = async (master_id: number): Promise<MasterData> => {
  const options: AxiosRequestConfig = {
    url: `https://api.discogs.com/masters/${master_id}`,
    method: "GET",
    responseType: "json",
  };

  const data = axios(options)
    .then((res: AxiosResponse<MasterData>) => {
      const { data } = res;
      return data;
    })
    .catch((err: AxiosError) => {
      console.error(err.message);
      throw err;
    });

  return data;
};

export const fetchRelease = async (
  release_id: number
): Promise<ReleaseData> => {
  const options: AxiosRequestConfig = {
    url: `https://api.discogs.com/releases/${release_id}`,
    method: "GET",
    responseType: "json",
  };

  const data = axios(options)
    .then((res: AxiosResponse<ReleaseData>) => {
      const { data } = res;
      return data;
    })
    .catch((err: AxiosError) => {
      console.error(err.message);
      throw err;
    });

  return data;
};
