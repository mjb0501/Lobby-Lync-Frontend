import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useUserContext } from './authContextProvider';

const WebSocketContext = createContext<WebSocket | null>(null);

interface WebSocketProviderProps {
    children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
    const [ws, setWs] = useState<WebSocket | null>(null);
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

        setWs(socket);

        return () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };
    }, [isAuthenticated]);

    return (
        <WebSocketContext.Provider value={ws}>
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