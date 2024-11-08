import React from 'react';
import './MainContent.css';
import GraphUI from "./GraphUI";

function MainContent({selectedOption}) {
    return (
        <main className="main-content">
            <div className="timeline">{selectedOption}</div>
            <div className="charts">
                <GraphUI />
                <div className="chart">GDP Chart</div>
                <div className="chart">FDI Outflows Chart</div>
                <div className="chart">FDI Inflows Chart</div>
            </div>
            <div className="annotations">Annotation</div>
            <div className="footer">Footer</div>
        </main>
    );
}

export default MainContent;