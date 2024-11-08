import React from 'react';
import './MainContent.css';
import Chat from './Chat';
function MainContent({selectedOption}) {
    return (
        <main className="main-content">
            {selectedOption === 'chat' ? (
                <Chat />
            ) : (
                    <div>{option}, {country}</div>
            )}
        </main>
    );
}

export default MainContent;