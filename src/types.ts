export type BaseData = {
  id: number;
  title: string;
  uri: string;
  resource_url: string;
  genres: string[];
  styles: string[];
  year: number;
  tracklist: Track[];
  images: Image[];
  videos: Video[];
  artists: Artist[];
  data_quality: string;
};

export type ReleaseData = BaseData & {
  master_id: number;
  master_url: string;
  extraartists: Artist[];
  thumb: string;
  formats: Format[];
};

export type MasterData = BaseData & {
  main_release: number;
  main_release_url: string;
  most_recent_release?: number;
  most_recent_release_url?: string;
};

export type Artist = {
  name: string;
  id: number;
  resource_url: string;
  role: string;
  join: string;
  anv: string;
  tracks: string;
};

export type Image = {
  type: string;
  height: number;
  width: number;
  resource_url: string;
  uri: string;
  uri150: string;
};

export type Video = {
  duration: number;
  description: string;
  embed: boolean;
  uri: string;
  title: string;
};

export type Track = {
  duration: string;
  position: string;
  type_: string;
  title: string;
  artists?: Artist[];
  extraartists?: Artist[];
};

export type Format = {
  descriptions?: string[];
  name?: string;
  qty?: string;
};

export type Identifier = {
  type: string;
  value: string;
};

export type Pagination = {
  per_page: number;
  pages: number;
  page: number;
  urls: {
    last: string;
    next: string;
  };
  items: number;
};
