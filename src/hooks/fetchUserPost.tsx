import { useQuery } from "react-query";
import { fetchUserPost } from "../services/postServices";
import { QUERY_KEYS } from "./queryKeys";

export const useUserPost = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_POSTS],
        queryFn: fetchUserPost,
        staleTime: Infinity,
        cacheTime: 60 * 60 * 1000
    });
};