import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import { ResponsiveSankey } from '@nivo/sankey';
import PropTypes from 'prop-types';
// Import CSV files
import wheatData from '../data/wheat.csv';
import riceData from '../data/rice.csv';
import cornData from '../data/corn.csv';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ImportVisualizer = () => {
    const [selectedYear, setSelectedYear] = useState('2021');
    const [sankeyData, setSankeyData] = useState({ nodes: [], links: [] });
    const [pieData, setPieData] = useState([]);
    const [selectedCrop, setSelectedCrop] = useState('wheat');

    useEffect(() => {
        const processData = () => {
            // Process CSV data based on selected year
            const processedData = {
                wheat: wheatData.filter(d => d.year === selectedYear),
                rice: riceData.filter(d => d.Year === selectedYear),
                corn: cornData.filter(d => d.year === selectedYear)
            };

            // Prepare Sankey data
            const nodes = [
                { id: 'Saudi Arabia' },
                ...Object.keys(processedData).map(crop => ({ id: crop.toUpperCase() })),
                ...Object.values(processedData).flatMap(cropData =>
                    cropData.map(d => ({ id: d.country || d['Partner Countries'] }))
                )
            ];

            const links = Object.entries(processedData).flatMap(([crop, data]) =>
                data.map(d => ({
                    source: 'Saudi Arabia',
                    target: crop.toUpperCase(),
                    value: parseFloat(d.import_value || d.Value),
                })).concat(
                    data.map(d => ({
                        source: crop.toUpperCase(),
                        target: d.country || d['Partner Countries'],
                        value: parseFloat(d.import_value || d.Value),
                    }))
                )
            );

            setSankeyData({ nodes, links });

            // Prepare Pie chart data for selected crop
            const currentCropData = processedData[selectedCrop];
            setPieData(
                currentCropData.map(d => ({
                    name: d.country || d['Partner Countries'],
                    value: parseFloat(d.import_value || d.Value),
                }))
            );
        };

        processData();
    }, [selectedYear, selectedCrop]);

    return (
        <div>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                    <option value="2022">2022</option>
                </select>
                <select value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)}>
                    <option value="wheat">Wheat</option>
                    <option value="rice">Rice</option>
                    <option value="corn">Corn</option>
                </select>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ height: '500px', width: '60%' }}>
                    <ResponsiveSankey
                        data={sankeyData}
                        margin={{ top: 40, right: 160, bottom: 40, left: 50 }}
                        align="justify"
                        colors={{ scheme: 'category10' }}
                        nodeOpacity={1}
                        nodeThickness={18}
                        nodeInnerPadding={3}
                        nodeBorderWidth={0}
                        linkOpacity={0.5}
                        linkHoverOpsacity={0.8}
                        enableLinkGradient={true}
                    />
                </div>

                <div style={{ width: '40%' }}>
                    <PieChart width={400} height={400}>
                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={150}
                            fill="#8884d8"
                            label
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </div>
            </div>
        </div>
    );
};

export default ImportVisualizer;
