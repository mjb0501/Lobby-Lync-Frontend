import { formatDate } from '../utils/formatDate';
import { useGetAcceptedPosts } from '../hooks/fetchAcceptedPosts';
import { useDeleteAccept } from '../hooks/deletePostAcceptance';
import { ToastContainer, toast } from 'react-toastify';
import { MessageModal } from '../components/MessageModal';
import { useDeleteConversation } from '../hooks/deleteConversation';
import { useWebSocket } from '../context/webSocketContext';

interface AcceptedPost {
    postId: number;
    creator: string;
    game: string;
    description: string;
    createdAt: string;
    platforms: string[];
    conversationId: number;
}

const AcceptedPosts = () => {
    const { data: acceptedPosts, isLoading: isLoadingAcceptPosts } = useGetAcceptedPosts();
    const { mutateAsync: deletePostAcceptance, isLoading: isDeletingAccept } = useDeleteAccept();
    const { mutateAsync: deleteConversation, isLoading: isDeletingConversation } = useDeleteConversation();
    const { unsubscribeFromConversation } = useWebSocket(); 

    if (isLoadingAcceptPosts || isDeletingAccept) return <p>Loading...</p>

    const handleDelete = async (postId: number, conversationId: number) => {
        try {
            await deletePostAcceptance(postId);
            await deleteConversation({conversationId});
            unsubscribeFromConversation(conversationId);
            localStorage.removeItem(`newMessageNotification_${conversationId}`);
            toast.success('Successfully Deleted Acceptance', {toastId: 1})
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div className="container mx-auto max-w-7xl">
        <div className="space-y-6 flex flex-col items-center">

        <ToastContainer 
            position="top-center"
            pauseOnHover={false}
            pauseOnFocusLoss={false}
        />

            <h1 className="text-3xl text-slate-100 mb-4">Accepted Posts</h1>

            {acceptedPosts.length > 0 ? (
                <ul className='space-y-6 flex flex-col items-center'>
                        {acceptedPosts.map((post: AcceptedPost) => (
                            <li key={post.postId} className="bg-slate-500 p-2 rounded-lg shadow w-full max-w-md">
                
                                {/* Game Name and Created At */}
                                <div className="flex justify-between">
                                    <h2 className="text-md font-bold text-left sm:text-xl">{post.game}</h2>
                                    <span className="text-sm mx-1">{formatDate(post.createdAt)}</span>
                                </div>
                    
                                {/* Post Creator and Platforms */}
                                <div className="flex justify-between items-center text-sm sm:text-lg mb-4">
                                    <span>{post.creator}</span>
                                    <span>{post.platforms.join(', ')}</span>
                                </div>
                    
                                {/* Description */}
                                <h2 className="text-md sm:text-xl mb-2">{post.description}</h2>
                    
                                <MessageModal conversationId={post.conversationId} conversationType='acceptedPosts' />

                                <button
                                    className="mx-5 w-40  py-2 px-6 mt-4 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                    onClick={() => {handleDelete(post.postId, post.conversationId)}}
                                    disabled={isDeletingConversation}
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                        </ul>
            ) : (
                <p>
                    No accepted posts found.
                </p>
            )}
        </div>
    </div>
    
  )
}

export default AcceptedPosts