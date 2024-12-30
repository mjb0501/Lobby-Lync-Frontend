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

    useEffect(() => {
      const fetchPosts = async () => {
          try 
          {
              const data = await getPosts();
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
      };

      fetchPosts();
  }, []);

    //will display this if the authentication data is still propagating
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>

  return (
    <div>
      <h1>
        {auth ? 'Welcome to Your Dashboard!' : 'Welcome, please log in to continue.'}
      </h1>

      <GameSearch />

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