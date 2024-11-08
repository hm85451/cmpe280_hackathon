import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Chat from './components/Chat';

function App() {
    const [option, setOption] = useState('Macroeconomic');
    const [country, setCountry] = useState('US');
    return (
        <div className="app">
            <Header country={country} setCountry={setCountry}/>
            <div className="app-body">
                <Sidebar option={option} setOption={setOption}/>
                <MainContent option={option} country={country}/>
            </div>
        </div>
    );
}

export default App;
