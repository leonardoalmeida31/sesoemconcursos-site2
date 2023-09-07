import React, { useState, useEffect } from "react";
import FiltroMulti from "./FiltroMulti";
import { CaretRight, ChatCenteredText } from "@phosphor-icons/react";
import "./App.css";
import Chart from "react-google-charts";
import DesempenhoNaDisciplina from "./DesempenhoNaDisciplina.jsx";

import { initializeApp } from "firebase/app";
import {
  getDocs,
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import StripeCheckout from "react-stripe-checkout";

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

  const questoesPorPagina = 15;
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

  const [questionsToShow, setQuestionsToShow] = useState([]);
  const [maxQuestionsToDisplay, setMaxQuestionsToDisplay] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [currentDate, setCurrentDate] = useState(
    new Date().toLocaleDateString()
  );

  
  const signInWithGoogle = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();

      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const uid = user.uid;
      const email = user.email;
      const userRef = doc(db, "users", uid);

      // Verifica se o documento do usuário já existe
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        // Se o documento não existir, crie-o com um valor inicial para paymentInfo
        await setDoc(userRef, { email, paymentInfo: null });
      }

      // Resto do código...
    } catch (error) {
      console.error("Erro ao fazer login com o Google:", error);
    }
  };

  const signOut = async () => {
    try {
      const auth = getAuth();
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const [paymentInfo, setPaymentInfo] = useState(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);

        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userPaymentInfo = userData.paymentInfo;

          // Atualize o estado paymentInfo
          setPaymentInfo(userPaymentInfo);

          const paymentInfo = userDoc.data().paymentInfo;
          let maxQuestionsToDisplay = 0;
          let accessDurationDays = 0;

          // Defina maxQuestionsToDisplay com base no número máximo de questões disponíveis
          if (paymentInfo === 0 || paymentInfo === null) {
            maxQuestionsToDisplay = Math.min(15, questoesPagina.length);
            accessDurationDays = 1;
          } else if (paymentInfo === 1) {
            maxQuestionsToDisplay = questoesPagina.length;
            accessDurationDays = 30;
          } else if (paymentInfo === 6500) {
            maxQuestionsToDisplay = questoesPagina.length;
            accessDurationDays = 180;
          } else if (paymentInfo === 12000) {
            maxQuestionsToDisplay = questoesPagina.length;
            accessDurationDays = 365;
          }

          const totalPages = Math.ceil(
            questoesPagina.length / maxQuestionsToDisplay
          );

          setMaxQuestionsToDisplay(maxQuestionsToDisplay);

          const questionsToDisplay = questoesPagina.slice(
            0,
            maxQuestionsToDisplay
          );
          setQuestionsToShow(questionsToDisplay);

          setPaginaAtual(1);

          const currentDate = new Date();
          const expirationDate = new Date(currentDate);

          expirationDate.setDate(currentDate.getDate() + accessDurationDays);

          await setDoc(userRef, { expirationDate }, { merge: true });

          console.log(
            `Acesso concedido por ${accessDurationDays} dias a partir de ${currentDate.toISOString()}`
          );
        } else {
          // Se o documento do usuário não existir, crie-o com paymentInfo ausente
          await setDoc(userRef, { expirationDate: null, paymentInfo: null });

          console.log("Documento do usuário criado.");
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth, maxQuestionsToDisplay]);

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

  const handleRespostaClick = async (question) => {
    if (!user) {
      // O usuário não está autenticado, redirecione para a página de login
      console.log("Usuário não autenticado.");
      // Redirecionar para a página de login ou mostrar uma mensagem
      return;
    }

    // Verifique se a assinatura é igual a zero ou null
    if (paymentInfo === null || paymentInfo === 0) {
      // O usuário não tem uma assinatura

      // Verifique se é um novo dia
      const newDate = new Date().toLocaleDateString();
      if (newDate !== currentDate) {
        // Reinicie a contagem para o novo dia
        setCurrentDate(newDate);
        setAnsweredCount(0);
      }

      // Verifique se o usuário atingiu o limite de 15 respostas hoje
      if (answeredCount >= 15) {
        console.log("Você atingiu o limite de 15 respostas hoje.");
        // Exiba uma mensagem informando que o usuário atingiu o limite
        return;
      }

      // Permita que o usuário responda à questão e atualize a contagem
      verificarResposta(question);
      setAnsweredCount(answeredCount + 1);
    } else {
      // O usuário tem uma assinatura válida, permita que ele responda à questão
      verificarResposta(question);
    }
  };

  const [feedback, setFeedback] = useState({});

  const verificarResposta = async (question) => {
    const questionId = question.id;
    const alternativaSelecionada = alternativasSelecionadas[questionId];
    const respostaCorreta = question.resposta.charCodeAt(0) - 65;
  
    // Verificar se a disciplina já está no estado de desempenho
    const disciplina = question.disciplina;
    const desempenhoDisciplina = desempenho[disciplina] || {
      acertos: 0,
      erros: 0,
    };
  
    if (alternativaSelecionada === respostaCorreta) {
      // Atualizar o estado de desempenho para acerto
      setFeedback((prevFeedback) => ({
        ...prevFeedback,
        [questionId]: "Você acertou!",
      }));
  
      setDesempenho((prevDesempenho) => ({
        ...prevDesempenho,
        [disciplina]: {
          acertos: desempenhoDisciplina.acertos + 1,
          erros: desempenhoDisciplina.erros,
        },
      }));
    } else {
      // Atualizar o estado de desempenho para erro
      setFeedback((prevFeedback) => ({
        ...prevFeedback,
        [questionId]: "Você errou!",
      }));
  
      setDesempenho((prevDesempenho) => ({
        ...prevDesempenho,
        [disciplina]: {
          acertos: desempenhoDisciplina.acertos,
          erros: desempenhoDisciplina.erros + 1,
        },
      }));
    }
  
    // Agora, vamos salvar o desempenho atualizado no Firebase Firestore
    try {
      const auth = getAuth();
      const user = auth.currentUser;
  
      if (!user) {
        console.error("Usuário não autenticado.");
        return;
      }
  
      const userId = user.uid;
      const userRef = doc(db, "users", userId);
  
      // Crie um objeto que represente o novo desempenho do usuário
      const novoDesempenho = {
        ...desempenho,
      };
  
      // Atualize o documento do usuário com o novo desempenho
      await updateDoc(userRef, {
        desempenho: novoDesempenho,
      });
  
      console.log(`Desempenho atualizado para ${disciplina}`);
    } catch (error) {
      console.error("Erro ao atualizar desempenho:", error);
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

  const onToken = async (token, amount) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error("Usuário não autenticado.");
        return;
      }

      // Crie um objeto com informações de pagamento e outros detalhes relevantes
      const paymentInfo = {
        token: token.id,
        amount: amount,
        currency: "BRL",
        // Adicione mais campos conforme necessário
      };

      const userRef = doc(db, "users", user.uid);

      // Atualize as informações de pagamento no documento do usuário
      await updateDoc(userRef, { paymentInfo });

      // Chame a função para atualizar as informações de acesso (substitua 'amount' pelo valor correto)
      await atualizarInformacoesDeAcesso(amount);

      // Recarregue a página após o pagamento para obter as novas questões
      window.location.reload();

      alert("Pagamento realizado com sucesso.");
    } catch (error) {
      console.error("Erro ao adicionar informações de pagamento:", error);
    }
  };

  const atualizarInformacoesDeAcesso = async (paymentInfo) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error("Usuário não autenticado.");
        return;
      }

      const userRef = doc(db, "users", user.uid);

      // Defina a data de expiração com base no tipo de assinatura
      const currentDate = new Date();
      let expirationDate = new Date(currentDate);
      let accessDurationDays = 0;

      if (paymentInfo === 1) {
        accessDurationDays = 30;
      } else if (paymentInfo === 6500) {
        accessDurationDays = 180;
      } else if (paymentInfo === 12000) {
        accessDurationDays = 365;
      }

      expirationDate.setDate(currentDate.getDate() + accessDurationDays);

      // Atualize o documento do usuário com as informações de pagamento e expiração
      await updateDoc(userRef, { paymentInfo, expirationDate });

      console.log(
        `Acesso concedido por ${accessDurationDays} dias a partir de ${currentDate.toISOString()}`
      );
    } catch (error) {
      console.error("Erro ao atualizar informações de acesso:", error);
    }
  };

  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const modalStyle = {
    display: modalOpen ? "flex" : "none",
  };

  const [desempenho, setDesempenho] = useState({}); // Inicialize o estado do desempenho com um objeto vazio

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);

        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();

          // Recupere o desempenho do usuário do documento e atualize o estado
          const userDesempenho = userData.desempenho || {};
          setDesempenho(userDesempenho);

          // Resto do código...
        } else {
          // Se o documento do usuário não existir, crie-o com um desempenho vazio
          await setDoc(userRef, {
            expirationDate: null,
            paymentInfo: null,
            desempenho: {},
          });

          console.log("Documento do usuário criado.");
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const [mostrarEstatisticas, setMostrarEstatisticas] = useState(false);
  const toggleEstatisticas = () => {
    setMostrarEstatisticas(!mostrarEstatisticas);
  };

<FiltroMulti onFilterChange={setQuestoesFiltradas} db={db} />

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
        <div>
          <button className="open-button" onClick={openModal}>
            Realizar Assinatura
          </button>

          {modalOpen && (
            <div className="modal" style={modalStyle}>
              <div className="modal-content">
                <h2>Opções de Assinatura</h2>
                <p>Todas as assisnaturas são efetuados com cartão</p>

                <div>
                  <p>
                    Assinatura Mensal: 17,99 <br></br>
                    <span>Acesso por 30 dias!</span>
                  </p>

                  <StripeCheckout
                    token={(token) => onToken(token, 1)} // Função chamada após a conclusão bem-sucedida do pagamento
                    stripeKey={import.meta.env.VITE_REACT_APP_STRIPE_PUBLIC_KEY} // Substitua pelo sua chave pública do Stripe
                    name="Seso em Concursos"
                    description="Questões para estudos"
                    amount={1} // Substitua pelo valor correto em centavos
                    currency="BRL" // Substitua pela moeda desejada (BRL para Real Brasileiro)
                    label="Pagar com Cartão" // Texto exibido no botão
                    billingAddress={true} // Habilitar informações de endereço
                    shippingAddress={true} // Habilitar informações de envio
                    zipCode={true} // Habilitar campo de CEP
                  >
                    <button className="button-pagamento">
                      Realizar Assinatura com cartão
                    </button>
                  </StripeCheckout>
                </div>
                <div className="open">
                  <p>
                    Assinatura SEMESTREAL: 65,00 <br></br>
                    <span>Acesso por 180 dias!</span>
                  </p>
                  <StripeCheckout
                    token={(token) => onToken(token, 6500)} // Função chamada após a conclusão bem-sucedida do pagamento
                    stripeKey={import.meta.env.VITE_REACT_APP_STRIPE_PUBLIC_KEY} // Substitua pelo sua chave pública do Stripe
                    name="Seso em Concursos"
                    description="Questões para estudos"
                    amount={6500} // Substitua pelo valor correto em centavos
                    currency="BRL" // Substitua pela moeda desejada (BRL para Real Brasileiro)
                    label="Pagar com Cartão" // Texto exibido no botão
                    billingAddress={true} // Habilitar informações de endereço
                    shippingAddress={true} // Habilitar informações de envio
                    zipCode={true} // Habilitar campo de CEP
                  >
                    <button className="button-pagamento">
                      Realizar Assinatura com cartão
                    </button>
                  </StripeCheckout>
                </div>
                <div className="open">
                  <p>
                    Assinatura Anual: 120,00 <br></br>
                    <span>Acesso por 365 dias!</span>
                  </p>
                  <StripeCheckout
                    token={(token) => onToken(token, 12000)} // Função chamada após a conclusão bem-sucedida do pagamento
                    stripeKey={import.meta.env.VITE_REACT_APP_STRIPE_PUBLIC_KEY} // Substitua pelo sua chave pública do Stripe
                    name="Seso em Concursos"
                    description="Questões para estudos"
                    amount={12000} // Substitua pelo valor correto em centavos
                    currency="BRL" // Substitua pela moeda desejada (BRL para Real Brasileiro)
                    label="Pagar com Cartão" // Texto exibido no botão
                    billingAddress={true} // Habilitar informações de endereço
                    shippingAddress={true} // Habilitar informações de envio
                    zipCode={true} // Habilitar campo de CEP
                  >
                    <button className="button-pagamento">
                      Realizar Assinatura com cartão
                    </button>
                  </StripeCheckout>
                </div>
                <button className="open-button" onClick={closeModal}>
                  Fechar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {user ? (
        <div>
<<<<<<< HEAD
         
=======
          <FiltroMulti onFilterChange={setQuestoesFiltradas} />
          {questoesPagina.map((question) => (
            <div key={question.id} className="question-container">
              <div className="cabecalho-disciplina">
                <p>
                  ID: {question.ids}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {question.disciplina}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {question.assunto}
                </p>
              </div>
              <div className="cabecalho-orgao">
                <p>
                  Banca: {question.banca}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ano: {question.ano}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Cargo: {question.cargo}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Órgão: {question.concurso}
                </p>
                
              </div>
              <p className="enunciado">{question.enunciado}</p>
              <ul>
                {question.alternativas.map((alternativa, index) => {
                  const letraAlternativa = alternativa.match(/^\(([A-E])\)/)[1];
>>>>>>> 0b2acd2e39511386ba5935d64a20d523933222a6

          <FiltroMulti onFilterChange={setQuestoesFiltradas} db={db} />

          {questoesPagina.map((question)  => (
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
                    const letraAlternativa =
                      alternativa.match(/^\(([A-E])\)/)[1];

                    return (
                      <li
                        className={`alternativa ${
                          alternativasSelecionadas[question.id] === index
                            ? "selecionada"
                            : ""
                        }`}
                        key={index}
                        onClick={() =>
                          handleAlternativaClick(question.id, index)
                        }
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
                    onClick={() => handleRespostaClick(question)}
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

                <div className="campo-pai">
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

                  <div className="campo-estatistica">
                    <button
                      className="button-estatisticas"
                      onClick={toggleEstatisticas}
                    >
                      Seu Desempenho
                    </button>

                    {mostrarEstatisticas && (
                      <div className="desempenho-container">
                        {Object.keys(desempenho).map((disciplina) => (
                          <DesempenhoNaDisciplina
                            key={disciplina}
                            disciplina={disciplina}
                            acertos={desempenho[disciplina].acertos}
                            erros={desempenho[disciplina].erros}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

<<<<<<< HEAD
=======
              <div className="linha-horizontal-comentario"></div>
              
              <div className="campo-pai">
              <div className="campo-comentario">
              
              <div >
           
            <button
              className="button-comentario"
              onClick={() => toggleComentario(question.id)}
            >
              <ChatCenteredText size={14} /> Comentário do Professor
            </button>

            <button className="button-estatisticas" onClick={toggleEstatisticas}>
              Seu Desempenho
            </button>
          </div>  
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
              
              <div className="campo-estatistica">
                        

          {mostrarEstatisticas && (
          <div className="desempenho-container">
         
          {Object.keys(desempenho).map((disciplina) => (
          <DesempenhoNaDisciplina
          key={disciplina}
          disciplina={disciplina}
          acertos={desempenho[disciplina].acertos}
          erros={desempenho[disciplina].erros}
          />
          ))}
          </div>
            )}
            </div>
            </div>
            </div>

          ))}
          
>>>>>>> 0b2acd2e39511386ba5935d64a20d523933222a6


          <div className="pagination">
            <button onClick={handlePreviousPage} disabled={paginaAtual === 1}>
              Página Anterior
            </button>
            <span>
              Página {paginaAtual} de {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              // disabled={paginaAtual >= totalPages || paymentInfo === 0 || paymentInfo === null}
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
