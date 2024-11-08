import React from 'react';
import './MainContent.css';
import GraphUI from "./GraphUI";
import Chat from './Chat';

function MainContent({option, country}) {

    return (
        <main className="main-content">
            {option === 'chat' ? (
                <Chat />
            ) : (
                <div className="main-contain">
                    <GraphUI
                        selectedOption={option}
                        selectedCountry={country} />
                </div>
            )}
        </main>
    );
}

export default MainContent;
