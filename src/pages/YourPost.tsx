import { formatDate } from "../utils/formatDate";
import { useNavigate } from "react-router-dom";
import { useUserPost } from "../hooks/fetchUserPost";
import { useDeletePost } from "../hooks/deleteUserPost";
import { useDeleteAcceptAsCreator } from "../hooks/deletePostAcceptanceAsCreator";
import { MessageModal } from "../components/MessageModal";
import { useDeleteConversation } from "../hooks/deleteConversation";
import { useWebSocket } from "../context/webSocketContext";

interface Acceptance {
    username: string;
    description: string;
    platform: string;
    platformUsername?: string;
    conversationId: number;
}

const YourPost = () => {
    const { data: post, isLoading: isLoadingFetch } = useUserPost();
    const { mutateAsync: deletePost, isPending: isLoadingDelete } = useDeletePost();
    const { mutateAsync: rejectAcceptance, isPending: isLoadingReject } = useDeleteAcceptAsCreator();
    const { mutateAsync: deleteConversation, isPending: isDeletingConversation } = useDeleteConversation();
    const { unsubscribeFromConversation } = useWebSocket();
    const navigate = useNavigate();

    if (isLoadingFetch) return <p>Loading...</p>

    //Called when user clicks delete, calls backend to delete user's post
    const handleDelete = async () => {
        try {
            await deletePost();
        } catch {
            alert('Failed to delete post.');
        }
    }

    const handleReject = async (username: string, postId: number, conversationId: number) => {
        try {
            console.log(conversationId)
            await rejectAcceptance({username, postId});
            await deleteConversation({conversationId});
            unsubscribeFromConversation(conversationId);
            localStorage.removeItem(`newMessageNotification_${conversationId}`);
        } catch {
            alert('Failed to reject post.');
        }
    }
    
    //bg-slate-600 text-white py-8 px-4
    return (
        <div className="container mx-auto max-w-7xl mt-6">
            {post ? (
                <div className="max-w-4xl mx-auto bg-slate-500 p-2 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-semibold mb-4">Your Post</h1>

                    <div className="flex justify-between">
                        <h2 className="text-md sm:text-xl font-bold text-left">{post.game}</h2>
                        <span className="text-xs sm:text-sm">{formatDate(post.createdAt)}</span>
                    </div>
                    
                    {/* Post Creator and Platforms */}
                    <div className="flex justify-between items-center text-sm mb-4">
                        <span>{post.user}</span>
                        <span>{post.platforms.join(', ')}</span>
                    </div>
                    
                    {/* Description */}
                    <h2 className="text-md sm:text-xl mb-2">{post.description}</h2>
                    
                    {/* Edit Button*/}
                    <button 
                        onClick={() => {navigate('/editPost')}}
                        className="w-40 py-2 px-6 mt-4 mx-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        Edit Post
                    </button>

                    {/* Delete Button*/}
                    <button 
                        onClick={handleDelete}
                        className="w-40 py-2 px-6 mt-4 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        disabled={isLoadingDelete}
                    >
                        Delete Post
                    </button>

                    {/* Post Acceptances*/}
                    <div className="mt-8">
                        <h2 className="text-2xl font-semibold mb-4">Post Acceptances</h2>
                        <ul className="space-y-4">
                        {post.acceptances.length > 0 ? (
                            post.acceptances.map((acceptance: Acceptance) => (
                                <li key={acceptance.username} className="bg-gray-700 p-4 rounded-lg">
                                    <p className="sm:text-lg"><strong>Username:</strong> {acceptance.username}</p>
                                    <p className="mt-2 sm:text-lg"><strong>Description:</strong> {acceptance.description.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
                                    <p className="mt-2 sm:text-lg"><strong>ConversationId:</strong> {acceptance.conversationId}</p>
                                    {acceptance.platformUsername ? (
                                        <p className="mt-2 sm:text-lg"><strong>{acceptance.platform}:</strong> {acceptance.platformUsername}</p>
                                    ) : (
                                        <p className="mt-2 text-lg"><strong>Platform:</strong> {acceptance.platform}</p>
                                    )}
                                    
                                    <MessageModal conversationId={acceptance.conversationId} conversationType="yourPost" />

                                    <button
                                        className="mx-5 w-40 py-2 px-6 mt-4 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                        onClick={() => 
                                            handleReject(acceptance.username, post.postId, acceptance.conversationId)}
                                        disabled={isLoadingReject || isDeletingConversation}
                                    >
                                        Reject
                                    </button>
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-400">No acceptances yet.</p>
                        )}
                        </ul>
                    </div>
                    
                </div>
            ) : (
                <div>No posts uploaded.</div>
            )}
        </div>
    );
}

export default YourPost;