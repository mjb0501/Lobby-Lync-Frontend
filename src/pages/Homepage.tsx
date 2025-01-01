import { useContext, useEffect, useState } from 'react';
import AuthContext from "../context/authContext";
import { getPosts } from '../services/postServices';
import { GameSearch } from '../components/gameSearchBar';

interface Post {
  id: number;
  description: string;
  createdAt: string;
  user: string;
  platform: string;
  game: string;
}

const Homepage = () => {
  const { auth } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [ posts, setPosts ] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<string | null>(null);

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
              <p><strong>Platform:</strong> {post.platform}</p>
              <p><strong>Game:</strong> {post.game}</p>
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