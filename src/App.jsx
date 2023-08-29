import React, { useState, useEffect } from "react";
import FiltroMulti from "./FiltroMulti";
import { CaretRight, ChatCenteredText } from "@phosphor-icons/react";
import "./App.css";

import { initializeApp } from "firebase/app";
import { getDocs, getFirestore, collection } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_REACT_APP_API_KEY,
  authDomain: import.meta.env.VITE_REACT_APP_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_REACT_APP_PROJECT_ID,
};

function App() {
  const firebaseApp = initializeApp(firebaseConfig);
  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);
  const questionsCollectionRef = collection(db, "questions");
  const [user, setUser] = useState(null);

  const questoesPorPagina = 10;
  const [questions, setQuestions] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [questoesFiltradas, setQuestoesFiltradas] = useState([]);
  const [filtroBanca, setFiltroBanca] = useState(null);
  const [filtroDisciplina, setFiltroDisciplina] = useState(null);
  const [filtroAssunto, setFiltroAssunto] = useState(null);
  const [filtroAno, setFiltroAno] = useState(null);
  const [filtroModalidade, setFiltroModalidade] = useState(null);
  const [filtroArea, setFiltroArea] = useState(null);
  const indiceInicial = (paginaAtual - 1) * questoesPorPagina;

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Erro ao fazer login com o Google:", error);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      setUser(null); 
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user); 
      } else {
        setUser(null); 
      }
    });
    return () => unsubscribe();
  }, []);

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  useEffect(() => {
    const getQuestions = async () => {
      const data = await getDocs(questionsCollectionRef);
      setQuestions(
        shuffleArray(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      );
    };
    getQuestions();
  }, []);

  useEffect(() => {
    const filtered = questions.filter((question) => {
      return (
        (!filtroBanca || question.banca === filtroBanca) &&
        (!filtroDisciplina || question.disciplina === filtroDisciplina) &&
        (!filtroAno || question.ano === filtroAno) &&
        (!filtroAssunto || question.assunto === filtroAssunto) &&
        (!filtroModalidade || question.modalidade === filtroModalidade)
      );
    });

    setQuestoesFiltradas(filtered);
    setPaginaAtual(1);
  }, [
    filtroBanca,
    filtroDisciplina,
    filtroAssunto,
    filtroAno,
    filtroModalidade,
    filtroArea,
    questions,
  ]);

  const questoesPagina = questoesFiltradas.slice(
    indiceInicial,
    indiceInicial + questoesPorPagina
  );

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

  const handleAlternativaClick = (questionId, alternativaIndex) => {
    setAlternativasSelecionadas((prevSelecionadas) => ({
      ...prevSelecionadas,
      [questionId]: alternativaIndex,
    }));
  };

  const [feedback, setFeedback] = useState({});
  const verificarResposta = (question) => {
    const alternativaSelecionada = alternativasSelecionadas[question.id];
    const respostaCorreta = question.resposta.charCodeAt(0) - 65;

    if (alternativaSelecionada === respostaCorreta) {
      setFeedback((prevFeedback) => ({
        ...prevFeedback,
        [question.id]: "Você acertou!",
      }));
    } else {
      setFeedback((prevFeedback) => ({
        ...prevFeedback,
        [question.id]: "Você errou!",
      }));
    }
  };

  const [comentariosVisiveis, setComentariosVisiveis] = useState({});

  const toggleComentario = (questionId) => {
    console.log("Toggled comentario for questionId:", questionId);
    setComentariosVisiveis((prevVisiveis) => ({
      ...prevVisiveis,
      [questionId]: !prevVisiveis[questionId],
    }));
  };

  return (
    <div className="App">
      <div className="campo-nome-home">
        <h2 className="nome-home">SESO em Concursos</h2>
      </div>
      <div className="logout-button-container">
        {user && (
          <button onClick={signOut} className="logout-button">
            Fazer logout
          </button>
        )}
      </div>

      {user ? (
        <div>
          <FiltroMulti onFilterChange={setQuestoesFiltradas} />

          {questoesPagina.map((question) => (
            <div key={question.id} className="question-container">
              <div className="cabecalho-disciplina">
                <p>
                  ID: {question.ids}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {question.disciplina}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {question.assunto}
                </p>
              </div>
              <div className="cabecalho-orgao">
                <p>
                  Banca: {question.banca}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ano: {question.ano}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Cargo: {question.cargo}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </p>
                <p>Órgão: {question.concurso}</p>
              </div>
              <p className="enunciado">{question.enunciado}</p>
              <ul>
                {question.alternativas.map((alternativa, index) => {
                  const letraAlternativa = alternativa.match(/^\(([A-E])\)/)[1];

                  return (
                    <li
                      className={`alternativa ${
                        alternativasSelecionadas[question.id] === index
                          ? "selecionada"
                          : ""
                      }`}
                      key={index}
                      onClick={() => handleAlternativaClick(question.id, index)}
                    >
                      <span
                        className={`letra-alternativa-circle ${
                          alternativasSelecionadas[question.id] === index
                            ? "selecionada"
                            : ""
                        }`}
                      >
                        {letraAlternativa}
                      </span>
                      {alternativa.replace(/^\(([A-E])\)/, "")}
                    </li>
                  );
                })}
              </ul>
              <div className="button-feedback-container">
                <button
                  className="button-responder"
                  onClick={() => verificarResposta(question)}
                >
                  Responder
                </button>

                {feedback[question.id] && (
                  <p
                    className={`feedback ${
                      feedback[question.id] === "Você acertou!"
                        ? "acerto"
                        : "erro"
                    }`}
                  >
                    {feedback[question.id] === "Você acertou!"
                      ? "Você acertou!"
                      : `Você errou! A alternativa correta é: ${question.resposta}`}
                  </p>
                )}
              </div>

              <div className="linha-horizontal-comentario"></div>

              <div className="campo-comentario">
                <button
                  className="button-comentario"
                  onClick={() => toggleComentario(question.id)}
                >
                  {" "}
                  <ChatCenteredText size={14} /> Comentário do Professor
                </button>

                <p
                  className={
                    comentariosVisiveis[question.id]
                      ? "comentario visivel"
                      : "comentario"
                  }
                >
                  {question.comentario}
                </p>
              </div>
            </div>
          ))}

          <div className="pagination">
            <button onClick={handlePreviousPage} disabled={paginaAtual === 1}>
              Página Anterior
            </button>
            <span>
              Página {paginaAtual} de {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={paginaAtual === totalPages}
            >
              Próxima Página
            </button>
          </div>
        </div>
      ) : (
        <div className="login">
          <p>Faça login para acessar a pagina</p>
        <button onClick={signInWithGoogle} className="login-button">
          Fazer login com o Google
        </button>
        </div>
      )}
    </div>
  );
}

export default App;
