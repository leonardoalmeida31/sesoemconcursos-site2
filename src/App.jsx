import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/home.jsx'
import Metodo from './pages/Metodo.jsx'


function App() {

return(
    <Router>
      <Routes>

      <Route path="/" element={<Home />} />
        <Route path="/metodo" element={<Metodo />} />

      </Routes>
      </Router>
);
}