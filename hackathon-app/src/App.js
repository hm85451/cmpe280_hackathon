import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';


function App() {
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(null);
    return (
        <div className="app">
            <Header />
            <div className="app-body">
                <Sidebar 
                    setSelectedOption={setSelectedOption}
                    setSelectedCountry={setSelectedCountry}
                />
                <MainContent 
                    option={selectedOption}
                    country={selectedCountry}
                />
            </div>
        </div>
    );
}

export default App;
