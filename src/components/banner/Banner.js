import React from 'react';

import './Banner.css';

function Banner({bannerText}){
    return(
        <div className="banner-section">
            <div className="banner">
                <span className="banner-text">{bannerText}</span>
            </div>
        </div>
    );
}

export default Banner;