import { useQuery } from 'react-query';
import { QUERY_KEYS } from './queryKeys';
import { getPosts } from '../services/postServices';

export const useGetPosts = (gameName?: string | null, filteredPlatform?: string | null, page: number = 1, limit: number = 10) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ALL_POSTS, { gameName, filteredPlatform, page, limit }],
        queryFn: () => getPosts({ gameName, filteredPlatform, page, limit }),
        enabled: filteredPlatform !== null || filteredPlatform !== undefined,
        keepPreviousData: true,
        refetchOnWindowFocus: false
    })
}