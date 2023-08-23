import React, { useState } from 'react';
import questoes from '../dados/questoes.json';
import QuestaoFiltro from './QuestaoFiltro';
import Select from 'react-select';
import './App.css'; 

function App() {
  const questoesPorPagina = 10;
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [filtroBanca, setFiltroBanca] = useState(null);
  const [filtroDisciplina, setFiltroDisciplina] = useState(null);
  const [filtroAssunto, setFiltroAssunto] = useState(null);
  const [filtroAno, setFiltroAno] = useState(null);
  const [filtroModalidade, setFiltroModalidade] = useState(null);
  const [filtroArea, setFiltroArea] = useState(null);

  const indiceInicial = (paginaAtual - 1) * questoesPorPagina;

  const questoesFiltradas = questoes.filter((questao) => {
    if (filtroBanca && questao.banca !== filtroBanca) {
      return false;
    }
    if (filtroDisciplina && questao.disciplina !== filtroDisciplina) {
      return false;
    }
    if (filtroAno && questao.ano !== filtroAno) {
      return false;
    }
    if (filtroModalidade && questao.modalidade !== filtroModalidade) {
      return false;
    }
    if (filtroArea && questao.area !== filtroArea) {
      return false;
    }
    if (filtroAssunto && questao.assunto !== filtroAssunto) { // Adicione esta linha
      return false;
    }
    return true;
  });
  

  const questoesPagina = questoesFiltradas.slice(indiceInicial, indiceInicial + questoesPorPagina);
  const totalPages = Math.ceil(questoesFiltradas.length / questoesPorPagina);

  const handlePreviousPage = () => {
    if (paginaAtual > 1) {
      setPaginaAtual(paginaAtual - 1);
    }
  };

  const handleNextPage = () => {
    if (paginaAtual < totalPages) {
      setPaginaAtual(paginaAtual + 1);
    }
  };

  const handleFilterChange = (banca, disciplina, ano, modalidade, area, assunto) => {
    setFiltroBanca(banca);
    setFiltroDisciplina(disciplina);
    setFiltroAno(ano);
    setFiltroModalidade(modalidade);
    setFiltroArea(area);
    setFiltroAssunto(assunto); // Adicione esta linha
    setPaginaAtual(1);
  };
  

  const bancas = [...new Set(questoes.map((questao) => questao.banca))];
  const disciplinas = [...new Set(questoes.map((questao) => questao.disciplina))];
  const anos = [...new Set(questoes.map((questao) => questao.ano))];
  const modalidades = [...new Set(questoes.map((questao) => questao.modalidade))];
  const areas = [...new Set(questoes.map((questao) => questao.area))];
  const assuntos = [...new Set(questoes.map((questao) => questao.assunto))];


  return (
    <div className="App">
      <QuestaoFiltro
        onFilterChange={handleFilterChange}
        bancas={bancas}
        disciplinas={disciplinas}
        anos={anos}
        modalidades={modalidades}
        areas={areas}
        assuntos={assuntos}
      />

{questoesPagina.map((questao) => (
  <div key={questao.id} className="question-container">
    <div className="cabecalho-disciplina">
      <p>ID: {questao.id}</p>
      <p>{questao.disciplina}</p>
      <p>{questao.assunto}</p>
    </div>
    <div className="cabecalho-orgao">
    <p>Banca: {questao.banca}</p>
    <p>Ano: {questao.ano}</p>
    <p>Órgão: {questao.concurso}</p>
    </div>
    <p className="enunciado">{questao.enunciado}</p>
    <ul >
      {questao.alternativas.map((alternativa, index) => (
        <li className="alternativa" key={index}>{alternativa}</li>
      ))}
    </ul>
    <p>Resposta: {questao.resposta}</p>
    <p>Comentário: {questao.comentario}</p>
  </div>
))}


      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={paginaAtual === 1}>
          Página Anterior
        </button>
        <span>Página {paginaAtual} de {totalPages}</span>
        <button onClick={handleNextPage} disabled={paginaAtual === totalPages}>
          Próxima Página
        </button>
      </div>
    </div>
  );
}

export default App;
