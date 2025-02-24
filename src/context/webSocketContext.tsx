import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
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

    const queryClient = useQueryClient();

    useEffect(() => {

        //starts the connection to the websocket and sets up its behavior
        function start(websocketServerLocation: string) {
            const socket = new WebSocket(websocketServerLocation);
    
            //send a messages saying connection on opening the connection
            socket.onopen = () => {
                console.log("WebSocket connected");
            };
    
            //start a timeout that will reattempt to connect to the server every 5 seconds
            socket.onclose = () => {
                if (!isAuthenticated) {
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

                queryClient.invalidateQueries({
                    queryKey: [QUERY_KEYS.GET_MESSAGES, message.conversationId]
                });


                if (message.senderId !== user.id) {
                    if (message.creatorId == user.id) {
                        const key = `yourPostMessageNotifications_${message.conversationId}`;
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
    
            setWs(socket);
    
            return socket;
        }

        if (!isAuthenticated) return;

        const webSocketURL = import.meta.env.VITE_NODE_ENV === 'production' ? import.meta.env.VITE_SOCKET_URL : 'ws://localhost:3001/ws';

        const socket = start(webSocketURL);

        return () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };
    }, [isAuthenticated, user.id, queryClient]);

    //subscribes the user to a conversation, used when a new conversation is started
    const subscribeToConversation = (conversationId: number) => {
        if (ws) {
            ws.send(JSON.stringify({type: "subscribe", conversationId }));
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
        <WebSocketContext.Provider value={{ws, newMessage, setNewMessage, subscribedConversations, subscribeToConversation, unsubscribeFromConversation }}>
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