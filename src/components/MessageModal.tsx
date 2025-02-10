import { useEffect, useRef, useState } from "react";
import { useGetMessages } from "../hooks/fetchMessages";
// import { useSendMessage } from "../hooks/createMessage";
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
};

export const MessageModal: React.FC<MessageModalProps> = ({ conversationId }) => {
    const { data: messages, isLoading: isFetchingMessages, refetch } = useGetMessages(conversationId);
    // const { mutateAsync: sendNewMessage, isLoading: isSendingMessage } = useSendMessage();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [newMessage, setNewMessage] = useState<string>('');
    const { user } = useUserContext();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [messageReceived, setMessageReceived] = useState<boolean>(false);

    //const socketRef = useRef<WebSocket | null>(null);

    const ws = useWebSocket();

    // const showNotificationRef = useRef(false);
    // const lastMessageCountRef = useRef(0);
    // const messagesLoadedRef = useRef(false);

    useEffect(() => {
        const storedMessageStatus = localStorage.getItem(`newMessageNotification_${conversationId}`)
        if (storedMessageStatus === "true") {
            setMessageReceived(true);
        }
        
        if (ws) {
            ws.send(JSON.stringify({ type: 'subscribe', conversationId }));

            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                console.log("message received");
                setMessageReceived(true);
                localStorage.setItem(`newMessageNotification_${message.conversationId}`, "true");
                if (message.conversationId === conversationId) {
                    refetch();
                }
            };

            return () => {
                ws.send(JSON.stringify({ type: 'unsubscribe', conversationId }));
            }
        }

        
        
        // if (!socketRef.current) {
        //     const ws = new WebSocket("ws://localhost:3001/ws");
        //     socketRef.current = ws;

        //     ws.onopen = () => {
        //         console.log("WebSocket connected");
        //         ws.send(JSON.stringify({ type: "subscribe", conversationId }));
        //     };

        //     ws.onmessage = (event) => {
        //         const receivedMessage = JSON.parse(event.data);
        //         setMessageReceived(true);
        //         localStorage.setItem(`newMessageNotification_${conversationId}`, "true");
        //         if (receivedMessage.conversationId === conversationId) {
        //             refetch();
        //         }
        //     };

        //     ws.onclose = () => {
        //         console.log("WebSocket disconnected");
        //     };

        //     ws.onerror = (error) => {
        //         console.error("Websocket error:", error);
        //     }

        //     return () => {
        //         if (ws.readyState === WebSocket.OPEN) {
        //             ws.send(JSON.stringify({ type: "unsubscribe", conversationId}));
        //             ws.close();
        //         }
        //     }
        // };
    }, [ws, conversationId, refetch]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "auto" });
        }
    }, [isModalOpen, messages]);

    // useEffect(() => {
    //     const storedNotification = localStorage.getItem(`newMessageNotification_${conversationId}`);
    //     if (storedNotification == "true") {
    //         showNotificationRef.current = true;
    //     }
    // }, [conversationId]);

    // useEffect(() => {
    //     if ( !messages || !messages.messages) return;

    //     const currentMessageCount = messages.messages.length;
    //     console.log(lastMessageCountRef.current)

    //     if (!messagesLoadedRef.current) {
    //         lastMessageCountRef.current = currentMessageCount;
    //         messagesLoadedRef.current = true;
    //         return;
    //     }

    //     if (currentMessageCount > lastMessageCountRef.current) {
    //         showNotificationRef.current = true;
    //         lastMessageCountRef.current = currentMessageCount;
    //         localStorage.setItem(`newMessageNotification_${conversationId}`, "true");
    //     }
    // }, [messages, conversationId]);

    const sendMessage = async (message: string) => {
        try {
            // const newMsg = {
            //     conversationId: conversationId,
            //     content: message
            // };
            // await sendNewMessage(newMsg);

            if (ws) {
                ws.send(JSON.stringify({
                    type: 'message',
                    conversationId,
                    content: message,
                    senderId: user.id,
                }))
            }
            setNewMessage('');

            // if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;

            // setNewMessage("");
            // socketRef.current.send(
            //     JSON.stringify({
            //         type: "message",
            //         conversationId,
            //         content: message,
            //         senderId: user.id,
            //     })
            // )
        } catch (error) {
            console.log(error);
        }
    }

        if (isFetchingMessages) return <p>Loading...</p>

    return (
        <>
            <button
                className={`w-40 py-2 px-4 rounded-lg ${!messageReceived ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-yellow-500 hover:bg-yellow-600 text-white'}`}
                onClick={() => {
                    setIsModalOpen(true);
                    setMessageReceived(false)
                    localStorage.setItem(`newMessageNotification_${conversationId}`, "false");
                }}
            >
                { !messageReceived ? 'Open Messages' : 'New Message' }
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
                                        <strong>{msg.senderId === user.id ? 'You' : "Them"}:</strong> {msg.content}
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
                                    setMessageReceived(false);
                                    localStorage.setItem(`newMessageNotification_${conversationId}`, "false");
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
                                // disabled={isSendingMessage}
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