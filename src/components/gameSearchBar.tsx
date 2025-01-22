import { useEffect, useState } from 'react';
import { autocompleteGames } from '../services/gameServices';
import useDebounce from '../hooks/debounce';

interface GameSearchProps {
    filterByGame: (game: string) => void;
}

export const GameSearch: React.FC<GameSearchProps> = ({filterByGame}) => {
    const [searchValue, setsearchValue] = useState<string>('');
    const [games, setGames] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

    //will set the debouncedValue to searchValue 500ms after last change
    const debouncedValue = useDebounce(searchValue, 500)

    const fetchGames = async (debouncedValue: string) => {
        if (debouncedValue.length > 2)
        {
            try {
                const response = await autocompleteGames(debouncedValue);
                setGames(response);
            } catch (error) {
                console.error('Error fetching games:', error);
            }
        } else {
            setGames([]);
        };
    }

    useEffect(() => {
        fetchGames(debouncedValue);
    }, [debouncedValue]);

    //when a change is detected call the autocomplete function with the new updated searchValue
    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchsearchValue = e.target.value;
        setsearchValue(searchsearchValue);
        //fetchGames();
    };

    //when a game from the autocomplete is chosen call the provided filter function
    const handleGameClick = (game: string) => {
        filterByGame(game);
        //clears search bar
        setsearchValue(''); 
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
                value={searchValue}
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