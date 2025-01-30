import { useQuery } from 'react-query';
import { QUERY_KEYS } from './queryKeys';
import { getPosts } from '../services/postServices';

export const useGetPosts = (gameName?: string | null) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ALL_POSTS, gameName],
        queryFn: () => getPosts(gameName ? { gameName } : {}),
        enabled: gameName !== undefined,
    })
}