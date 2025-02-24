import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from './queryKeys';
import { deletePostAcceptance } from '../services/postServices';


export const useDeleteAccept = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deletePostAcceptance,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_ACCEPTED_POSTS]
            })
        }
    })
}