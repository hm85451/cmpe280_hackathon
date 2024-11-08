import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';
import { getGDP } from "../Api";

const GraphUI = () => {
    const chartRef = useRef(null);
    const sliderRef = useRef(null);
    const [chart, setChart] = useState(null);
    const [allYears, setAllYears] = useState([]);
    const [allDataLoaded, setAllData] = useState([]);
    const [startYear, setStartYear] = useState(1990);
    const [endYear, setEndYear] = useState(2020);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch data from the API
                const response = await getGDP("CHN", 1990, 2020);
                const years = response.map(item => item.year);
                const dataPoints = response.map(item => item.value);

                setAllYears(years.reverse());
                setAllData(dataPoints.reverse());
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (allYears.length > 0 && allDataLoaded.length > 0) {
            // Initialize the chart
            const ctx = chartRef.current.getContext('2d');
            const newChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: allYears,
                    datasets: [{
                        label: 'Outflows',
                        data: allDataLoaded,
                        borderColor: 'rgba(153, 102, 255, 1)',
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        borderWidth: 1,
                        fill: true,
                        tension: 0.4 // Smooth curve
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
                            min: Math.min(...allDataLoaded) - 5,
                            max: Math.max(...allDataLoaded) + 5,
                            title: {
                                display: true,
                                text: 'Outflows'
                            }
                        }
                    }
                }
            });
            setChart(newChart);

            // Initialize the noUiSlider
            noUiSlider.create(sliderRef.current, {
                start: [allYears[0], allYears[allYears.length - 1]],
                connect: true,
                range: {
                    min: allYears[0],
                    max: allYears[allYears.length - 1]
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

                // Update chart data based on the selected years
                const startIndex = allYears.indexOf(newStartYear);
                const endIndex = allYears.indexOf(newEndYear) + 1;

                newChart.data.labels = allYears.slice(startIndex, endIndex);
                newChart.data.datasets[0].data = allDataLoaded.slice(startIndex, endIndex);
                newChart.update();
            });

            // Cleanup function to destroy chart instance on component unmount
            return () => {
                newChart.destroy();
                sliderRef.current.noUiSlider.destroy();
            };
        }
    }, [allYears, allDataLoaded]); // Runs only when data is available

    return (
        <div style={{ textAlign: 'center', margin: '20px' }}>
            <h2>GDP</h2>
            <div ref={sliderRef} style={{ margin: '20px auto', width: '80%' }}></div>
            <div className="slider-labels" style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 20px' }}>
                <span>{startYear}</span>
                <span>{endYear}</span>
            </div>
            <canvas ref={chartRef}></canvas>
        </div>
    );
}

export default GraphUI;
