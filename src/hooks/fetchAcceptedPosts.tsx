import { useQuery } from "react-query";
import { QUERY_KEYS } from "./queryKeys";
import { getAcceptedPosts } from "../services/postServices";

export const useGetAcceptedPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ACCEPTED_POSTS],
        queryFn: getAcceptedPosts,
        keepPreviousData: true,
        staleTime: Infinity,
        cacheTime: 60 * 60 * 1000,
    });
};