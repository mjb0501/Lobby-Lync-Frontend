import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from "../context/authContext";
import { getPosts, acceptPost } from '../services/postServices';
import { GameSearch } from '../components/gameSearchBar';

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
  const { auth } = useContext(AuthContext);
  //used to prevent the user from seeing incorrect content before authorization has been propagated
  const [loading, setLoading] = useState<boolean>(true);
  //used to hold the array of posts to be shown on the home page
  const [ posts, setPosts ] = useState<Post[]>([]);
  //MAY WANT TO REMOVE, used to hold the error occurring
  const [error, setError] = useState<string | null>(null);
  //used to specify which filters have been applied to the posts
  const [currentFilter, setCurrentFilter] = useState<string | null>(null);
  const navigate = useNavigate();
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
    if (!auth) {
      navigate('/login');
      alert("Need to be logged in to accept post.");
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
      alert('Post accepted successfully!');
      setShowModal(false);
      setDescription('');
    } catch (error) {
      console.error('Error accepting post:', error);
      alert('Failed to accept post.');
    }
  };



  //will display this if the authentication data is still propagating
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>

  return (
    <div>
      <h1>
        {auth ? 'Welcome to Your Dashboard!' : 'Welcome, please log in to continue.'}
      </h1>

      <GameSearch filterByGame={filterByGame}/>
      {currentFilter ? (
        <>
          <p>Currently showing posts filtered by: <strong>{currentFilter}</strong></p>
          <button onClick={removeGameFilter}>Remove Filter</button>
        </>
      ) : (
        <></>
      )}

      {posts.length > 0 ? (
        <ul>
          {posts.map((post) => (
            <li key={post.postId}>
              <h2>{post.description}</h2>
              <p><strong>User:</strong> {post.user}</p>
              <p><strong>Platform:</strong> {post.platforms.join(', ')}</p>
              <p><strong>Game:</strong> {post.game}</p>
              <p><strong>Description:</strong> {post.description}</p>
              <p><strong>Posted At:</strong> {new Date(post.createdAt).toLocaleString()}</p>
              <button onClick={() => handleAcceptPost(post.postId)}>Accept Post</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts currently exist.</p>
      )}

      {/* Modal for accepting the post and adding a description */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Accept Post</h3>
            <p>Provide a description for your acceptance:</p>
            <input
              type="text"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Enter your description"
            />
            <button onClick={handleSubmitAcceptance}>Submit</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Homepage;