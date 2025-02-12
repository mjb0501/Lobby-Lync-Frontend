import { useQuery } from 'react-query';
import { QUERY_KEYS } from './queryKeys';
import { getPosts } from '../services/postServices';

export const useGetPosts = (gameName?: string | null, page: number = 1, limit: number = 10) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ALL_POSTS, gameName, page, limit],
        queryFn: () => getPosts({ gameName, page, limit }),
        enabled: gameName !== undefined,
        keepPreviousData: true,
    })
}