import { useMutation, useQueryClient } from "react-query"
import { sendMessage } from "../services/messageServices";
import { QUERY_KEYS } from "./queryKeys";

export const useSendMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ conversationId, content}: { conversationId: number; content: string }) => 
            sendMessage(conversationId, content),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_MESSAGES, variables.conversationId]
            })
        }
    })
}