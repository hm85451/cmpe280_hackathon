import React from 'react';
import './MainContent.css';
import GraphUI from "./GraphUI";
import Chat from './Chat';

function MainContent({option, country}) {
    console.log("I want to see selectedOption: " + selectedOption)

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
