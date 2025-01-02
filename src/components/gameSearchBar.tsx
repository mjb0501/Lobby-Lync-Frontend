import { useState } from 'react';
import { autocompleteGames } from '../services/gameServices';
import { useDebounce } from '../hooks/debounce';

interface GameSearchProps {
    filterByGame: (game: string) => void;
}

export const GameSearch: React.FC<GameSearchProps> = ({filterByGame}) => {
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

    //when a change is detected call the autocomplete function with the new updated query
    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchQuery = e.target.value;
        setQuery(searchQuery);
        fetchGames();
    };

    //when a game from the autocomplete is chosen call the provided filter function
    const handleGameClick = (game: string) => {
        filterByGame(game);
        //clears search bar
        setQuery(''); 
        //clears autocomplete results
        setGames([]);
    }

    /*returns a text input and if a fetch is made a list of buttons for each game 
    that when pressed calls the provided function (should filter a list of posts)*/
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
                        <li key={index}>
                            <button onClick={() => handleGameClick(game)}>{game}</button>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
};