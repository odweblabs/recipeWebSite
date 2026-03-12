import { safeGetToken, safeClearAuth, safeGetStorage, safeSetStorage, safeRemoveStorage } from '../utils/storage';
import API_BASE from '../utils/api';
import { useEffect } from 'react';
import axios from 'axios';

const Heartbeat = () => {
    useEffect(() => {
        const sendHeartbeat = () => {
            const token = safeGetToken();
            if (!token) return;

            axios.post(`${API_BASE}/api/auth/heartbeat`, {}, {
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
