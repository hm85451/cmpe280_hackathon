import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';
import {
    getGDP,
    getFDIInflow,
    getFDIOutflow,
    getContribution,
    getCredit,
    getFertilizer,
    getFertilizerProd,
    getReverses,
    getGNI,
    getTotalDebt
} from "../api";

function GraphUI({ selectedOption, selectedCountry }) {
    const chartRefs = useRef([]);
    const sliderRef = useRef(null);
    const [chartInstances, setChartInstances] = useState([]);
    const [allYears, setAllYears] = useState([]);
    const [dataLoaded, setDataLoaded] = useState([]);
    const [startYear, setStartYear] = useState(1970);
    const [endYear, setEndYear] = useState(2020);


    useEffect(() => {
        const fetchData = async () => {
            let indicators = [];
            if (selectedOption === 'Macroeconomic') {
                indicators = [
                    { name: 'GDP (USD)', fetcher: getGDP },
                    { name: 'FDI Inflows (USD)', fetcher: getFDIInflow },
                    { name: 'FDI Outflows (USD)', fetcher: getFDIOutflow }
                ];
            } else if (selectedOption === 'Agricultural') {
                indicators = [
                    { name: 'Contribution of Agri (% GDP)', fetcher: getContribution },
                    { name: 'Credit', fetcher: getCredit },
                    { name: 'Fertilizers', fetcher: getFertilizer },
                    { name: 'Fertilizers Prod', fetcher: getFertilizerProd }
                ];
            } else if (selectedOption === 'Debt Services') {
                indicators = [
                    { name: 'Reserves', fetcher: getReverses },
                    { name: 'GNI', fetcher: getGNI },
                    { name: 'Total Debt (%)', fetcher: getTotalDebt }
                ];
            } else {

                setAllYears([]);
                setDataLoaded([]);
                return;
            }

            try {
                const responses = await Promise.all(
                    indicators.map(ind => ind.fetcher(selectedCountry, 1970, 2020))
                );

                if (responses.length > 0 && responses[0].length > 0) {
                    const years = responses[0].map(item => item.year).reverse();
                    setAllYears(years);
                    setDataLoaded(
                        responses.map((response, idx) => ({
                            label: indicators[idx].name,
                            data: response.map(item => item.value).reverse()
                        }))
                    );

                } else {
                    setAllYears([]);
                    setDataLoaded([]);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

        chartInstances.forEach(chartInstance => {
            if (chartInstance) chartInstance.destroy();
        });
        setChartInstances([]);
        setStartYear(1971);
        setEndYear(2020);
    }, [selectedOption, selectedCountry]);

    useEffect(() => {
        if (allYears.length > 0 && dataLoaded.length > 0) {
            const newChartInstances = [];

            dataLoaded.forEach((dataSet, index) => {
                const chartRef = chartRefs.current[index];

                if (chartRef) {
                   
                    if (chartInstances[index]) {
                        chartInstances[index].destroy();
                    }
                    const borderColor = 'rgba(173, 216, 230, 1)'; 
                    const backgroundColor = 'rgba(173, 216, 230, 0.5)';


                    const newChartInstance = new Chart(chartRef.getContext('2d'), {
                        type: 'line',
                        data: {
                            labels: allYears,
                            datasets: [
                                {
                                    label: dataSet.label,
                                    data: dataSet.data,
                                    borderColor: borderColor,
                                    backgroundColor: backgroundColor,
                                    borderWidth: 1,
                                    fill: true,
                                    tension: 0.4
                                }
                            ]
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
                                    title: {
                                        display: true,
                                        text: dataSet.label
                                    }
                                }
                            }
                        }
                    });

                    newChartInstances[index] = newChartInstance;
                }
            });

            setChartInstances(newChartInstances);
        }
    }, [allYears, dataLoaded]);

    useEffect(() => {
        if (chartInstances.length > 0 && allYears.length > 0) {
            const startIndex = allYears.indexOf(startYear);
            const endIndex = allYears.indexOf(endYear) + 1;

            chartInstances.forEach((chartInstance, idx) => {
                if (chartInstance) {
                    chartInstance.data.labels = allYears.slice(startIndex, endIndex);
                    chartInstance.data.datasets[0].data = dataLoaded[idx].data.slice(
                        startIndex,
                        endIndex
                    );
                    chartInstance.update();
                }
            });
        }
    }, [startYear, endYear]);


    useEffect(() => {
        if (sliderRef.current) {
            // Destroy existing slider
            if (sliderRef.current.noUiSlider) {
                sliderRef.current.noUiSlider.destroy();
            }

            noUiSlider.create(sliderRef.current, {
                start: [1971, 2020],
                connect: true,
                range: {
                    min: 1971,
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
            });
        }

        return () => {
            if (sliderRef.current && sliderRef.current.noUiSlider) {
                sliderRef.current.noUiSlider.destroy();
            }
        };
    }, [allYears]);

    return (
        <div style={{ textAlign: 'center', margin: '20px', width: '1000px',}}>
            <h2>
                Charts for {selectedCountry} - {selectedOption}
            </h2>
            {allYears.length > 0 && (
                <>
                    <div ref={sliderRef} style={{ margin: '20px auto', width: '80%' }}></div>
                    <div
                        className="slider-labels"
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            margin: '10px 20px'
                        }}
                    >
                        <span>{startYear}</span>
                        <span>{endYear}</span>
                    </div>
                </>
            )}
            {dataLoaded.map((dataSet, idx) => (
                <div key={dataSet.label}>
                    <h3>{dataSet.label} Chart</h3>
                    <canvas ref={el => (chartRefs.current[idx] = el)}></canvas>
                </div>
            ))}
        </div>
    );
}

export default GraphUI;
