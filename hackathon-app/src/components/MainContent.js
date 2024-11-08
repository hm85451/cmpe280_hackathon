import React from 'react';
import './MainContent.css';

function MainContent({selectedOption}) {
    return (
        <main className="main-content">
            <div className="timeline">{selectedOption}</div>
        </main>
    );
}

export default MainContent;