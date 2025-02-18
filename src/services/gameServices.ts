import axios from 'axios';

export interface gamePlatformsData {
    gameId: number;
    platforms: string[];
}

export const autocompleteGames = async (search: string): Promise<string[]> => {
    try {
        const response = await axios.get(`/games/autocomplete?query=${search}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching games:', error);
        throw error;
    }
}

export const gamePlatforms = async (game: string): Promise<gamePlatformsData> => {
    try {
        console.log(game)
        const response = await axios.get(`/games/gamePlatforms?gameName=${game}`);
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('Error fetching platforms associated with game: ', error);
        throw error;
    }
}