import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/home.jsx'



function App() {

return(
    <Router>
      <Routes>

      <Route path="/" element={<Home />} />
     

      </Routes>
      </Router>
);
}