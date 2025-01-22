import { useEffect, useState } from 'react';
import { getPosts, acceptPost } from '../services/postServices';
import { GameSearch } from '../components/gameSearchBar';
import { useUserContext } from '../context/authContextProvider';
import { ToastContainer, toast } from 'react-toastify';

interface Post {
  postId: number;
  user: string;
  game: string;
  description: string;
  createdAt: string;
  platforms: string[];
}

const Homepage = () => {
  //used to check whether user is logged in
  const { user } = useUserContext();
  //used to prevent the user from seeing incorrect content before authorization has been propagated
  const [loading, setLoading] = useState<boolean>(true);
  //used to hold the array of posts to be shown on the home page
  const [ posts, setPosts ] = useState<Post[]>([]);
  //MAY WANT TO REMOVE, used to hold the error occurring
  const [error, setError] = useState<string | null>(null);
  //used to specify which filters have been applied to the posts
  const [currentFilter, setCurrentFilter] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');
  const [postIdToAccept, setPostIdToAccept] = useState<number>(-1);

  //will try and fetch the posts, can also be provided a game name to filter the results
  const fetchPosts = async (filter?: { gameName?: string }) => {
    try {
      //can call getPosts with either a filter or nothing
      const data = await getPosts(filter || {});
      setPosts(data);
    } catch {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  }

  //on loading website fetch the posts
  useEffect(() => {
    fetchPosts();
  }, []);

  //This function is passed to the gameSearchBar to filter the posts on the homepage
  const filterByGame = (game: string) => {
    fetchPosts({ gameName: game});
    setCurrentFilter(game);
  }

  const removeGameFilter = () => {
    setCurrentFilter(null);
    fetchPosts();
  }

  const handleAcceptPost = async (postId: number) => {
    if (!user.id) {
      toast.info("Need to be logged in to accept post", {toastId: "1"})
      //navigate('/login');
      return;
    }

    setPostIdToAccept(postId);
    setShowModal(true);
  }

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const handleCancel = () => {
    setShowModal(false);
  }

  const handleSubmitAcceptance = async () => {
    try {
      const acceptData = {
        postId: postIdToAccept,
        description: description,
      };

      await acceptPost(acceptData);
      toast.success('Post accepted successfully', {toastId: "2"})
      setShowModal(false);
      setDescription('');
    } catch (error) {
      console.error('Error accepting post:', error);
      toast.error('Failed to accept post', {toastId: "3"})
    }
  };



  //will display this if the authentication data is still propagating
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>

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
      
      {currentFilter && (
        <div className='mb-4'>
          <p>Currently showing posts filtered by: <strong>{currentFilter}</strong></p>
          <button className="btn btn-secondary mt-2" onClick={removeGameFilter}>Remove Filter</button>
        </div>
      )}

      {posts.length > 0 ? (
        <ul className='space-y-6'>
          {posts.map((post) => (
            <li key={post.postId} className="bg-slate-500 p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-2">{post.description}</h2>
              <p><strong>User:</strong> {post.user}</p>
              <p><strong>Platform:</strong> {post.platforms.join(', ')}</p>
              <p><strong>Game:</strong> {post.game}</p>
              <p><strong>Description:</strong> {post.description}</p>
              <p><strong>Posted At:</strong> {new Date(post.createdAt).toLocaleString()}</p>
              <button
                className="btn btn-primary mt-4"
                onClick={() => handleAcceptPost(post.postId)}
              >
                  Accept Post
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center">No posts currently exist.</p>
      )}

      {/* Modal for accepting the post and adding a description */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-slate-500 p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Accept Post</h3>
            <p>Provide a description for your acceptance:</p>
            <input
              type="text"
              className="w-full p-2 rounded border border-slate-200 bg-slate-300 text-black mt-2"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Enter your description"
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button className="btn btn-primary" onClick={handleSubmitAcceptance}>Submit</button>
              <button className="btn btn-danger" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Homepage;