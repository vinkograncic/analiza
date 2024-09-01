import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Papa from 'papaparse';
import './App.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Graph1 = () => {
  const [data, setData] = useState([]);
  const [nationality, setNationality] = useState('');
  const [gender, setGender] = useState('All');

  useEffect(() => {
    fetch('/Data.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            setData(results.data);
            if (results.data.length > 0) {
              setNationality(results.data[0].Nacionalnost);
            }
          },
          error: () => {
            alert('Greška prilikom učitavanja CSV datoteke.');
          }
        });
      })
      .catch(() => {
        alert('Greška prilikom povezivanja s poslužiteljem.');
      });
  }, []);
  

  const filterData = (data, nationality, gender) => {
    return data.filter(item => 
      (nationality === '' || item.Nacionalnost === nationality) &&
      (gender === 'All' || item.Spol === gender)
    );
  };

  const aggregateData = (filteredData) => {
    return filteredData.reduce((acc, item) => {
      const { Nacionalnost, Spol, 'Broj Osoba': count } = item;
      const key = `${Nacionalnost} - ${Spol}`;
      if (!acc[key]) {
        acc[key] = 0;
      }
      acc[key] += Number(count) || 0;
      return acc;
    }, {});
  };

  const filteredData = filterData(data, nationality, gender);
  const aggregatedData = aggregateData(filteredData);

  const labels = Object.keys(aggregatedData);
  const dataset = {
    label: 'Broj Osoba',
    data: labels.map(label => aggregatedData[label]),
    backgroundColor: 'rgba(75,192,192,0.4)',
    borderColor: 'rgba(75,192,192,1)',
    borderWidth: 1,
  };

  const chartData = {
    labels: labels,
    datasets: [dataset],
  };

  const totalCounts = {
    male: filteredData.filter(item => item.Spol === 'Muško').reduce((sum, item) => sum + Number(item['Broj Osoba']), 0),
    female: filteredData.filter(item => item.Spol === 'Žensko').reduce((sum, item) => sum + Number(item['Broj Osoba']), 0),
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const [nationality, gender] = tooltipItem.label.split(' - ');
            return `Nacionalnost: ${nationality}\nSpol: ${gender}\nBroj Osoba: ${tooltipItem.raw}`;
          },
        },
      },
      // Custom plugin to draw the total counts legend at the bottom
      afterDraw: (chart) => {
        const { ctx, chartArea } = chart;
        if (!chartArea) return;

        const fontSize = 12;
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const totalText = `Ukupno: Muškarci: ${totalCounts.male}, Žene: ${totalCounts.female}`;
        const x = chartArea.left + (chartArea.right - chartArea.left) / 2;
        const y = chartArea.bottom + 30; // Adjust this value to move text further from the chart

        ctx.fillText(totalText, x, y);
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Nacionalnost - Spol',
        },
        grid: {
          display: false,
        },
        ticks: {
          autoSkip: false,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Broj Osoba',
        },
        grid: {
          borderDash: [5, 5],
        },
        ticks: {
          padding: 10, // Povećava udaljenost između oznaka na osi i osi
        },
        position: 'left',
        offset: 50,
      },
    },
  };

  const uniqueNationalities = [...new Set(data.map(item => item.Nacionalnost))];
  
  return (
    <div className="container">
      <h2>Distribucija stanovništva po nacionalnosti i spolu</h2>
      <div>
        <label>
          Nacionalnost:
          <select onChange={(e) => setNationality(e.target.value)} value={nationality}>
            {uniqueNationalities.map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="chart-wrapper">
        <div className="chart-container">
          {labels.length > 0 ? <Bar data={chartData} options={chartOptions} /> : <p>Podaci nisu dostupni</p>}
        </div>
      </div>
    </div>
  );
};

export default Graph1;
