import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';
import { getFDIInflow, getFDIOutflow, getGDP } from "../api";

function GraphUI({ selectedOption, selectedCountry }) {
    const gdpChartRef = useRef(null);
    const fdiInChartRef = useRef(null);
    const fdiOutChartRef = useRef(null);
    const sliderRef = useRef(null);

    const [gdpChartInstance, setGdpChartInstance] = useState(null);
    const [fdiInChartInstance, setFdiInChartInstance] = useState(null);
    const [fdiOutChartInstance, setFdiOutChartInstance] = useState(null);

    const [allYears, setAllYears] = useState([]);
    const [gdpLoaded, setGdpLoaded] = useState([]);
    const [fdiInLoaded, setFdiInLoaded] = useState([]);
    const [fdiOutLoaded, setFdiOutLoaded] = useState([]);
    const [startYear, setStartYear] = useState(1990);
    const [endYear, setEndYear] = useState(2020);

    // Fetch data based on selected option and country
    useEffect(() => {
        const fetchData = async () => {
            if (selectedOption === 'Macroeconomic') {
                try {
                    const [gdpResponse, fdiInResponse, fdiOutResponse] = await Promise.all([
                        getGDP(selectedCountry, 1990, 2020),
                        getFDIInflow(selectedCountry, 1990, 2020),
                        getFDIOutflow(selectedCountry, 1990, 2020)
                    ]);

                    const years = gdpResponse.map(item => item.year).reverse();
                    setAllYears(years);
                    setGdpLoaded(gdpResponse.map(item => item.value).reverse());
                    setFdiInLoaded(fdiInResponse.map(item => item.value).reverse());
                    setFdiOutLoaded(fdiOutResponse.map(item => item.value).reverse());
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };

        fetchData();
    }, [selectedOption, selectedCountry]);

    // Utility function to create and update charts
    const createOrUpdateChart = (chartInstance, setChartInstance, chartRef, data, label, color) => {
        if (!chartRef.current) return;

        if (chartInstance) {
            chartInstance.destroy();
        }

        const newChartInstance = new Chart(chartRef.current.getContext('2d'), {
            type: 'line',
            data: {
                labels: allYears,
                datasets: [{
                    label,
                    data,
                    borderColor: color,
                    backgroundColor: `${color}33`,
                    borderWidth: 1,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Year'
                        }
                    },
                    y: {
                        min: Math.min(...data) - 5,
                        max: Math.max(...data) + 5,
                        title: {
                            display: true,
                            text: label
                        }
                    }
                }
            }
        });

        setChartInstance(newChartInstance);
    };

    // Initialize charts when data is available
    useEffect(() => {
        if (allYears.length > 0) {
            if (gdpLoaded.length > 0) {
                createOrUpdateChart(gdpChartInstance, setGdpChartInstance, gdpChartRef, gdpLoaded, 'GDP (USD)', 'rgba(153, 102, 255, 1)');
            }
            if (fdiInLoaded.length > 0) {
                createOrUpdateChart(fdiInChartInstance, setFdiInChartInstance, fdiInChartRef, fdiInLoaded, 'FDI Inflows (USD)', 'rgba(75, 192, 192, 1)');
            }
            if (fdiOutLoaded.length > 0) {
                createOrUpdateChart(fdiOutChartInstance, setFdiOutChartInstance, fdiOutChartRef, fdiOutLoaded, 'FDI Outflows (USD)', 'rgba(255, 99, 132, 1)');
            }
        }

        // Initialize or update the slider
        if (sliderRef.current && !sliderRef.current.noUiSlider) {
            noUiSlider.create(sliderRef.current, {
                start: [1990, 2020],
                connect: true,
                range: {
                    min: 1990,
                    max: 2020
                },
                step: 1,
                tooltips: [true, true],
                format: {
                    to: value => Math.round(value),
                    from: value => Number(value)
                }
            });

            sliderRef.current.noUiSlider.on('update', (values) => {
                const [newStartYear, newEndYear] = values.map(val => parseInt(val));
                setStartYear(newStartYear);
                setEndYear(newEndYear);

                const startIndex = allYears.indexOf(newStartYear);
                const endIndex = allYears.indexOf(newEndYear) + 1;

                // Update all chart instances with new data range
                [gdpChartInstance, fdiInChartInstance, fdiOutChartInstance].forEach((chartInstance, idx) => {
                    if (chartInstance) {
                        const dataToUpdate = [gdpLoaded, fdiInLoaded, fdiOutLoaded][idx];
                        chartInstance.data.labels = allYears.slice(startIndex, endIndex);
                        chartInstance.data.datasets[0].data = dataToUpdate.slice(startIndex, endIndex);
                        chartInstance.update();
                    }
                });
            });
        }

        // Cleanup function
        return () => {
            [gdpChartInstance, fdiInChartInstance, fdiOutChartInstance].forEach(chartInstance => {
                if (chartInstance) chartInstance.destroy();
            });
            if (sliderRef.current && sliderRef.current.noUiSlider) sliderRef.current.noUiSlider.destroy();
        };
    }, [allYears, gdpLoaded, fdiInLoaded, fdiOutLoaded, gdpChartInstance, fdiInChartInstance, fdiOutChartInstance]);

    return (
        <div style={{ textAlign: 'center', margin: '20px' }}>
            {selectedOption === 'Macroeconomic' && (
                <div>
                    <h2>Charts for {selectedCountry}</h2>
                    <div ref={sliderRef} style={{ margin: '20px auto', width: '80%' }}></div>
                    <div className="slider-labels" style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 20px' }}>
                        <span>{startYear}</span>
                        <span>{endYear}</span>
                    </div>
                    <div>
                        <h3>GDP Chart</h3>
                        <canvas ref={gdpChartRef}></canvas>
                    </div>
                    <div>
                        <h3>FDI Inflows Chart</h3>
                        <canvas ref={fdiInChartRef}></canvas>
                    </div>
                    <div>
                        <h3>FDI Outflows Chart</h3>
                        <canvas ref={fdiOutChartRef}></canvas>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GraphUI;
