import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Metodo from './pages/Metodo.jsx'
import Home from './pages/home.jsx'
import PieChart from './PieChart.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <React.StrictMode>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/metodo" element={<Metodo />} />
        <Route path="/PieChart" element={<PieChart />} />
      </Routes>
    </React.StrictMode>
  </Router>
)
