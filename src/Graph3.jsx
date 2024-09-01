import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Papa from 'papaparse';
import './App.css';

ChartJS.register(CategoryScale, LinearScale, BarElement);

const Graph3 = () => {
  const [data, setData] = useState([]);
  const [ageGroup, setAgeGroup] = useState('0-4');
  const ageGroups = ['0-4', '5-9', '10-14', '15-19', '20-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60-64', '65-69', '70-74', '75-79', '80-84', '85-89', '90-94', '95+'];

  useEffect(() => {
    fetch('/Data4.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            console.log('CSV Data:', results.data); // Provjera podataka
            setData(results.data);
          },
        });
      });
  }, []);

  // Funkcija za pretvaranje brojeva u ispravan format
  const parseNumber = (str) => {
    if (typeof str === 'string') {
      return Number(str.replace(/,/g, '')); // Ukloni zareze i konvertiraj u broj
    }
    return str;
  };

  // Filtriraj podatke prema dobnoj skupini
  const getAgeGroupData = (data, ageGroup) => {
    const filteredData = data.filter(item => item['Spol']);
    return filteredData.reduce((acc, item) => {
      const { Spol, [ageGroup]: count } = item;
      acc[Spol] = count ? parseNumber(count) : 0; // Pretvori u broj
      return acc;
    }, {});
  };

  const ageGroupData = getAgeGroupData(data, ageGroup);

  // Provjera podataka
  console.log('Age Group Data:', ageGroupData);

  // Pripremi podatke za graf
  const chartData = {
    labels: ['Muški', 'Ženski'],
    datasets: [
      {
        label: `Broj Osoba (${ageGroup})`,
        data: [ageGroupData['m'] || 0, ageGroupData['ž'] || 0], // Muški i Ženski
        backgroundColor: ['rgba(75,192,192,0.4)', 'rgba(153,102,255,0.4)'],
        borderColor: ['rgba(75,192,192,1)', 'rgba(153,102,255,1)'],
        borderWidth: 1,
      },
    ],
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
            return `Broj Osoba: ${tooltipItem.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Spol',
        },
        grid: {
          display: false,
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
      },
    },
  };

  return (
    <div className="container">
      <h2>Distribucija stanovništva po dobnoj skupini i spolu</h2>
      <div>
        <label>
          Odaberite dobnu skupinu:
          <select onChange={(e) => setAgeGroup(e.target.value)} value={ageGroup}>
            {ageGroups.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="chart-wrapper">
        <div className="chart-container">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Graph3;
