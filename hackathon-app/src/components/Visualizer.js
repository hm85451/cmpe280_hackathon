import React, { useState, useEffect } from 'react';
import { ResponsiveSankey } from '@nivo/sankey';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import './Visualizer.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

function Visualizer() {
  const [selectedYear, setSelectedYear] = useState('2022');
  const [selectedCrop, setSelectedCrop] = useState('corn');
  const [sankeyData, setSankeyData] = useState({ nodes: [], links: [] });
  const [pieData, setPieData] = useState([]);
  const [cornData, setCornData] = useState(null);
  const [wheatData, setWheatData] = useState(null);
  const [riceData, setRiceData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cornResponse, wheatResponse, riceResponse] = await Promise.all([
          fetch('../data/corn.csv'),
          fetch('../data/wheat.csv'),
          fetch('../data/rice.csv')
        ]);

        const cornText = await cornResponse.text();
        const wheatText = await wheatResponse.text();
        const riceText = await riceResponse.text();

        const parseCsv = (csv) => {
          const lines = csv.split('\n');
          const headers = lines[0].split(',');
          return lines.slice(1)
            .filter(line => line.trim())
            .map(line => {
              const values = line.split(',');
              return {
                country: values[0].trim(),
                year: parseInt(values[1]),
                import_value: parseFloat(values[2]) || 0
              };
            });
        };

        setCornData(parseCsv(cornText));
        setWheatData(parseCsv(wheatText));
        setRiceData(parseCsv(riceText));
        console.log(riceData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const processData = () => {
      let currentData;
      switch(selectedCrop) {
        case 'corn':
          currentData = cornData || [];
          break;
        case 'wheat':
          currentData = wheatData || [];
          break;
        case 'rice':
          currentData = riceData || [];
          break;
        default:
          currentData = [];
      }

      console.log(`Processing ${selectedCrop} data:`, currentData);

      if (!Array.isArray(currentData) || currentData.length === 0) {
        setSankeyData({ nodes: [], links: [] });
        setPieData([]);
        return;
      }

      const filteredData = currentData
        .filter(d => d.year.toString() === selectedYear)
        .filter(d => !isNaN(d.import_value) && d.import_value > 0)
        .map(d => ({
          ...d,
          country: d.country.trim(),
          import_value: Math.max(0.1, parseFloat(d.import_value))
        }));

      if (filteredData.length === 0) {
        setSankeyData({ nodes: [], links: [] });
        setPieData([]);
        return;
      }

      const nodes = [
        { id: 'Saudi Arabia', nodeColor: COLORS[0] },
        { id: selectedCrop, nodeColor: COLORS[1] },
        ...filteredData.map((d, i) => ({ 
          id: d.country,
          nodeColor: COLORS[(i + 2) % COLORS.length]
        }))
      ];

      const links = [
        {
          source: 'Saudi Arabia',
          target: selectedCrop,
          value: filteredData.reduce((sum, d) => sum + d.import_value, 0)
        },
        ...filteredData.map(d => ({
          source: selectedCrop,
          target: d.country,
          value: d.import_value
        }))
      ];

      console.log('Processed Sankey data:', { nodes, links });

      setSankeyData({ nodes, links });
      setPieData(filteredData.map(d => ({
        name: d.country,
        value: d.import_value
      })));
    };

    processData();
  }, [selectedYear, selectedCrop, cornData, wheatData, riceData]);

  if (!cornData || !wheatData || !riceData) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{width: '100%', padding: '20px'}}>
      <div className="controls">
        <select 
          value={selectedYear} 
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="2022">Year 2022</option>
          <option value="2021">Year 2021</option>
          <option value="2020">Year 2020</option>
        </select>

        <div className="crop-tabs">
          {['corn', 'wheat', 'rice'].map((crop) => (
            <button
              key={crop}
              className={`tab ${selectedCrop === crop ? 'active' : ''}`}
              onClick={() => setSelectedCrop(crop)}
            >
              {crop.charAt(0).toUpperCase() + crop.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        gap: '20px',
        minHeight: '600px'
      }}>
        <div style={{
          flex: '0 0 45%',
          height: '600px'
        }}>
          {sankeyData.nodes.length > 0 && (
            <ResponsiveSankey
              data={sankeyData}
              margin={{ top: 40, right: 160, bottom: 40, left: 50 }}
              align="justify"
              colors={{ scheme: 'category10' }}
              nodeOpacity={1}
              nodeThickness={18}
              nodeInnerPadding={3}
              nodeSpacing={24}
              nodeBorderWidth={0}
              linkOpacity={0.5}
              linkHoverOpacity={0.8}
              enableLinkGradient={true}
            />
          )}
        </div>

        <div style={{
          flex: '0 0 45%',
          height: '600px'
        }}>
          <PieChart width={500} height={500}>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label={({
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                name,
                value,
                percent
              }) => {
                const RADIAN = Math.PI / 180;
                const radius = outerRadius * 1.6;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                
                return (
                  <text
                    x={x}
                    y={y}
                    fill="#000"
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                    fontSize="12px"
                  >
                    {`${name} (${(percent * 100).toFixed(1)}%)`}
                  </text>
                );
              }}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => value.toFixed(2)} />
          </PieChart>
        </div>
      </div>
    </div>
  );
}

export default Visualizer; 