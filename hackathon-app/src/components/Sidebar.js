import React, { useState } from 'react';
import './Sidebar.css';

function Sidebar({ option, setOption }) {
    // State to keep track of expanded menu and selected item




    const handleOption = (option) => {
        setOption(option);
    };

    return (
        <aside className="sidebar">
            <ul>
                {/* Macroeconomic Section */}
                <li onClick={() => handleOption('Macroeconomic')}>
                    Macroeconomic (USD)
                </li>
                {option === 'Macroeconomic' && (
                    <ul>
                        <li>GDP USD (USD)</li>
                        <li>FDI Inflows (USD)</li>
                        <li>FDI Outflows (USD)</li>
                    </ul>
                )}

                {/* Agricultural Section */}
                <li onClick={() => handleOption('Agricultural')}>
                    Agricultural
                </li>
                {option === 'Agricultural'  && (
                    <ul>
                        <li>Contribution of Agri (% GDP)</li>
                        <li>Credit</li>
                        <li>Fertilizers</li>
                        <li>Fertilizers PROD</li>
                    </ul>
                )}

                {/* Debt Services Section */}
                <li onClick={() => handleOption('Debt Services')}>
                    Debt Services
                </li>
                {option === 'Debt Services' && (
                    <ul>
                        <li>Reserves</li>
                        <li>GNI</li>
                        <li>Total Debt (%)</li>
                    </ul>
                )}

                {/* Import/Export Flow */}
                <li onClick={() => handleOption('Import/Export Flow')}>
                    Import/Export Flow
                </li>
                <li onClick={() => handleOption('chat')}>
                    LLM Chat
                </li>
            </ul>
        </aside>
    );
}

export default Sidebar;
