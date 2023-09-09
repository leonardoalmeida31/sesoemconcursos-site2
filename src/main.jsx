import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from './pages/home.jsx'
import PlanoEstudos from './pages/Plano-Estudos.jsx'



ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <React.StrictMode>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Plano-Estudos" element={<PlanoEstudos />} />

      </Routes>
    </React.StrictMode>
  </Router>
)
