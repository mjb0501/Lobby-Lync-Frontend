import { useState } from 'react';
import { GameSearch } from '../components/gameSearchBar';
import { useUserContext } from '../context/authContextProvider';
import { ToastContainer, toast } from 'react-toastify';
import { formatDate } from '../utils/formatDate';
import { useGetPosts } from '../hooks/fetchAllPosts';
import { useGetAcceptedPosts } from '../hooks/fetchAcceptedPosts';
import { useAcceptPost } from '../hooks/createPostAcceptance';

interface Post {
  postId: number;
  user: string;
  game: string;
  description: string;
  createdAt: string;
  platforms: string[];
}

interface AcceptedPost {
  postId: number;
  creator: string;
  game: string;
  description: string;
  createdAt: string;
  platforms: string[];
}

const Homepage = () => {
  const [gameName, setGameName] = useState<string | null>(null);
  const { data: posts, isLoading: isLoadingFetch } = useGetPosts(gameName);
  const { data: acceptedPosts, isLoading: isLoadingAcceptedPosts } = useGetAcceptedPosts();
  const { mutateAsync: acceptPost, isLoading: isLoadingAccept } = useAcceptPost();
  //used to check whether user is logged in
  const { user } = useUserContext();
  //used to prevent the user from seeing incorrect content before authorization has been propagated
  //const [loading, setLoading] = useState<boolean>(true);
  //used to hold the array of posts to be shown on the home page
  //const [ posts, setPosts ] = useState<Post[]>([]);
  //used to determine which posts the user has already accepted to prevent accepting multiple times
  //const [acceptedPosts, setAcceptedPosts] = useState<AcceptedPost[]>([]);
  //MAY WANT TO REMOVE, used to hold the error occurring
  //const [error, setError] = useState<string | null>(null);
  //used to specify which filters have been applied to the posts
  //const [gameName, setGameName] = useState<string | null>(null);


  const [showModal, setShowModal] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');
  const [postIdToAccept, setPostIdToAccept] = useState<number>(-1);
  const [chosenPost, setChosenPost] = useState<Post | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [platformWarning, setPlatformWarning] = useState<string>('');

    //on loading website fetch the posts
    // useEffect(() => {
    //   fetchAcceptedPosts();
    //   //fetchPosts();
    // }, []);

    if (isLoadingFetch || isLoadingAcceptedPosts) return <p>Loading...</p>

  //will try and fetch the posts, can also be provided a game name to filter the results
  // const fetchPosts = async (filter?: { gameName?: string }) => {
  //   try {
  //     //can call getPosts with either a filter or nothing
  //     const data = await getPosts(filter || {});
  //     setPosts(data);
  //   } catch {
  //     setError('Failed to load posts');
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  // const fetchAcceptedPosts = async () => {
  //   try {
  //     const posts = await getAcceptedPosts();
  //     if (posts) {
  //       setAcceptedPosts(posts);
  //     }
  //   } catch {
  //     setError('Failed while trying to get accepted posts')
  //   }
  // }



  //This function is passed to the gameSearchBar to filter the posts on the homepage
  const filterByGame = (game: string) => {
    //fetchPosts({ gameName: game});
    setGameName(game);
  }

  const removeGameFilter = () => {
    setGameName(null);
    //fetchPosts();
  }

  const handleAcceptPost = async (post: Post) => {
    if (!user.id) {
      toast.info("Need to be logged in to accept post", {toastId: "1"})
      //navigate('/login');
      return;
    }

    setPostIdToAccept(post.postId);
    setChosenPost(post);
    setShowModal(true);
  }

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const handlePlatformChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPlatform(event.target.value);
    if (!user.platforms[event.target.value]) {
      setPlatformWarning(`You do not have a username associated with the platform selected.  
        Make sure you put your username in the description.`);
    } else {
      setPlatformWarning('');
    }
  }

  const handleCancel = () => {
    setShowModal(false);
    setPostIdToAccept(-1);
    setChosenPost(null);
    setSelectedPlatform('');
    setPlatformWarning('');
  }

  const handleSubmitAcceptance = async () => {
    try {
      const acceptData = {
        postId: postIdToAccept,
        description: description,
        platform: selectedPlatform,
        platformUsername: user.platforms[selectedPlatform],
      };

      await acceptPost(acceptData);
      toast.success('Post accepted successfully', {toastId: "2"});
      setShowModal(false);
      setDescription('');
    } catch (error) {
      console.error('Error accepting post:', error);
      toast.error('Failed to accept post', {toastId: "3"})
    }
  };



  //will display this if the authentication data is still propagating
  //if (loading) return <div>Loading...</div>;
  //if (error) return <div>{error}</div>

  return (
    <div className='container mx-auto max-w-7xl'>
      {/* Allows toast to show up. */}
      <ToastContainer 
        position="top-center"
        pauseOnHover={false}
        pauseOnFocusLoss={false}
      />

      <h1 className='text-3xl font-bold mb-6 text-center'>
        {user.username ? `Welcome ${user.username}!` : 'Welcome, please log in to continue.'}
      </h1>
      
      <div className='mb-4'>
        <GameSearch filterByGame={filterByGame}/>
      </div>
      
      {gameName && (
        <div className='mb-4'>
          <p>Currently showing posts filtered by: <strong>{gameName}</strong></p>
          <button className="btn btn-secondary mt-2" onClick={removeGameFilter}>Remove Filter</button>
        </div>
      )}

      {posts ? (
        <ul className='space-y-6 flex flex-col items-center'>
          {posts.map((post: Post) => {
            const isPostAccepted = acceptedPosts.some((accepted: AcceptedPost) => accepted.postId === post.postId);

            return (
              <li key={post.postId} className="bg-slate-500 p-2 rounded-lg shadow w-full max-w-md">

                {/* Game Name and Created At */}
                <div className="flex justify-between">
                  <h2 className="text-xl font-bold">{post.game}</h2>
                  <span className="text-sm">{formatDate(post.createdAt)}</span>
                </div>

                {/* Post Creator and Platforms */}
                <div className="flex justify-between items-center text-sm mb-4">
                  <span>{post.user}</span>
                  <span>{post.platforms.join(', ')}</span>
                </div>

                {/* Description */}
                <h2 className="text-xl font-bold mb-2">{post.description}</h2>

                <button
                  className={`btn mt-4 ${isPostAccepted ? 'bg-gray-700 cursor-not-allowed' : 'btn-primary'}`}
                  onClick={isPostAccepted ? () => {} : () => handleAcceptPost(post) }
                >
                    {isPostAccepted ? 'Already Accepted' : 'Accept Post'}
                </button>
              </li>
            )
          }
          )}
        </ul>
      ) : (
        <p className="text-center">No posts currently exist.</p>
      )}

      {/* Modal for accepting the post and adding a description */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-slate-500 p-6 rounded-lg max-w-sm">
            <h3 className="text-2xl font-bold mb-4">Accept Post</h3>
            <p>Provide a description for your acceptance:</p>
            <input
              type="text"
              className="w-full p-2 rounded border border-slate-200 bg-slate-300 text-black mt-2"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Enter your description"
            />

            <p className="mt-2">Choose the platform you will be on:</p>
            {platformWarning ? (
              <div className="bg-red-500 rounded-lg">
                <h2 className="text-white text-lg">Warning!</h2>
                <p>{platformWarning}</p>
              </div>
            ) : (<></>)}
            
            {chosenPost?.platforms.map((platform) => (
              <label 
                key={platform} 
                className={`flex items-center gap-2 py-2 px-4 mt-2 w-full rounded-lg cursor-pointer
                  ${selectedPlatform === platform ? "bg-blue-900 text-white border-2 border-white" : "bg-blue-400 text-gray-200"}`}
              >
                <input
                  type="radio"
                  name="platform"
                  value={platform}
                  checked={selectedPlatform === platform}
                  onChange={handlePlatformChange}
                  className="hidden"
                />
                <span className="text-white">{platform}</span>
              </label>
            ))}

            <div className="mt-4 flex justify-end space-x-2">
              <button 
                className="btn btn-primary" 
                onClick={handleSubmitAcceptance}
                disabled={isLoadingAccept}
              >Submit</button>
              <button className="btn btn-danger" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Homepage;