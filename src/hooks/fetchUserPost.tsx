import { useQuery } from "react-query";
import { fetchUserPost } from "../services/postServices";
import { QUERY_KEYS } from "./queryKeys";

export const useUserPost = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_POSTS],
        queryFn: fetchUserPost,
        staleTime: 1000 * 60 * 30,
        retry: 2,
    });
};