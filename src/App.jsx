import React, { useState } from 'react';
import questoes from '../dados/questoes.json';
import QuestaoFiltro from './QuestaoFiltro';
import FiltroMulti from './FiltroMulti';
import { CaretRight, ChatCenteredText } from "@phosphor-icons/react";

import './App.css'; 

function App() {
  const questoesPorPagina = 10;
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [questoesFiltradas, setQuestoesFiltradas] = useState(questoes); // Todas as questões como padrão
  const [filtroBanca, setFiltroBanca] = useState(null);
  const [filtroDisciplina, setFiltroDisciplina] = useState(null);
  const [filtroAssunto, setFiltroAssunto] = useState(null);
  const [filtroAno, setFiltroAno] = useState(null);
  const [filtroModalidade, setFiltroModalidade] = useState(null);
  const [filtroArea, setFiltroArea] = useState(null);

  const indiceInicial = (paginaAtual - 1) * questoesPorPagina;
  
 


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

  
  

 


   const [alternativasSelecionadas, setAlternativasSelecionadas] = useState({});

  const handleAlternativaClick = (questaoId, alternativaIndex) => {
    setAlternativasSelecionadas((prevSelecionadas) => ({
      ...prevSelecionadas,
      [questaoId]: alternativaIndex,
    }));
  };

  const [feedback, setFeedback] = useState({});
  const verificarResposta = (questao) => {
    const alternativaSelecionada = alternativasSelecionadas[questao.id];
    const respostaCorreta = questao.resposta.charCodeAt(0) - 65;
  
    if (alternativaSelecionada === respostaCorreta) {
      setFeedback((prevFeedback) => ({
        ...prevFeedback,
        [questao.id]: 'Você acertou!',
      }));
    } else {
      setFeedback((prevFeedback) => ({
        ...prevFeedback,
        [questao.id]: 'Você errou!',
      }));
    }
  };


  const [comentariosVisiveis, setComentariosVisiveis] = useState({});

  const toggleComentario = (questaoId) => {
    console.log("Toggled comentario for questaoId:", questaoId);
    setComentariosVisiveis((prevVisiveis) => ({
      ...prevVisiveis,
      [questaoId]: !prevVisiveis[questaoId],
    }));
  };



  const handleFilterChange = (filteredQuestoes) => {
    setQuestoesFiltradas(filteredQuestoes);
    setPaginaAtual(1);
  };
  
  
  
  return (
    
    <div className="App">
<div className="campo-nome-home"><h2 className="nome-home">SESO em Concursos</h2></div>
    
<FiltroMulti onFilterChange={handleFilterChange} />

      

{questoesPagina.map((questao) => (
  <div key={questao.id} className="question-container">
    <div className="cabecalho-disciplina">
     
    <p>ID: {questao.id}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{questao.disciplina}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{questao.assunto}</p>

      
    </div>
    <div className="cabecalho-orgao">
    <p>Banca: {questao.banca}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ano: {questao.ano}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Cargo: {questao.cargo}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
    <p>Órgão: {questao.concurso}</p>
    </div>
    <p className="enunciado">{questao.enunciado}</p>
    <ul>
  {questao.alternativas.map((alternativa, index) => {
    const letraAlternativa = alternativa.match(/^\(([A-E])\)/)[1];


    

    return (
      <li
        className={`alternativa ${alternativasSelecionadas[questao.id] === index ? 'selecionada' : ''}`}
        key={index}
        onClick={() => handleAlternativaClick(questao.id, index)}
      >
        <span
          className={`letra-alternativa-circle ${alternativasSelecionadas[questao.id] === index ? 'selecionada' : ''}`}
        >
          {letraAlternativa}
        </span>
        {alternativa.replace(/^\(([A-E])\)/, '')}
      </li>
    );
  })}
</ul>

<div className="button-feedback-container">
<button className="button-responder" onClick={() => verificarResposta(questao)}>
  Responder
</button>


{feedback[questao.id] && (
  <p className={`feedback ${feedback[questao.id] === 'Você acertou!' ? 'acerto' : 'erro'}`}>
    {feedback[questao.id] === 'Você acertou!' ? 'Você acertou!' : `Você errou! A alternativa correta é: ${questao.resposta}`}
  </p>
)}
</div>

  

<div className="linha-horizontal-comentario"></div>

  <div className="campo-comentario">  
<button className="button-comentario" onClick={() => toggleComentario(questao.id)}> <ChatCenteredText size={14}  />  Comentário do Professor
      </button>

      <p className={comentariosVisiveis[questao.id] ? "comentario visivel" : "comentario"}>
        {questao.comentario}
      </p>
      </div>
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
