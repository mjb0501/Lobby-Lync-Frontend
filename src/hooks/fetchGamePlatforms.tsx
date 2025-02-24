import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";
import { gamePlatforms } from "../services/gameServices";

interface gamePlatformsData {
    gameId: number,
    platforms: string[]
}

export const useGetGamePlatforms = (game: string) => {
    return useQuery<gamePlatformsData>({
        queryKey: [QUERY_KEYS.GET_GAME_PLATFORMS, game],
        queryFn: () => gamePlatforms(game),
        staleTime: Infinity,
        gcTime: 60 * 60 * 1000,
        enabled: !!game,
    });
}