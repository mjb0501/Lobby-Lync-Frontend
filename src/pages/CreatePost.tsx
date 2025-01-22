import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GameSearch } from '../components/gameSearchBar';
import { gamePlatforms, gamePlatformsData } from '../services/gameServices';
import { createPost, deletePost, getYourPost } from '../services/postServices';
import { useUserContext } from '../context/authContextProvider';
import { ToastContainer, toast } from 'react-toastify';

interface Post {
    gameId: number;
    gameName: string;
    platforms: string[];
    description: string;
}

const CreatePost = () => {
    //Used to know if the user is logged in or not
    const { isAuthenticated } = useUserContext();
    //this state is used to track if the user has already created a post
    const [preexistingPost, setPreexistingPost] = useState<boolean>(false);
    //Represents the user's chosen post attributes
    const [post, setPost] = useState<Post>({ gameId: -1, gameName: '', platforms: [], description: '' });
    //Is set to the platforms available for the chosen game
    const [platforms, setPlatforms] = useState<string[]>([]);
    //represents whether loading is happening or an error has occurred
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    //Used to map out all the buttons
    const allPlatforms = ['Xbox', 'Playstation', 'PC', 'Switch'];
    const navigate = useNavigate();

    const fetchYourPost = async () => {
        try {
            const response = await getYourPost();
            if (response) {
                setPreexistingPost(true);
                console.log(response);
                chooseGame(response.game);
                setPost((prevPost) => ({
                    ...prevPost,
                    platforms: response.platforms,
                    description: response.description
                }));
            }
            setIsLoading(false);
        } catch {
            setPreexistingPost(false);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        fetchYourPost();
    }, []);

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

        setIsLoading(true);
        setError(null);

        try {
            let response = await createPost(postData);

            //if a response is already uploaded then prompt to replace with new post
            if (!response.postId) {
                try {
                    await deletePost();
                    console.log(postData);
                    response = await createPost(postData);
                } catch (error) {
                    console.error("Error while deleting and uploading new post:", error);
                    toast.error('Failed to delete old post and upload new post', { toastId: '4'})
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
            setIsLoading(false);
        }
        
    }

    return (
        <>
            {isAuthenticated ? (
                <div className="min-h-screen bg-slate-600 text-white flex flex-col items-center py-8">
                    
                    <ToastContainer 
                        position="top-center"
                        pauseOnHover={false}
                        pauseOnFocusLoss={false}
                    />

                    {/* Game and Platform Selection*/}
                    <div className="w-full max-w-4xl mt-8 bg-slate-500 p-6 rounded-lg shadow-lg">

                        { preexistingPost ? (
                            <div className="bg-red-500 rounded-lg">
                                <h2 className="text-white text-5xl">
                                    Warning!
                                </h2>
                                <h2 className="text-white text-base font-semibold">
                                    You are only allowed to create one post at a time. 
                                    Creating a new post will delete your old one.
                                </h2>
                            </div>
                        ) : (<></>)}

                        {/* Game Search */}
                        <h2 className="text-xl font-semibold mb-4">Choose Game</h2>
                        <GameSearch filterByGame={chooseGame}/>

                        <h2 className="text-xl font-semibold mb-4 mt-6">Select Platforms for {post.gameName}</h2>
                        {post.gameName && (
                            <button 
                                onClick={clearGame}
                                className="text-m text-red-500 hover:text-red-700 font-semibold"
                            >
                                Clear Game
                            </button>
                        )}

                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {allPlatforms.map((platform) => (
                                <button
                                    key={platform}
                                    onClick={() => togglePlatformSelection(platform)}
                                    className={`w-full py-2 px-4 rounded-lg border transition-colors ${
                                        platforms.includes(platform)
                                            ? post.platforms.includes(platform) ? 'bg-green-600 text-white' : 'bg-blue-800'
                                            : 'bg-gray-600 text-gray-300'
                                    } ${
                                        !platforms.includes(platform) ? 'cursor-not-allowed' : ''
                                    }`}
                                    //disable button if platform is not associated with game
                                    disabled={!platforms.includes(platform)}
                                    
                                >
                                    {platform} {post.platforms.includes(platform) && '✓'}
                                </button>
                            ))}
                        </div>
                        
                        {/* Selected Platforms */}
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">Selected Platforms</h3>
                            <ul>
                                {post.platforms.map(platform => (
                                    <li key={platform}>{platform}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Description Input */}
                        <label htmlFor="description" className="block text-lg font-medium mb-2">Description</label>
                        <textarea
                            id="description"
                            value={post.description}
                            onChange={(e) => setPost((prevPost) => ({...prevPost, description: e.target.value,}))}
                            rows={6}
                            placeholder="Enter your description here..."
                            className="w-full px-4 py-2 rounded-lg bg-slate-400 border border-slate-300 text-slate-100 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />

                        {/* Submit Button */}
                        <div className="mt-6">
                            <button 
                                onClick={handleSubmit} 
                                className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 fodus:ring-blue-500"
                            >
                                {isLoading ? 'Submitting...' : 'Create Post'}
                            </button>
                            {error && <p className="text-red-500 mt-2">{error}</p>}
                        </div>
                    </div>
                </div>
            ) : (
                <h1>
                    You need to be logged in to create a post.  Click{' '}
                    <Link to="/login" className="text-blue-500 hover:text-blue-700">
                        Here
                    </Link>
                    to login.
                </h1>
            )}
        </>
    )
}

export default CreatePost