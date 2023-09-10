import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from './pages/home.jsx'
import MeuPerfil from './pages/MeuPerfil.jsx'



ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <React.StrictMode>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/MeuPerfil" element={<MeuPerfil />} />

      </Routes>
    </React.StrictMode>
  </Router>
)
