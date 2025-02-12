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

        //starts the connection to the websocket and sets up its behavior
        function start(websocketServerLocation: string) {
            const socket = new WebSocket(websocketServerLocation);
    
            //send a messages saying connection on opening the connection
            socket.onopen = () => {
                console.log("WebSocket connected");
            };
    
            //start a timeout that will reattempt to connect to the server every 5 seconds
            socket.onclose = () => {
                setTimeout(function(){start(websocketServerLocation)}, 5000);
                console.log("Attempted reconnection");
            };
    
            //on error send a console.error out
            socket.onerror = (error) => {
                console.error("WebSocket error:", error);
            };
    
            //on message set new message to alert messageModal of incoming message
            socket.onmessage = (event) => {
                const message = JSON.parse(event.data);
                console.log("message received");
                localStorage.setItem(`newMessageNotification_${message.conversationId}`, "true");
                setNewMessage(true);
                console.log("NewMessage");
            }
    
            setWs(socket);
    
            return socket;
        }

        if (!isAuthenticated) return;

        const socket = start('ws://localhost:3001/ws');

        return () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };
    }, [isAuthenticated]);

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