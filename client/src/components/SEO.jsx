import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * SEO Component for dynamic title, description and canonical tag management.
 * @param {string} title - Page title (will be suffixed with " - Tarifo")
 * @param {string} description - Meta description
 * @param {string} canonical - Optional specific canonical URL, otherwise current path is used
 */
const SEO = ({ title, description, canonical }) => {
    const location = useLocation();
    
    useEffect(() => {
        // 1. Update Title
        if (title) {
            document.title = title;
        }

        // 2. Update Description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = 'description';
            document.head.appendChild(metaDescription);
        }
        
        if (description) {
            metaDescription.setAttribute('content', description);
        }

        // 3. Update Canonical Tag
        let linkCanonical = document.querySelector('link[rel="canonical"]');
        if (!linkCanonical) {
            linkCanonical = document.createElement('link');
            linkCanonical.rel = 'canonical';
            document.head.appendChild(linkCanonical);
        }

        const baseUrl = window.location.origin;
        const currentCanonical = canonical || `${baseUrl}${location.pathname}`;
        linkCanonical.setAttribute('href', currentCanonical);

        // Optional: Update OG Tags
        const updateOG = (property, content) => {
            let meta = document.querySelector(`meta[property="${property}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('property', property);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };

        if (title) updateOG('og:title', title);
        if (description) updateOG('og:description', description);
        updateOG('og:url', currentCanonical);

    }, [title, description, canonical, location]);

    return null; // This component doesn't render anything
};

export default SEO;
