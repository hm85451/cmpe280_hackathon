import React from 'react';
import './MainContent.css';
import Chat from './Chat';
import Visualizer from './Visualizer';

function MainContent({option, country}) {
    return (
        <main className="main-content">
            {option === 'chat' ? (
                <Chat />
            ) : option === 'import' ? 
                <Visualizer /> : (
                    <div>{option}, {country}</div>
            )}

        </main>
    );
}

export default MainContent;