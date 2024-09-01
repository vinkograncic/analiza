import React from 'react';
import Graph1 from './Graph1'; 
import Graph2  from './Graph2';
import './App.css'; 
import Graph3 from './Graph3';
const App = () => {
  return (
    <div className="app-container">
      <div className="chart-wrapper">
        <Graph1 />
        <Graph2 />
        <Graph3 />
      </div>
    </div>
  );
};

export default App;
