import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";
import { getAcceptedPosts } from "../services/postServices";

export const useGetAcceptedPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ACCEPTED_POSTS],
        queryFn: getAcceptedPosts,
        staleTime: Infinity,
        gcTime: 60 * 60 * 1000,
    });
};