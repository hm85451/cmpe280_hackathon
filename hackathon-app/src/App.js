import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Chat from './components/Chat';

function App() {
    const [selectedOption, setSelectedOption] = useState(null);
    return (
        <div className="app">
            <Header />
            <div className="app-body">
                <Sidebar setSelectedOption={setSelectedOption}/>
                <MainContent selectedOption={selectedOption}/>
            </div>
        </div>
    );
}

export default App;
