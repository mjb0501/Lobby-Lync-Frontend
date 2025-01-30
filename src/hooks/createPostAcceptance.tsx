import { useMutation, useQueryClient } from 'react-query';
import { acceptPost } from '../services/postServices';
import { QUERY_KEYS } from './queryKeys';

export const useAcceptPost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: acceptPost,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_ACCEPTED_POSTS]
            });
        }
    });
};