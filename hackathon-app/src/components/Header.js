import React, { useState } from 'react';
import './Header.css';
import ReactFlagsSelect from "react-flags-select";

function Header() {
    const [selectedCountry, setSelectedCountry] = useState(null);

    return (
        <header className="header">
            <div className="title">Macroeconomic Researcher Food Security Dashboard</div>
            <ReactFlagsSelect
            className="react-flag-select"
            countries={["US", "CN", "IN"]}
            selected={selectedCountry}
            onSelect={(code) => setSelectedCountry(code)}
  />
        </header>
        
    );
}

export default Header;
