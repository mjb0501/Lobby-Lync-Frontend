import { useEffect, useState } from "react";
import { getYourPost } from "../services/postServices";

interface Post {
    postId: number;
    user: string;
    game: string;
    description: string;
    createdAt: string;
    platforms: string[];
  }

const YourPost = () => {
    const [post, setPost] = useState<Post | null>(null);
    const [error, setError] = useState<string>('');
    
    useEffect(() => {
        const fetchYourPost = async () => {
            try {
                const response = await getYourPost();
                setPost(response);
            } catch {
                setError('We failed to find any posts uploaded by you');
            }
        };

        fetchYourPost();
    }, []);

    return (
        <div>
            {post ? 
                <div>
                    <h1>Your Post</h1>
                    <h2>{post.description}</h2>
                    <p><strong>User:</strong> {post.user}</p>
                    <p><strong>Platform:</strong> {post.platforms.join(', ')}</p>
                    <p><strong>Game:</strong> {post.game}</p>
                    <p><strong>Description:</strong> {post.description}</p>
                    <p><strong>Posted At:</strong> {new Date(post.createdAt).toLocaleString()}</p>
                </div>
            : <div>{error}</div>}
        </div>
    )
}

export default YourPost;