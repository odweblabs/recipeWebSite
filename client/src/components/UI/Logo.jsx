import React from 'react';

const Logo = ({ className = "text-3xl" }) => {
    return (
        <span className={`font-['Fascinate_Inline'] text-chefie-yellow tracking-wider select-none inline-block ${className}`}>
            Tarifo
        </span>
    );
};

export default Logo;
