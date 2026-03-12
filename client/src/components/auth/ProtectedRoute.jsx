import { safeGetToken, safeClearAuth, safeGetStorage, safeSetStorage, safeRemoveStorage } from '../../utils/storage';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = safeGetToken();
    const location = useLocation();

    if (!token) {
        // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
        // Mevcut konumu state olarak gönderiyoruz ki girişten sonra geri dönebilsin
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
