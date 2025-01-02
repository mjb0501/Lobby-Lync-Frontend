import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/authContext';
import { GameSearch } from '../components/gameSearchBar';
import { gamePlatforms, gamePlatformsData } from '../services/gameServices';
import { createPost } from '../services/postServices';

const CreatePost = () => {
    const { auth } = useContext(AuthContext);
    const [gameName, setGameName] = useState<string>('');
    const [gameId, setGameId] = useState<number>(-1);
    const [platforms, setPlatforms] = useState<string[]>([]);
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [description, setDescription] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const allPlatforms = ['Xbox', 'Playstation', 'PC', 'Switch'];   

    const chooseGame = async (game: string) => {
        setGameName(game);
        try {
            const response: gamePlatformsData = await gamePlatforms(game);
            setPlatforms(response.platforms);
            setGameId(response.gameId);
        } catch (error) {
            console.error("Error fetching platforms: ", error)
        }
    };

    const clearGame = () => {
        setGameName('');
        setPlatforms([]);
        setSelectedPlatforms([]);
    };

    const togglePlatformSelection = (platform: string) => {
        /*if the button pressed is already included then remove it from the list of selected
            platforms otherwise add it to the list*/
        if (selectedPlatforms.includes(platform)) {
            setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
        } else {
            setSelectedPlatforms([...selectedPlatforms, platform])
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const postData = {
            platformIds: selectedPlatforms,
            gameId,
            description,
        };

        setLoading(true);
        setError(null);

        try {
            const response = createPost(postData);
            console.log('Post created successfully:', response);

            setGameName('');
            setGameId(-1);
            setPlatforms([]);
            setSelectedPlatforms([]);
            setDescription('');
        } catch {
            setError('Failed to create post. Please try again later.');
        } finally {
            setLoading(false);
        }
        
    }

    return (
        <>
            {auth ? (
                <div>
                    <GameSearch filterByGame={chooseGame}/>
                    <div>
                        <h2>Select platforms for {gameName}</h2>
                        {gameName && (<button onClick={clearGame}>Clear Game</button>)}
                        <div>
                            {allPlatforms.map((platform) => (
                                <button
                                    key={platform}
                                    style={{
                                        backgroundColor: platforms.includes(platform) ? 'lightblue' : 'grey',
                                        //disable button if not in platforms list
                                        pointerEvents: platforms.includes(platform) ? 'auto' : 'none',
                                    }}
                                    //disable button if platform is not associated with game
                                    disabled={!platforms.includes(platform)}
                                    onClick={() => togglePlatformSelection(platform)}
                                >
                                    {platform} {selectedPlatforms.includes(platform) && '✓'}
                                </button>
                            ))}
                        </div>
                        <div>
                            <h3>Selected Platforms</h3>
                            <ul>
                                {selectedPlatforms.map(platform => (
                                    <li key={platform}>{platform}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={6}
                            cols={50}
                            placeholder="Enter your description here..."
                            style={{ width: '100%', resize: 'vertical' }}
                        />
                    </div>
                    <div>
                        <button onClick={handleSubmit} style={{ marginTop: '20px'}}>
                            {loading ? 'Submitting...' : 'Submit Post'}
                        </button>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </div>
                </div>
            ) : (
                <h1>
                    You need to be logged in to create a post.  Click <Link to="/login">Here</Link> to login.
                </h1>
            )}
        </>
    )
}

export default CreatePost