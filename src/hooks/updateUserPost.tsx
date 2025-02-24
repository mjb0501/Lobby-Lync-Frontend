import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editPost } from '../services/postServices';
import { QUERY_KEYS } from './queryKeys';

export const useUpdatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: editPost,
        onSuccess: () => {
            queryClient.invalidateQueries({
               queryKey: [QUERY_KEYS.GET_USER_POSTS] 
            });
        }
    })
}