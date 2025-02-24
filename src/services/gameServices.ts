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
        const response = await axios.get(`/games/gamePlatforms?gameName=${game}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching platforms associated with game: ', error);
        throw error;
    }
}