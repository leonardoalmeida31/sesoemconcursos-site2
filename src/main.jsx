import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from './pages/home.jsx'
import MeuPerfil from './pages/MeuPerfil.jsx'
import SuccessPage from './pages/success.jsx'
import RankingDesempenho from './pages/RankingDesempenho.jsx'
import CadastroQuestoes from './pages/CadastroQuestoes.jsx'
import AssinaturaPix from './pages/AssinaturaPix.jsx'
import Discursivas from './pages/Discursivas.jsx'
import PixFeito from './pages/PixFeito.jsx'
import CadastroD from './pages/CadastroD.jsx'
import Assinatura from './pages/Assinatura.jsx'
import PlanosDeEstudos from './pages/PlanosDeEstudos.jsx'
import GrupoWhats from './pages/GrupoWhats.jsx'
import Aulas from './pages/Aulas.jsx'
import Mentorias from './pages/Mentorias.jsx'
import EstatisticasSite from './pages/EstatisticasSite.jsx'
import Usuarios from './pages/Usuarios.jsx'
import SESODados from './pages/SESODados.jsx'
import ChartsCamila from './pages/ChartsCamila.jsx'
import TestePix from './pages/TestePix.jsx'




ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <React.StrictMode>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/MeuPerfil" element={<MeuPerfil />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/RankingDesempenho" element={<RankingDesempenho />} />
        <Route path="/CadastroQuestoes" element={<CadastroQuestoes />} />
        <Route path="/AssinaturaPix" element={<AssinaturaPix />} />
        <Route path="/Discursivas" element={<Discursivas />} />
        <Route path="/PixFeito" element={<PixFeito />} />
        <Route path="/CadastroD" element={<CadastroD />} />
        <Route path="/Assinatura" element={<Assinatura />} />
        <Route path="/PlanosDeEstudos" element={<PlanosDeEstudos />} />
        <Route path="/GrupoWhats" element={<GrupoWhats />} />
        <Route path="/Aulas" element={<Aulas />} />
        <Route path="/Mentorias" element={<Mentorias />} />
        <Route path="/EstatisticasSite" element={<EstatisticasSite />} />
        <Route path="/Usuarios" element={<Usuarios />} />
        <Route path="/SESODados" element={<SESODados />} />
        <Route path="/ChartsCamila" element={<ChartsCamila />} />
        <Route path="/TestePix" element={<TestePix />} />
    

        
        
  
        
      
      </Routes>
    </React.StrictMode>
  </Router>
)
