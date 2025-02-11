import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useUserContext } from './authContextProvider';
import { WebSocketContextType } from '../types';

const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketProviderProps {
    children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [newMessage, setNewMessage] = useState<boolean>(false);
    const [subscribedConversations, setSubscribedConversations] = useState<Set<number>>(new Set());
    const { isAuthenticated } = useUserContext();

    useEffect(() => {

        if (!isAuthenticated) return;

        const socket = new WebSocket('ws://localhost:3001/ws');

        socket.onopen = () => {
            console.log("WebSocket connected");
        };

        socket.onclose = () => {
            console.log("WebSocket disconnected");
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log("message received");
            localStorage.setItem(`newMessageNotification_${message.conversationId}`, "true");
            setNewMessage(true);
            console.log("NewMessage");
        }

        setWs(socket);

        return () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };
    }, [isAuthenticated]);

    const subscribeToConversation = (conversationId: number) => {
        if (ws) {
            ws.send(JSON.stringify({type: "subscribe", conversationId }));
            setSubscribedConversations((prev) => new Set([...prev, conversationId]));
        }
    };

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