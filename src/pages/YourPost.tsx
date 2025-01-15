import { useEffect, useState } from "react";
import { getYourPost, deletePost } from "../services/postServices";

interface Acceptance {
    username: string;
    description: string;
}

interface Post {
    postId: number;
    user: string;
    game: string;
    description: string;
    createdAt: string;
    platforms: string[];
    acceptances: Acceptance[];
  }

const YourPost = () => {
    const [post, setPost] = useState<Post | null>(null);
    const [error, setError] = useState<string>('');
    
    //Fetches the user's post data
    const fetchYourPost = async () => {
        try {
            const response = await getYourPost();
            if (response) {
                setPost(response);
            } else {
                setError('We failed to find any posts uploaded by you');
            }
        } catch {
            setError('We failed to find any posts uploaded by you');
        }
    };

    //Calls fetch post on load
    useEffect(() => {
        fetchYourPost();
    }, []);

    //Called when user clicks delete, calls backend to delete user's post
    const handleDelete = async () => {
        try {
            await deletePost();
            setPost(null);
            fetchYourPost();
        } catch {
            alert('Failed to delete post.');
        }
    }

    return (
        <div>
            {post ? 
                <div>
                    <h1>Your Post</h1>
                    <h2>{post.description}</h2>
                    <p><strong>Platform:</strong> {post.platforms.join(', ')}</p>
                    <p><strong>Game:</strong> {post.game}</p>
                    <p><strong>Description:</strong> {post.description}</p>
                    <p><strong>Posted At:</strong> {new Date(post.createdAt).toLocaleString()}</p>
                    <button onClick={handleDelete}>Delete Post</button>
                    <h2>Post Acceptances</h2>
                    <ul>
                        {post.acceptances.map((acceptance) => (
                            <li key={acceptance.username}>
                                <p><strong>Username:</strong> {acceptance.username}</p>
                                <p><strong>Description:</strong> {acceptance.description}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            : <div>{error}</div>}
        </div>
    )
}

export default YourPost;