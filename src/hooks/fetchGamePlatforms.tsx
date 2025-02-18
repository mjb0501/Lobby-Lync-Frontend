import { useQuery } from "react-query";
import { QUERY_KEYS } from "./queryKeys";
import { gamePlatforms } from "../services/gameServices";


export const useGetGamePlatforms = (game: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_GAME_PLATFORMS, game],
        queryFn: () => gamePlatforms(game),
        staleTime: Infinity,
        cacheTime: 60 * 60 * 1000,
        enabled: !!game,
        keepPreviousData: true,
    });
}