import { useState } from 'react';
import { autocompleteGames } from '../services/gameServices';
import { useDebounce } from '../hooks/debounce';

export const GameSearch = () => {
    const [query, setQuery] = useState<string>('');
    const [games, setGames] = useState<string[]>([]);

    //this will fetch the list of games 500ms after the last type by the user
    //this works by calling the useDebounce hook in the hooks folder
    const fetchGames = useDebounce(async () => {
        if (query.length > 2)
        {
            try {
                const response = await autocompleteGames(query);
                setGames(response);
            } catch (error) {
                console.error('Error fetching games:', error);
            }
        } else {
            setGames([]);
        }
    });

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchQuery = e.target.value;
        setQuery(searchQuery);
        fetchGames();
    };

    return (
        <>
            <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Search for a game"
            />
            {games.length > 0 && (
                <ul>
                    {games.map((game, index) => (
                        <li key={index}>{game}</li>
                    ))}
                </ul>
            )}
        </>
    );
};