import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from './pages/home.jsx'



ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <React.StrictMode>
      <Routes>
        <Route path="/" element={<Home />} />
   
  
      </Routes>
    </React.StrictMode>
  </Router>
)
