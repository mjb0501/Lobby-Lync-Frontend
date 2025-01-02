import { useContext, useEffect, useState } from 'react';
import AuthContext from "../context/authContext";
import { getPosts } from '../services/postServices';
import { GameSearch } from '../components/gameSearchBar';

interface Post {
  id: number;
  description: string;
  createdAt: string;
  user: string;
  platforms: string[];
  game: string;
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

  //will try and fetch the posts, can also be provided a game name to filter the results
  const fetchPosts = async (filter?: { gameName?: string }) => {
    try 
    {
      //can call getPosts with either a filter or nothing
      const data = await getPosts(filter || {});
      setPosts(data);
    } 
    catch 
    {
      setError('Failed to load posts');
    }
    finally 
    {
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



  //will display this if the authentication data is still propagating
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>

  return (
    <div>
      <h1>
        {auth ? 'Welcome to Your Dashboard!' : 'Welcome, please log in to continue.'}
      </h1>

      <GameSearch filterByGame={filterByGame}/>
      {/* NEED TO IMPLEMENT WAY TO REMOVE FILTER */}
      {currentFilter ? (
        <p>Currently showing posts filtered by: <strong>{currentFilter}</strong></p>
      ) : (
        <p>Showing all posts</p>
      )}

      {posts.length > 0 ? (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <h2>{post.description}</h2>
              <p><strong>User:</strong> {post.user}</p>
              <p><strong>Platform:</strong> {post.platforms.join(', ')}</p>
              <p><strong>Game:</strong> {post.game}</p>
              <p><strong>Description:</strong> {post.description}</p>
              <p><strong>Posted At:</strong> {new Date(post.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts currently exist.</p>
      )}
    </div>
  );
};

export default Homepage;