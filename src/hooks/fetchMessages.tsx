import { useQuery } from "react-query"
import { QUERY_KEYS } from "./queryKeys"
import { getMessages } from "../services/messageServices"


export const useGetMessages = (conversationId: number) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_MESSAGES, conversationId],
        queryFn: () => getMessages(conversationId),
        refetchInterval: 3000,
    });
}