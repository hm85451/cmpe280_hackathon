import React from 'react';
import './MainContent.css';

function MainContent({option, country}) {
    return (
        <main className="main-content">
            <div>{option}, {country}</div>
        </main>
    );
}

export default MainContent;