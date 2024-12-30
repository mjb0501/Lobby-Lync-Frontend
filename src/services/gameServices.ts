import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const autocompleteGames = async (search: string): Promise<string[]> => {
    try {
        const response = await axios.get(`${API_URL}/games/autocomplete?query=${search}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching games:', error);
        throw error;
    }
}