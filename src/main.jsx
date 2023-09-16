import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from './pages/home.jsx'
import MeuPerfil from './pages/MeuPerfil.jsx'
import SuccessPage from './pages/success.jsx'
import RankingDesempenho from './pages/RankingDesempenho.jsx'
import CadastroQuestoes from './pages/CadastroQuestoes.jsx'




ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <React.StrictMode>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/MeuPerfil" element={<MeuPerfil />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/RankingDesempenho" element={<RankingDesempenho />} />
        <Route path="/CadastroQuestoes" element={<CadastroQuestoes />} />
      </Routes>
    </React.StrictMode>
  </Router>
)
