import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { MasterData, ReleaseData, Pagination } from "./types";

require("dotenv").config();
const api_key: string | undefined = process.env.API_KEY;
const api_secret: string | undefined = process.env.API_SECRET;

export const fetchMaster = async (master_id: number): Promise<MasterData> => {
  const options: AxiosRequestConfig = {
    url: `https://api.discogs.com/masters/${master_id}`,
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

export type searchResponse = {
  pagination: Pagination;
  results: { id: number; title: string }[];
};

export const search = async (
  page: number,
  query: string,
  type?: "release" | "master" | "artist" | "label",
  genre?: string,
  style?: string,
  artist?: string,
  credit?: string
): Promise<searchResponse> => {
  const options: AxiosRequestConfig = {
    url: `https://api.discogs.com/database/search?${
      !query ? "" : `q=${query}`
    }`,
    responseType: "json",
    params: {
      q: query,
      type: type,
      genre: genre,
      style: style,
      artist: artist,
      credit: credit,
      page: page,
    },
    headers: {
      Authorization: `Discogs key=${api_key}, secret=${api_secret}`,
    },
  };

  try {
    const response = await axios(options);
    const { data } = response;
    return data;
  } catch (err) {
    throw err;
  }
};
