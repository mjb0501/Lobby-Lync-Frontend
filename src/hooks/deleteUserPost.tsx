import { useMutation, useQueryClient } from 'react-query';
import { deletePost } from '../services/postServices';
import { QUERY_KEYS } from './queryKeys';

export const useDeletePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deletePost,
        onSuccess: () => {
            queryClient.invalidateQueries({
               queryKey: [QUERY_KEYS.GET_USER_POSTS] 
            })
        }
    })
}