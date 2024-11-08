import React from 'react';
import './MainContent.css';
import Chat from './Chat';
function MainContent({option, country}) {
    return (
        <main className="main-content">
            {option === 'chat' ? (
                <Chat />
            ) : (
                    <div>{option}, {country}</div>
            )}
        </main>
    );
}

export default MainContent;