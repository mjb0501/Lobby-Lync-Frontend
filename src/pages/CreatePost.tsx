import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/authContext';
import { GameSearch } from '../components/gameSearchBar';
import { gamePlatforms, gamePlatformsData } from '../services/gameServices';
import { createPost, deletePost } from '../services/postServices';

interface Post {
    gameId: number;
    gameName: string;
    platforms: string[];
    description: string;
}

const CreatePost = () => {
    //Used to know if the user is logged in or not
    const { auth } = useContext(AuthContext);
    //Represents the user's chosen post attributes
    const [post, setPost] = useState<Post>({ gameId: -1, gameName: '', platforms: [], description: '' });
    //Is set to the platforms available for the chosen game
    const [platforms, setPlatforms] = useState<string[]>([]);
    //represents whether loading is happening or an error has occurred
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    //Used to map out all the buttons
    const allPlatforms = ['Xbox', 'Playstation', 'PC', 'Switch'];
    const navigate = useNavigate();

    //Called when a user chooses a game, sets the proper atttributes in post
    const chooseGame = async (game: string) => {
        try {
            const response: gamePlatformsData = await gamePlatforms(game);
            setPost((prevPost) => ({
                ...prevPost,
                gameId: response.gameId,
                gameName: game,
            }));
            setPlatforms(response.platforms);
        } catch (error) {
            console.error("Error fetching platforms: ", error)
        }
    };

    //Called when the user clears their game choice, removes game and platform attributes from post
    const clearGame = () => {
        setPost((prevPost) => ({
            ...prevPost,
            gameId: -1,
            gameName: '',
            platforms: [],
        }));
        setPlatforms([]);
    };

    //Called when the user clicks a platform button, removes or adds the platform to the post attributes
    const togglePlatformSelection = (platform: string) => {
        /*if the button pressed is already included then remove it from the list of selected
            platforms otherwise add it to the list*/
        if (post.platforms.includes(platform)) {
            setPost((prevPost) => ({
                ...prevPost,
                platforms: prevPost.platforms.filter(p => p !== platform),
            }))
        } else {
            setPost((prevPost) => ({
                ...prevPost,
                platforms: [...prevPost.platforms, platform],
            }))
        }
    };

    //Called when user submits post, takes care of calling the backend and transitioning to new page
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const postData = {
            platformIds: post.platforms,
            gameId: post.gameId,
            description: post.description,
        };

        setLoading(true);
        setError(null);

        try {
            let response = await createPost(postData);

            //if a response is already uploaded then prompt to replace with new post
            if (!response.postId) {
                const confirmation = window.confirm("You are only allowed to upload one post at a time.  Click ok if you would like to delete that post and upload this one instead.  Click cancel if you want to leave that other post up.");
                if (confirmation) {
                    try {
                        await deletePost();
                        console.log(postData);
                        response = await createPost(postData);
                    } catch (error) {
                        console.error("Error while deleting and uploading new post:", error);
                        alert("Failed to delete and Upload new post.");
                        return;
                    }
                } else {
                    return;
                }
            }

            console.log('Post created successfully:', response);

            setPost({ gameId: -1, gameName: '', platforms: [], description: '' });
            setPlatforms([]);
            navigate('/yourPost');
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
                        <h2>Select platforms for {post.gameName}</h2>
                        {post.gameName && (<button onClick={clearGame}>Clear Game</button>)}
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
                                    {platform} {post.platforms.includes(platform) && '✓'}
                                </button>
                            ))}
                        </div>
                        <div>
                            <h3>Selected Platforms</h3>
                            <ul>
                                {post.platforms.map(platform => (
                                    <li key={platform}>{platform}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            value={post.description}
                            onChange={(e) => setPost((prevPost) => ({...prevPost, description: e.target.value,}))}
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