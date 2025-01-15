import { useState } from 'react';
import { autocompleteGames } from '../services/gameServices';
import { useDebounce } from '../hooks/debounce';

interface GameSearchProps {
    filterByGame: (game: string) => void;
}

export const GameSearch: React.FC<GameSearchProps> = ({filterByGame}) => {
    const [query, setQuery] = useState<string>('');
    const [games, setGames] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

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

    const handleFocus = () => {setShowSuggestions(true)};

    const handleBlur = () => {
        setTimeout(() => setShowSuggestions(false), 75);
    }

    /*returns a text input and if a fetch is made a list of buttons for each game 
    that when pressed calls the provided function (should filter a list of posts)*/
    return (
        <div className="relative w-full max-w-md mx-auto">
            <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Search for a game"
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-300 text-black placeholder-slate-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {showSuggestions && games.length > 0 && (
                <ul className="absolute z-10 bg-slate-500 border border-slate-400 rounded-lg shadow-lg mt-2 w-full max-h-60 overflow-y-auto">
                    {games.map((game, index) => (
                        <li key={index} className="hover:bg-slate-400">
                            <button 
                                onClick={() => handleGameClick(game)}
                                className="w-full px-4 py-2 text-slate-50 hover:text-white"
                            >
                                {game}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};