import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteConversation } from "../services/messageServices";
import { QUERY_KEYS } from "./queryKeys";


export const useDeleteConversation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({conversationId}: {conversationId: number}) =>
            deleteConversation(conversationId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_MESSAGES, variables.conversationId]
            })
        }
    })
}