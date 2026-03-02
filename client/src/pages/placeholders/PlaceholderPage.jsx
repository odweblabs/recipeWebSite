import React from 'react';
import { useLocation } from 'react-router-dom';

const PlaceholderPage = () => {
    const location = useLocation();
    const title = location.pathname.substring(1).toUpperCase().replace('-', ' ');

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">{title}</h1>
                <p className="text-gray-600">Bu sayfa yapım aşamasındadır.</p>
                <p className="text-sm text-gray-400 mt-2">Çok yakında burada harika içerikler olacak!</p>
            </div>
        </div>
    );
};

export default PlaceholderPage;
