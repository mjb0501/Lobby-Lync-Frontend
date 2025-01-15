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
        <div className="min-h-screen bg-slate-600 text-white py-8 px-4">
            {post ? (
                <div className="max-w-4xl mx-auto bg-slate-500 p-6 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-semibold mb-4">Your Post</h1>

                    {/* Post Details */}
                    <div className="mb-6">
                        <h2 className="text-xl font-medium text-slate-100">{post.description}</h2>
                        <p className="mt-2 text-lg"><strong>Platform:</strong> {post.platforms.join(', ')}</p>
                        <p className="mt-2 text-lg"><strong>Game:</strong> {post.game}</p>
                        <p className="mt-2 text-lg"><strong>Description:</strong> {post.description}</p>
                        <p className="mt-2 text-lg"><strong>Posted At:</strong> {new Date(post.createdAt).toLocaleString()}</p>
                    </div>
                    
                    {/* Delete Button*/}
                    <button 
                        onClick={handleDelete}
                        className="w-40 py-2 px-6 mt-4 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        Delete Post
                    </button>

                    {/* Post Acceptances*/}
                    <div className="mt-8">
                        <h2 className="text-2xl font-semibold mb-4">Post Acceptances</h2>
                        <ul className="space-y-4">
                        {post.acceptances.length > 0 ? (
                            post.acceptances.map((acceptance) => (
                                <li key={acceptance.username} className="bg-gray-700 p-4 rounded-lg">
                                    <p className="text-lg"><strong>Username:</strong> {acceptance.username}</p>
                                    <p className="mt-2 text-lg"><strong>Description:</strong> {acceptance.description}</p>
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-400">No acceptances yet.</p>
                        )}
                        </ul>
                    </div>
                    
                </div>
            ) : (
                <div>{error}</div>
            )}
        </div>
    );
}

export default YourPost;