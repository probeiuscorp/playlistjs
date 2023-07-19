import useSWR from 'swr';

export const useFetch = <T>(key: string) => useSWR(key, (...args) => fetch(...args).then((res) => res.json() as Promise<T>));