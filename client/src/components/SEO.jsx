import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

/**
 * SEO Component for dynamic title, description and canonical tag management.
 * @param {string} title - Page title (will be suffixed with " - Tarifo")
 * @param {string} description - Meta description
 * @param {string} canonical - Optional specific canonical URL, otherwise current path is used
 */
const SEO = ({ title, description, canonical }) => {
    const location = useLocation();
    const baseUrl = window.location.origin;
    const cleanPath = location.pathname === '/' ? '/' : location.pathname.replace(/\/$/, '');
    const currentCanonical = canonical || `${baseUrl}${cleanPath}`;

    return (
        <Helmet>
            {title && <title>{title}</title>}
            {description && <meta name="description" content={description} />}
            <link rel="canonical" href={currentCanonical} />
            
            {/* Open Graph Tags */}
            {title && <meta property="og:title" content={title} />}
            {description && <meta property="og:description" content={description} />}
            <meta property="og:url" content={currentCanonical} />
            
            {/* Twitter Tags */}
            {title && <meta name="twitter:title" content={title} />}
            {description && <meta name="twitter:description" content={description} />}
        </Helmet>
    );
};

export default SEO;
