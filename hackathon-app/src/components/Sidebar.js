import React, { useState } from 'react';
import './Sidebar.css';

function Sidebar({ setSelectedOption }) {
    // State to keep track of expanded menu and selected item
    const [expandedMenu, setExpandedMenu] = useState([false, false, false]);

    // Toggles the expanded state of a menu
    const toggleMenu = (menu) => {
        if(menu=== 1)
            setExpandedMenu((prevMenu) => [!prevMenu[0], prevMenu[1], prevMenu[2]]);
        else if (menu=== 2)
            setExpandedMenu((prevMenu) => [prevMenu[0], !prevMenu[1], prevMenu[2]]);
        else
            setExpandedMenu((prevMenu) => [prevMenu[0], prevMenu[1], !prevMenu[2]]);
    };


    // Handles selecting an option
    const handleSelect = (option) => {
        setSelectedOption(option);
    };

    return (
        <aside className="sidebar">
            <ul>
                {/* Macroeconomic Section */}
                <li onClick={() => toggleMenu(1)}>
                    Macroeconomic (USD)
                </li>
                {expandedMenu[0] && (
                    <ul>
                        <li onClick={() => handleSelect('gearbox1')}>GDP USD (USD)</li>
                        <li onClick={() => handleSelect('gearbox2')}>FDI Inflows (USD)</li>
                        <li onClick={() => handleSelect('gearbox3')}>FDI Outflows (USD)</li>
                    </ul>
                )}

                {/* Agricultural Section */}
                <li onClick={() => toggleMenu(2)}>
                    Agricultural
                </li>
                {expandedMenu[1]  && (
                    <ul>
                        <li onClick={() => handleSelect('agri_gdp')}>Contribution of Agri (% GDP)</li>
                        <li onClick={() => handleSelect('credit')}>Credit</li>
                        <li onClick={() => handleSelect('fertilizers')}>Fertilizers</li>
                        <li onClick={() => handleSelect('fertilizers_prod')}>Fertilizers PROD</li>
                    </ul>
                )}

                {/* Debt Services Section */}
                <li onClick={() => toggleMenu(3)}>
                    Debt Services
                </li>
                {expandedMenu[2]  && (
                    <ul>
                        <li onClick={() => handleSelect('reserves')}>Reserves</li>
                        <li onClick={() => handleSelect('gni')}>GNI</li>
                        <li onClick={() => handleSelect('total_debt')}>Total Debt (%)</li>
                    </ul>
                )}

                {/* Import/Export Flow */}
                <li onClick={() => handleSelect('import_export')}>
                    Import/Export Flow
                </li>
            </ul>
        </aside>
    );
}

export default Sidebar;