import { useEffect, useState } from 'react'
import { deletePostAcceptance, getAcceptedPosts } from '../services/postServices';
import { formatDate } from '../utils/formatDate';

interface AcceptedPost {
    postId: number;
    creator: string;
    game: string;
    description: string;
    createdAt: string;
    platforms: string[];
}

const AcceptedPosts = () => {
    const [acceptedPosts, setAcceptedPosts] = useState<AcceptedPost[]>([]);
    const [error, setError] = useState('')

    const fetchAcceptedPosts = async () => {
        try {
            const posts = await getAcceptedPosts();
            if (posts) {
                setAcceptedPosts(posts);
            } else {
                setError('We failed to find any posts you have accepted')
            }
        } catch {
            setError('We failed to find any posts you have accepted')
        }
    };

    useEffect(() => {
        fetchAcceptedPosts();
    }, []);

    const handleDelete = async () => {
        try {
            await deletePostAcceptance();
            setAcceptedPosts([]);
            fetchAcceptedPosts();
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div className="min-h-screen bg-slate-600 text-white py-8 px-4">
            <h1 className="text-3xl text-slate-100 mb-4">Accepted Posts</h1>

            {acceptedPosts.length > 0 ? (
                <ul className='space-y-6 flex flex-col items-center'>
                          {acceptedPosts.map((post) => (
                            <li key={post.postId} className="bg-slate-500 p-2 rounded-lg shadow w-full max-w-md">
                
                                {/* Game Name and Created At */}
                                <div className="flex justify-between">
                                    <h2 className="text-xl font-bold">{post.game}</h2>
                                    <span className="text-sm">{formatDate(post.createdAt)}</span>
                                </div>
                    
                                {/* Post Creator and Platforms */}
                                <div className="flex justify-between items-center text-sm mb-4">
                                    <span>{post.creator}</span>
                                    <span>{post.platforms.join(', ')}</span>
                                </div>
                    
                                {/* Description */}
                                <h2 className="text-xl font-bold mb-2">{post.description}</h2>
                    
                                <button
                                    className="w-30  py-4 px-6 mt-4 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </button>
                            </li>
                          ))}
                        </ul>
            ) : (
                <p>
                    {error}
                </p>
            )}
        </div>
  )
}

export default AcceptedPosts