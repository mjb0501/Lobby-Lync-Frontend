import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';

const WebSocketContext = createContext<WebSocket | null>(null);

interface WebSocketProviderProps {
    children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
    const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {

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
    }, []);

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