import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const useSocket = () => {
    const [items, setItems] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef(null);

    useEffect(() => {
        // Initialize Socket
        socketRef.current = io(SOCKET_URL);

        // Connection Listeners
        socketRef.current.on('connect', () => {
            setIsConnected(true);
            console.log('Connected with ID:', socketRef.current.id);
        });

        socketRef.current.on('disconnect', () => {
            setIsConnected(false);
        });

        // Auction Listeners
        socketRef.current.on('UPDATE_BID', (updatedItem) => {
            setItems((prevItems) =>
                prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
            );
        });

        socketRef.current.on('BID_ERROR', ({ message }) => {
            alert(message);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const fetchItems = async () => {
        try {
            const res = await fetch(`${SOCKET_URL}/items`);
            const data = await res.json();
            setItems(data);
        } catch (err) {
            console.error('Failed to fetch items:', err);
        }
    };

    const placeBid = (itemId, amount) => {
        if (socketRef.current) {
            socketRef.current.emit('BID_PLACED', { itemId, amount });
        }
    };

    return {
        socket: socketRef.current,
        items,
        isConnected,
        fetchItems,
        placeBid
    };
};