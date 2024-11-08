import React from 'react';
import './MainContent.css';
import Chat from './Chat';
import Visualizer from './Visualizer';
import GraphUI from './GraphUI';

function MainContent({option, country}) {
    return (
        <main className="main-content">
            {option === 'chat' ? (
                <Chat />
            ) : option === 'import' ? 
                <Visualizer /> : (
                        <GraphUI selectedOption={option} selectedCountry={country} />
            )}

        </main>
    );
}

export default MainContent;