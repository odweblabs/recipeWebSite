import { useEffect } from 'react';
import axios from 'axios';

const Heartbeat = () => {
    useEffect(() => {
        const sendHeartbeat = () => {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) return;

            axios.post('http://localhost:5050/api/auth/heartbeat', {}, {
                headers: { Authorization: `Bearer ${token}` }
            }).catch(() => { });
        };

        // Send initial heartbeat
        sendHeartbeat();

        // Send heartbeat every 30 seconds
        const interval = setInterval(sendHeartbeat, 30000);

        return () => clearInterval(interval);
    }, []);

    return null;
};

export default Heartbeat;
