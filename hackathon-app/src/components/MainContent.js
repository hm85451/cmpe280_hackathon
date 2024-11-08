import React from 'react';
import Visualizer from './Visualizer';
import './MainContent.css';

function MainContent({ option, country }) {
    const renderContent = () => {
        // If option is 'import', render Visualizer regardless of country value
        if (option === 'import') {
            return <Visualizer />;
        }

        // For other options, handle them with their respective country values
        switch(option) {
            case 'gearbox1':
                return <div>GDP</div>;
            case 'gearbox2':
                return <div>FDI</div>;
          
            // ... add other cases for different options
            default:
                return <div>Please select an option from the sidebar</div>;
        }
    };

    return (
        <main className="main-content">
            {renderContent()}
        </main>
    );
}

export default MainContent;