import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameSearch } from '../components/gameSearchBar';
import { gamePlatforms, gamePlatformsData } from '../services/gameServices';
import { useUserPost } from '../hooks/fetchUserPost';
import { toast, ToastContainer } from 'react-toastify';
import { useUpdatePost } from '../hooks/updateUserPost';

interface Post {
    postId: number;
    gameId: number;
    gameName: string;
    platforms: string[];
    description: string;
}

const EditPost = () => {
    const { data: post, isLoading: isLoadingFetch, isError } = useUserPost();
    const { mutateAsync: updatePost, isLoading: isLoadingUpdate } = useUpdatePost();
    //Represents the user's chosen post attributes
    const [updatedPost, setUpdatedPost] = useState<Post>({postId: -1, gameId: -1, gameName: '', platforms: [], description: ''});
    //Is set to the platforms available for the chosen game
    const [platforms, setPlatforms] = useState<string[]>([]);
    //Used to map out all the buttons
    const allPlatforms = ['Xbox', 'Playstation', 'Steam', 'Switch'];
    const navigate = useNavigate();

    useEffect(() => {
        if (post) {
            setUpdatedPost({
                postId: post.postId || -1,
                gameId: post.gameId || -1,
                gameName: post.game || '',
                platforms: post.platforms || [],
                description: post.description || ''
            });
            chooseGame(post.game);
        }
    }, [post]);

    if (isLoadingFetch) return <p>Loading...</p>

    //Called when a user chooses a game, sets the proper atttributes in post
    const chooseGame = async (game: string) => {
        try {
            const response: gamePlatformsData = await gamePlatforms(game);
            setUpdatedPost((prevPost) => ({
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
        setUpdatedPost((prevPost) => ({
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
        if (updatedPost.platforms.includes(platform)) {
            setUpdatedPost((prevPost) => ({
                ...prevPost,
                platforms: prevPost.platforms.filter(p => p !== platform),
            }))
        } else {
            setUpdatedPost((prevPost) => ({
                ...prevPost,
                platforms: [...prevPost.platforms, platform],
            }))
        }
    };

    //Called when user submits post, takes care of calling the backend and transitioning to new page
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        //ensures that a game is provided
        if (updatedPost.gameId === -1) {
            toast.error('No game selected please select a game.', { toastId: 2 });
            return;
        }

        //ensures that a platform is provided
        if (updatedPost.platforms.length === 0) {
            toast.error('No platforms selected please select a platform.', {toastId: 1});
            return;
        }

        //ensures that changes have been made before submitting edit to backend
        if ((updatedPost.gameId === post.gameId) && 
            (updatedPost.platforms === post.platforms) && 
            (updatedPost.description === post.description)) {
            toast.error('No edits have been made.', {toastId: 3});
            return;
        }

        const postData = {
            postId: updatedPost.postId,
            platformIds: updatedPost.platforms,
            gameId: updatedPost.gameId,
            description: updatedPost.description,
        };

        try {
            const response = await updatePost(postData);

            console.log('Post edited successfully:', response);

            setUpdatedPost({ postId: -1, gameId: -1, gameName: '', platforms: [], description: '' });
            setPlatforms([]);
            navigate('/yourPost');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="min-h-screen bg-slate-600 text-white flex flex-col items-center py-8">

            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover={false}
                theme="light"
            />

            {/* Game and Platform Selection*/}
            <div className="w-full max-w-4xl mt-8 bg-slate-500 p-6 rounded-lg shadow-lg">

                {/* Game Search */}
                <h2 className="text-xl font-semibold mb-4">Choose Game</h2>
                <GameSearch filterByGame={chooseGame}/>

                <h2 className="text-xl font-semibold mb-4 mt-6">Select Platforms for {updatedPost.gameName}</h2>
                {updatedPost.gameName && (
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
                                    ? updatedPost.platforms.includes(platform) ? 'bg-green-600 text-white' : 'bg-blue-800'
                                    : 'bg-gray-600 text-gray-300'
                            } ${
                                !platforms.includes(platform) ? 'cursor-not-allowed' : ''
                            }`}
                            //disable button if platform is not associated with game
                            disabled={!platforms.includes(platform)}
                                    
                        >
                            {platform} {updatedPost.platforms.includes(platform) && '✓'}
                        </button>
                    ))}
                </div>
                        
                {/* Selected Platforms */}
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Selected Platforms</h3>
                    <ul>
                        {updatedPost.platforms.map(platform => (
                            <li key={platform}>{platform}</li>
                        ))}
                    </ul>
                </div>

                {/* Description Input */}
                <label htmlFor="description" className="block text-lg font-medium mb-2">Description</label>
                <textarea
                    id="description"
                    value={updatedPost.description}
                    onChange={(e) => setUpdatedPost((prevPost) => ({...prevPost, description: e.target.value,}))}
                    rows={6}
                    placeholder="Enter your description here..."
                    className="w-full px-4 py-2 rounded-lg bg-slate-400 border border-slate-300 text-slate-100 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                {/* Submit Button */}
                <div className="mt-6">
                    <button 
                        onClick={handleSubmit} 
                        className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 fodus:ring-blue-500"
                        disabled={isLoadingFetch || isLoadingUpdate}
                    >
                        {isLoadingFetch || isLoadingUpdate ? 'Submitting...' : 'Edit Post'}
                    </button>
                    {isError && <p className="text-red-500 mt-2">{isError}</p>}
                </div>
            </div>
        </div>
    )
}

export default EditPost