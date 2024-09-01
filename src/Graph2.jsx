import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  LineChart, Line,
} from 'recharts';
import './App.css';

const Graph2 = () => {
  const [data, setData] = useState([]);
  const [selectedNationality, setSelectedNationality] = useState('Hrvati');
  const [chartType, setChartType] = useState('bar');

  useEffect(() => {
    fetch('/Data3.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            setData(results.data);
          },
          error: (error) => {
            console.error('Greška prilikom parsiranja CSV:', error);
          }
        });
      });
  }, []);

  const handleChangeNationality = (event) => {
    setSelectedNationality(event.target.value);
  };

  const handleChangeChartType = (event) => {
    setChartType(event.target.value);
  };

  const selectedData = data.find(item => item.Nacionalnosti === selectedNationality);

  return (
    <div className="container">
      <h2>Distribucija stanovništva po nacionalnosti i vjeri</h2>
      <label>
        Nacionalnost:
        <select onChange={handleChangeNationality} value={selectedNationality}>
          {data.map((item, index) => (
            <option key={index} value={item.Nacionalnosti}>
              {item.Nacionalnosti}
            </option>
          ))}
        </select>
      </label>
      <label>
        Vrsta grafa:
        <select onChange={handleChangeChartType} value={chartType}>
          <option value="bar">Stupčasti Graf</option>
          <option value="line">Linijski Graf</option>
        </select>
      </label>

      <div className="chart-wrapper">
        <div className="chart-container">
          <ChartComponent data={selectedData} type={chartType} />
        </div>
      </div>
    </div>
  );
};

const ChartComponent = ({ data, type }) => {
  if (!data) return <div>Izaberite nacionalnost.</div>;

  const chartData = [
    { name: 'Katolici', value: data.Katolici },
    { name: 'Pravoslavci', value: data.Pravoslavci },
    { name: 'Protestanti', value: data.Protestanti },
    { name: 'Ostali kršćani', value: data['Ostali kršćani'] },
    { name: 'Muslimani', value: data.Muslimani },
    { name: 'Židovi', value: data.Židovi },
    { name: 'Istočne religije', value: data['Istočne religije'] },
    { name: 'Ostali', value: data.Ostali },
    { name: 'Agnostici', value: data.Agnostici },
    { name: 'Ateisti', value: data.ateisti },
    { name: 'Neizjasnjeni', value: data.Neizjasnjeni },
    { name: 'Nepoznato', value: data.Nepoznato },
  ];

  return (
    <div className='chart-container'>
      {type === 'bar' && (
<BarChart width={600} height={300} data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
          <XAxis dataKey="name" angle={-45} textAnchor="end" />
          <YAxis />
          <Tooltip />
          <Legend layout="top" />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      )}

      {type === 'line' && (
        <LineChart width={600} height={200} data={chartData}>
          <XAxis dataKey="name" angle={-45} textAnchor="end" />
          <YAxis />
          <Tooltip />
          <Legend layout="top" />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      )}
    </div>
  );
};

export default Graph2;
