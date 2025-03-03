import { useEffect, useRef, useState } from "react";
import { useGetMessages } from "../hooks/fetchMessages";
import { useUserContext } from "../context/authContextProvider";
import { useWebSocket } from "../context/webSocketContext";

interface Message {
    id: number;
    sender: number;
    content: string;
    createdAt: Date;
    senderId: string;
}

type MessageModalProps = {
    conversationId: number;
    conversationType: 'yourPost' | 'acceptedPosts'
};

export const MessageModal: React.FC<MessageModalProps> = ({ conversationId,  conversationType}) => {
    const { data: messages, isLoading: isFetchingMessages, refetch } = useGetMessages(conversationId);
    // const { mutateAsync: sendNewMessage, isLoading: isSendingMessage } = useSendMessage();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [newMessage, setNewMessage] = useState<string>('');
    const { user } = useUserContext();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [messagesReceived, setMessagesReceived] = useState<number>(0);

    const {ws, newMessage: received, setNewMessage: 
        setReceived, subscribedConversations, subscribeToConversation} = useWebSocket();

    useEffect(() => {
        //checks to see if specific conversation has received a message via localstorage
        const storedMessageStatus = localStorage.getItem(`${conversationType}MessageNotifications_${conversationId}`) ?? '0';
        //if it has received a message open message modal button will change to reflect new message
        //messages will be refetched so that they are up to date
        if (Number(storedMessageStatus) > 0) {
            setMessagesReceived(Number(storedMessageStatus));
            refetch();
        }

    }, [conversationId, conversationType, refetch, received]);

    useEffect(() => {
        if (ws) {
            //if the user is for some reason not yet subscribed to the conversation they will be subscribed
            if (!subscribedConversations.has(conversationId)) {
                subscribeToConversation(conversationId);
            }
        }
    }, [ws, subscribedConversations, subscribeToConversation, conversationId]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "auto" });
        }
    }, [isModalOpen, messages]);

    const sendMessage = async (message: string) => {
        try {
            //send a message through the web socket
            if (ws?.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: 'message',
                    conversationId,
                    content: message,
                    senderId: user.id,
                }))
            }
            //reset the message text area
            setNewMessage('');
            setTimeout(() => refetch(), 100);
        } catch (error) {
            console.log(error);
        }
    }

        if (isFetchingMessages) return <p>Loading...</p>

    return (
        <>
            <button
                className={`w-40 py-2 px-4 rounded-lg ${messagesReceived === 0 ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-yellow-500 hover:bg-yellow-600 text-white'}`}
                onClick={() => {
                    setIsModalOpen(true);
                    setMessagesReceived(0)
                    const key = `${conversationType}MessageNotifications_${conversationId}`;
                    setReceived(prev => prev - parseInt(localStorage.getItem(key) ?? '0'));
                    localStorage.setItem(key, "0");
                }}
            >
                { messagesReceived === 0 ? 'Open Messages' : ` ${messagesReceived} New Messages` }
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 text-black">Messages</h2>
        
                        {/* Message List */}
                        <div className="max-h-60 overflow-y-auto mb-4">
                            {messages.messages.length > 0 ? (
                                messages.messages.map((msg: Message) => (
                                    <div 
                                        key={msg.id} 
                                        className={`mb-2 p-2 border rounded text-white 
                                            break-words 
                                            ${msg.senderId === user.id ? 
                                            "bg-blue-400" : "bg-slate-400"}`}
                                    >
                                        <strong>{msg.senderId === user.id ? 'You' : "Them"}:</strong> {msg.content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No messages yet.</p>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
        
                        {/* Message Input */}
                        <textarea
                            className="w-full p-2 border rounded mb-2 text-black"
                            rows={3}
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
        
                        {/* Buttons */}
                        <div className="flex justify-end space-x-2">
                            <button 
                                className="bg-gray-400 px-4 py-2 rounded" 
                                onClick={() => {
                                    setIsModalOpen(false);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={() => {
                                    if (newMessage.trim()) {
                                        sendMessage(newMessage);
                                    }
                                }}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};