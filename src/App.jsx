// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login/Login';
import Home from './Pages/Home/Home';
import ProtectedRoute from './Context/ProtectedRouter';
import { UserProvider } from './Context/UserContext';
import Discursivas from './Pages/Discursivas/Discursivas';
import MeuPerfil from './Pages/MeuPerfil/MeuPerfil';
import RankingDesempenho from './Pages/Desempenho/RankingDesempenho';
import Mentorias from './Pages/Mentorias/Mentorias';
import Aulas from './Pages/Aulas/Aulas';
import PaymentPage from './Pages/Pagamento/PaymentPage';
import PagamentoPix from './Pages/Pagamento/PagamentoPix';
import SuccessPage from './Pages/Pagamento/SuccessPage';
import Adm from './Pages/Adm/Adm';
import CadastradosEventoEtica from './Pages/Adm/ListaCadastrados/CadastradosEventoEtica';
import CadastroEventoEtica from "./Pages/Adm/Cadastro/CadastroEventoEtica";
import CadastroQuestoes from './Pages/Adm/Cadastro/CadastroQuestoes';
import Usuarios from './Pages/Adm/ListaCadastrados/Usuarios';
import CursoVenda from './Pages/Cursos/CursosCEP';
import Estatisticas from './Pages/Estatisticas/Estatisticas';
import LeisPDF from "./Pages/Aulas/Leis";
import QuestaoDetalhes from './components/Questões/QuestãoDetalhes';
import Perfil from './Pages/Perfil/Perfil';
import ContadorAssinaturas from './Pages/Adm/ListaCadastrados/ContadorAssinatura';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path='/Aulas' element={<Aulas />} />
          <Route path='/Discursivas' element={<Discursivas />} />
          
          <Route path='/MeuPerfil' element={<MeuPerfil />} />
          <Route path='/RankingDesempenho' element={<RankingDesempenho />} />
          <Route path='/Mentorias' element={<Mentorias />} />
          <Route path='/Assinatura' element={<PaymentPage />} />
          <Route path="/AssinarPix" element={<PagamentoPix />} />
          <Route path='/SuccessPage' element={<SuccessPage />} />
          <Route path='/adm' element={<Adm />} />
          <Route path='/CadastradosEventoEtica' element={<CadastradosEventoEtica />} />
          <Route path='/CadastroEventoEtica' element={<CadastroEventoEtica />} />
          <Route path='/CadastroQuestoes' element={<CadastroQuestoes />} />
          <Route path='/Usuarios' element={<Usuarios />} />
          <Route path='/CursoCEP' element={<CursoVenda />} />
          <Route path='/EstatisticaSite' element={<Estatisticas />} />
          <Route path='/LeisPDF' element={<LeisPDF />} />
          <Route path="/questao/:questionId" element={<QuestaoDetalhes />} />
          <Route path='/Perfil' element={<Perfil />} />
          <Route path='/ContadorAssinantes' element={<ContadorAssinaturas  />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
