export const fetcher = (url: string) => fetch(url).then((res) => res.json());

const baseURL = "https://api.ston.fi";

export const POOLS_LIST_API = `${baseURL}/v1/pools`;
