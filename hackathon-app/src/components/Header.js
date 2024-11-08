import React, { useState } from 'react';
import './Header.css';
import ReactFlagsSelect from "react-flags-select";

function Header({country, setCountry}) {

    return (
        <header className="header">
            <div className="title">Macroeconomic Researcher Food Security Dashboard</div>
            <ReactFlagsSelect
            className="react-flag-select"
            countries={["US", "CN", "IN"]}
            selected={country}
            onSelect={(code) => setCountry(code)}
  />
        </header>
        
    );
}

export default Header;
