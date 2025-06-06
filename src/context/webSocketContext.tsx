import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { useUserContext } from './authContextProvider';
import { WebSocketContextType } from '../types';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../hooks/queryKeys';

const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketProviderProps {
    children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [newMessage, setNewMessage] = useState<number>(0);
    const [subscribedConversations, setSubscribedConversations] = useState<Set<number>>(new Set());
    const { user, isAuthenticated } = useUserContext();
    const [, setPendingMessages] = useState<string[]>([]);

    const queryClient = useQueryClient();
    const userId = user.id;

    const shouldReconnect = useRef(true);

    useEffect(() => {
        if (!isAuthenticated) {
            shouldReconnect.current = false;
            return;
        }

        //starts the connection to the websocket and sets up its behavior
        function start(websocketServerLocation: string) {
            const socket = new WebSocket(websocketServerLocation);
    
            //send a messages saying connection on opening the connection
            socket.onopen = () => {
                console.log("WebSocket connected");
                setPendingMessages((prev) => {
                    prev.forEach((message) => socket.send(message));
                    return [];
                });
                setPendingMessages([]);
            };
    
            //start a timeout that will reattempt to connect to the server every 5 seconds
            socket.onclose = () => {
                if (isAuthenticated && shouldReconnect.current) {
                    setTimeout(function(){start(websocketServerLocation); console.log('attempt')}, 5000);
                    console.log("Attempted reconnection");
                } else {
                    return;
                }
                
            };
    
            //on error send a console.error out
            socket.onerror = (error) => {
                console.error("WebSocket error:", error);
            };
    
            //on message set new message to alert messageModal of incoming message
            socket.onmessage = (event) => {
                const message = JSON.parse(event.data);

                if (message.type === "refresh") {
                    console.log('Refreshing conversation:', message.conversationId);

                    queryClient.invalidateQueries({
                        queryKey: [QUERY_KEYS.GET_USER_POSTS]
                    });
                } else {
                    queryClient.invalidateQueries({
                        queryKey: [QUERY_KEYS.GET_MESSAGES, message.conversationId]
                    });
    
    
                    if (message.senderId !== userId) {
                        if (message.creatorId == userId) {
                            const key = `yourPostMessageNotifications_${message.conversationId}`;
                            console.log("Received message for my post")
                            queryClient.invalidateQueries({
                                queryKey: [QUERY_KEYS.GET_USER_POSTS]
                            })
                            let currentCount = parseInt(localStorage.getItem(key) ?? '0', 10);
                            currentCount++;
                            localStorage.setItem(key, currentCount.toString());
                        } else {
                            const key = `acceptedPostsMessageNotifications_${message.conversationId}`;
                            let currentCount = parseInt(localStorage.getItem(key) ?? '0', 10);
                            currentCount++;
                            localStorage.setItem(key, currentCount.toString());
                        }
                        
                        setNewMessage(prev => prev + 1);
                    }
                }

            }
    
            setWs(socket);
    
            return socket;
        }

        const webSocketURL = import.meta.env.VITE_NODE_ENV === 'production' ? import.meta.env.VITE_SOCKET_URL : 'ws://localhost:3001/ws';

        const socket = start(webSocketURL);

        return () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };
    }, [isAuthenticated, userId, queryClient]);

    const sendMessage = (message: object) => {
        const messageStr = JSON.stringify(message);

        if (ws?.readyState === WebSocket.OPEN) {
            ws.send(messageStr);
        } else {
            setPendingMessages((prev) => [...prev, messageStr]);
        }
    }

    //subscribes the user to a conversation, used when a new conversation is started
    const subscribeToConversation = (conversationId: number) => {
        if (ws?.readyState === WebSocket.OPEN) {
            sendMessage({ type: "subscribe", conversationId });
            setSubscribedConversations((prev) => new Set([...prev, conversationId]));
        }
    };

    //unsubscribes user from conversation, used when a conversation is rejected or deleted
    const unsubscribeFromConversation = (conversationId: number) => {
        if (ws) {
            ws.send(JSON.stringify({type: "unsubscribe", conversationId }));
            setSubscribedConversations((prev) => {
                const newSet = new Set(prev);
                newSet.delete(conversationId);
                return newSet;
            });
        };
    };

    return (
        <WebSocketContext.Provider value={{ws, newMessage, setNewMessage, subscribedConversations, subscribeToConversation, unsubscribeFromConversation, sendMessage }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const ws = useContext(WebSocketContext);
    if (!ws) {
        throw new Error("WebSocketContext not found.")
    }
    return ws;
}