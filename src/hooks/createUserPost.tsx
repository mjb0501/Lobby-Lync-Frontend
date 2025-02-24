import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '../services/postServices';
import { QUERY_KEYS } from './queryKeys';


export const useCreatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createPost,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_POSTS]
            })
        }
    })
}