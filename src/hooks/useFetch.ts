import useSWR from 'swr';

const fetcher = (...args: [any]) => fetch(...args).then(res => res.json());
export function useFetch(url: string) {
    return useSWR(url, fetcher);
}