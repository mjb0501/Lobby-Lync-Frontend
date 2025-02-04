import { useMutation, useQueryClient } from 'react-query';
import { QUERY_KEYS } from './queryKeys';
import { rejectPostAcceptance } from '../services/postServices';


export const useDeleteAcceptAsCreator = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: rejectPostAcceptance,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_POSTS,]
            })
        }
    })
}