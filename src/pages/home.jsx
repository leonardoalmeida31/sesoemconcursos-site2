import React, { useState, useEffect } from "react";
import FiltroMulti from "../FiltroMulti.jsx";
import { CaretRight, ChatCenteredText, ChartPie } from "@phosphor-icons/react";
import "../App.css";
import Chart from "react-google-charts";
import PieChart from "../PieChart.jsx";
import imagemSvg from "../img/img-login-1.svg";
import { Link } from "react-router-dom";
import MenuMui from "../MenuMui.jsx";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { IoMdCut } from "react-icons/io";
import { loadStripe } from "@stripe/stripe-js";
import AutoGraphOutlinedIcon from "@mui/icons-material/AutoGraphOutlined";
import Container from "@mui/material/Container";
import { Modal, Button, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import IconButton from '@mui/material/IconButton';
import Depoimentos from './Depoimentos.jsx';
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


const firebaseConfig = {
  apiKey: import.meta.env.VITE_REACT_APP_API_KEY,
  authDomain: import.meta.env.VITE_REACT_APP_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_REACT_APP_PROJECT_ID,
};

function Home() {
  const firebaseApp = initializeApp(firebaseConfig);
  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);
  const questionsCollectionRef = collection(db, "questions");
  const [user, setUser] = useState(null);
  const questoesPorPagina = 1;
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
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const stripePublicKey = import.meta.env.VITE_REACT_APP_STRIPE_PUBLIC_KEY;
  const stripePromise = loadStripe(stripePublicKey);

  const signInWithGoogle = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();

      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const uid = user.uid;
      const email = user.email;
      const displayName = user.displayName; // Obtenha o nome de exibição do usuário
      setDisplayName(displayName); // Atualize o estado displayName com o valor do usuário
      const userRef = doc(db, "users", uid);

      // Verifica se o documento do usuário já existe
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        // Se o documento não existir, crie-o com um valor inicial para paymentInfo
        await setDoc(userRef, {
          email,
          paymentInfo: null,
          desempenhoPorDisciplina: {},
        });
      }

      // Adicione um listener para atualizações do perfil do usuário
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          const updatedUser = auth.currentUser;
          const updatedDisplayName = updatedUser.displayName;

          // Atualize o nome do usuário no documento Firestore
          await updateDoc(userRef, { displayName: updatedDisplayName });
        }
      });

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

  const [displayName, setDisplayName] = useState(null); //guarda pra exibe nome do usuario pra tela
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);

        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userDisplayName = userData.displayName;
          const userPaymentInfo = userData.paymentInfo;
          const expirationDate = userData.expirationDate;

          // Recupere as informações de desempenho do documento do usuário
          const desempenhoSalvo = userData.desempenhoPorDisciplina;

          // Atualize o estado desempenhoPorDisciplina com as informações recuperadas
          setDesempenhoPorDisciplina(desempenhoSalvo);

          // Recupere as informações de desempenho total do documento do usuário
          const desempenhoTotalSalvo = userData.desempenhoTotal || {
            acertos: 0,
            erros: 0,
          };

          // Atualize o estado desempenhoTotal com as informações recuperadas
          setDesempenhoTotal(desempenhoTotalSalvo);

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

          // Verifique se expirationDate existe antes de atualizar o banco de dados
          if (!expirationDate) {
            const currentDate = new Date();
            const expirationDate = new Date(currentDate);
            expirationDate.setDate(currentDate.getDate() + accessDurationDays);

            // Atualize o banco de dados apenas se expirationDate não existir
            await setDoc(userRef, { expirationDate }, { merge: true });

            console.log(
              `Acesso concedido por ${accessDurationDays} dias a partir de ${currentDate.toISOString()}`
            );
          }
        } else {
          // Se o documento do usuário não existir, crie-o com paymentInfo ausente
          await setDoc(userRef, {
            expirationDate: null,
            paymentInfo: null,
            desempenhoTotal: {
              acertos: 0,
              erros: 0,
            },
            desempenhoPorDisciplina: {}, // Defina um objeto vazio como valor padrão
            cliques: 0,
          });

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

  const [alternativaSelecionada, setAlternativaSelecionada] = useState({});

  //  as respostas corretas ou incorretas são armazenadas aqui embaixo agora
  const [resultados, setResultados] = useState({});

  const handleAlternativaClick = (questionId, alternativaIndex) => {
    const newAlternativaSelecionada = {
      [questionId]: alternativaIndex,
    };
    setAlternativaSelecionada(newAlternativaSelecionada);
  };

  const [respostaCorreta, setRespostaCorreta] = useState(null);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [desempenhoPorDisciplina, setDesempenhoPorDisciplina] = useState({});

  const [desempenhoTotal, setDesempenhoTotal] = useState({
    acertos: 0,
    erros: 0,
  });

  const [cliques, setCliques] = useState(null);
  const handleRespostaClick = async (question) => {
    // Verifique se a resposta do usuário está correta
    const respostaUsuario = alternativaSelecionada[question.ids];
    const respostaCorreta = question.resposta.charCodeAt(0) - 65;
    const questaoId = question.ids;

    const resultadoQuestao = respostaUsuario === respostaCorreta;

    // Atualize o estado dos resultados com o resultado da questão
    setResultados((prevResultados) => ({
      ...prevResultados,
      [questaoId]: resultadoQuestao,
    }));

    if (respostaUsuario === respostaCorreta) {
      setRespostaCorreta(true); // A resposta do usuário está correta
      setAcertos(acertos + 1); // Incrementa o número de acertos
      setDesempenhoTotal((prevDesempenhoTotal) => ({
        ...prevDesempenhoTotal,
        acertos: prevDesempenhoTotal.acertos + 1,
      }));
      setDesempenhoPorDisciplina((prevDesempenho) => {
        const disciplina = question.disciplina;
        return {
          ...prevDesempenho,
          [disciplina]: {
            acertos: (prevDesempenho[disciplina]?.acertos || 0) + 1,
            erros: prevDesempenho[disciplina]?.erros || 0,
          },
        };
      });
    } else {
      setRespostaCorreta(false); // A resposta do usuário está incorreta
      setErros(erros + 1); // Incrementa o número de erros
      setDesempenhoTotal((prevDesempenhoTotal) => ({
        ...prevDesempenhoTotal,
        erros: prevDesempenhoTotal.erros + 1,
      }));

      setDesempenhoPorDisciplina((prevDesempenho) => {
        const disciplina = question.disciplina;
        return {
          ...prevDesempenho,
          [disciplina]: {
            acertos: prevDesempenho[disciplina]?.acertos || 0,
            erros: (prevDesempenho[disciplina]?.erros || 0) + 1,
          },
        };
      });
    }
    // Salvar as informações de desempenho no Firebase
    if (user) {
      const userRef = doc(db, "users", user.uid);

      // Obtenha o documento do usuário
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const expirationDate = userData.expirationDate;
        const cliquesDoUsuario = userData.cliques || 0;

        // Recupere as informações de desempenho do documento do usuário
        const desempenhoSalvo = userData.desempenhoPorDisciplina;

        // Atualize as informações de desempenho no documento do usuário
        await setDoc(userRef, { desempenhoPorDisciplina }, { merge: true });
        await updateDoc(userRef, { desempenhoTotal });

        if (!user) {
          // O usuário não está autenticado, redirecione para a página de login ou mostre uma mensagem
          console.log("Usuário não autenticado.");
          return;
        }

        // Verificar se a assinatura é igual a zero ou nula
        if (paymentInfo === null || paymentInfo === 0 || cliques < 15) {
          // Sua lógica de processamento da resposta aqui
          verificarResposta(question);

          // Atualize os cliques no Firebase Firestore
          const newCliques = cliques + 1;
          await updateDoc(userRef, { cliques: newCliques });

          // Atualize o estado local com os cliques atualizados
          setCliques(newCliques);
        } else {
          verificarResposta(question);
        }
      }
    }
  };

  const inicializarCliques = async () => {
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const cliquesDoUsuario = userData.cliques || 0;

      // Atualize o estado local com os cliques armazenados no Firebase Firestore
      setCliques(cliquesDoUsuario);
    }
  };

  // Chame a função de inicialização dos cliques ao fazer login
  useEffect(() => {
    if (user) {
      inicializarCliques();

      // Crie um intervalo para reiniciar os cliques a
      const resetCliquesInterval = setInterval(() => {
        const userRef = doc(db, "users", user.uid);

        // Defina o valor de "cliques" como 0
        updateDoc(userRef, { cliques: 0 })
          .then(() => {
            console.log("Campo 'cliques' reiniciado para 0.");
          })
          .catch((error) => {
            console.error("Erro ao reiniciar o campo 'cliques':", error);
          });
      }, 12 * 60 * 60 * 1000); // tempo

      // Retorne uma função de limpeza para cancelar o intervalo quando o componente for desmontado
      return () => clearInterval(resetCliquesInterval);
    }
  }, [user]);

  const verificarResposta = async (question) => {
    const questionId = question.ids;

    const respostaCorreta = question.resposta.charCodeAt(0) - 65;

    // Verificar se a disciplina já está no estado de desempenho
    const disciplina = question.disciplina;

    if (alternativaSelecionada === respostaCorreta) {
    } else {
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



  const handleCheckout = async ({ }) => {
    const stripe = await stripePromise;

    try {
      const { error } = await stripe.redirectToCheckout({
        lineItems: [
          {
            price: "price_1NlMlMB3raGqSSUV72kSZ4FU",
            quantity: 1,
          },
        ],
        mode: "subscription",
        successUrl: `https://sesoemconcursos.com.br/success?amount=1&token=${generateUniqueToken()}`,
      });

      if (error) {
        console.error("Erro ao redirecionar para o checkout:", error);
      }
    } catch (err) {
      console.error("Erro ao iniciar o checkout:", err);
    }
  };

  const handleCheckoutS = async ({ }) => {
    const stripe = await stripePromise;

    try {
      const { error } = await stripe.redirectToCheckout({
        lineItems: [
          {

            price: "price_1NlMrNB3raGqSSUVTfAfLQOF",
            quantity: 1,
          },
        ],
        mode: "subscription",
        successUrl: `https://sesoemconcursos.com.br/success?amount=6500&token=${generateUniqueToken()}`,
      });

      if (error) {
        console.error("Erro ao redirecionar para o checkout:", error);
      }
    } catch (err) {
      console.error("Erro ao iniciar o checkout:", err);
    }
  };
  const handleCheckoutA = async ({ }) => {
    const stripe = await stripePromise;

    try {
      const { error } = await stripe.redirectToCheckout({
        lineItems: [
          {

            price: "price_1NlMulB3raGqSSUVr41T8yfL",
            quantity: 1,
          },
        ],
        mode: "subscription",
        successUrl: `https://sesoemconcursos.com.br/success?amount=12000&token=${generateUniqueToken()}`,
      });

      if (error) {
        console.error("Erro ao redirecionar para o checkout:", error);
      }
    } catch (err) {
      console.error("Erro ao iniciar o checkout:", err);
    }
  };

  // Função para gerar um token único
  const generateUniqueToken = () => {
    // Gere um timestamp aleatório (pode usar outra lógica se preferir)
    const timestamp = Date.now();

    // Converta o timestamp em uma string hexadecimal
    const uniqueToken = timestamp.toString(16);

    return uniqueToken;
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
    justifyContent: "center", // Centraliza horizontalmente
    alignItems: "center", // Centraliza verticalmente
    // Outros estilos personalizados para o modal, se necessário
  };

  <FiltroMulti onFilterChange={setQuestoesFiltradas} db={db} />;

  const [estatisticasVisiveis, setEstatisticasVisiveis] = useState(false);

  const [alternativasRiscadasPorQuestao, setAlternativasRiscadasPorQuestao] =
    useState({});

  const handleRiscarAlternativa = (questionId, index) => {
    setAlternativasRiscadasPorQuestao((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [index]: !prev[questionId]?.[index], // Inverte o valor atual (riscado ou não)
      },
    }));
  };

  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="Home">
      {user && (
        <Container className="div-menu">
          <button className="open-button" onClick={openModal}>
            Assine Agora
          </button>
          <button onClick={signOut} className="logout-button">
            Sair/Entrar
          </button>

        </Container>
      )}

      {user && (
        <div>
          <FiltroMulti onFilterChange={setQuestoesFiltradas} db={db} />
        </div>
      )}
      <Container className="fundo-Home">
        <div className="logout-button-container">
          <Modal
            open={modalOpen}
            onClose={closeModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column'
            }}
          >
            <Box
              className="modal-content"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                padding: '15px',
                borderRadius: '8px',
                textAlign: 'center',
                width: '80%',
                maxWidth: '500px',
                backgroundColor: '#f4f4f4', // Cor de fundo do modal
              }}
            >
              <Typography variant="h5">Conheça Nossos Planos de Assinatura</Typography>

              <TableContainer component={Paper}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Plano Gratuito</TableCell>
                      <TableCell>
                        <ul>
                          <li>Responda até 15 questões por dia</li>
                          <li>Comentários Limitados</li>
                        </ul>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Plano Mensal</TableCell>
                      <TableCell>

                        <ul>
                          <li>Resolução de Questões Ilimitadas</li>
                          <li>Comentários Ilimitados</li>
                        </ul>
                        <Button variant="contained" onClick={handleCheckout}>
                          Assinar Agora
                        </Button>
                      </TableCell>
                      <a href="https://api.whatsapp.com/send?phone=5574981265381&text=Quero%20Asssinar%20por%20Pix" target="_blank" rel="noopener noreferrer">
                        <Button variant="contained">
                          Pix
                        </Button>
                      </a>
                    </TableRow>
                    <TableRow>
                      <TableCell>Plano Semestral</TableCell>
                      <TableCell>

                        <ul>
                          <li>Resolução de Questões Ilimitadas</li>
                          <li>Comentários Ilimitados</li>
                        </ul>
                        <Button variant="contained" onClick={handleCheckoutS}>
                          Assinar Agora
                        </Button>
                      </TableCell>
                      <a href="https://api.whatsapp.com/send?phone=5574981265381&text=Quero%20Asssinar%20por%20Pix" target="_blank" rel="noopener noreferrer">
                        <Button variant="contained">
                          Pix
                        </Button>
                      </a>
                    </TableRow>
                    <TableRow>
                      <TableCell>Plano Anual</TableCell>
                      <TableCell>

                        <ul>
                          <li>Resolução de Questões Ilimitadas</li>
                          <li>Comentários Ilimitados</li>
                        </ul>
                        <Button variant="contained" onClick={handleCheckoutA}>
                          Assinar Agora
                        </Button>
                      </TableCell>
                      <a href="https://api.whatsapp.com/send?phone=5574981265381&text=Quero%20Asssinar%20por%20Pix" target="_blank" rel="noopener noreferrer">
                        <Button variant="contained">
                          Pix
                        </Button>
                      </a>

                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Button variant="contained" color="secondary" onClick={closeModal}>
                Fechar
              </Button>
            </Box>
          </Modal>
        </div>


        {user ? (
          <div>
            <div></div>
            {questoesPagina.map((question) => (
              <div key={question.ids} className="question-container">
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
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </p>
                  <p>Órgão: {question.concurso}</p>
                </div>
                <p className="enunciado">{question.enunciado}</p>
                <ul>
                  {question.alternativas.map((alternativa, index) => {
                    const letraAlternativa =
                      alternativa.match(/^\(([A-E])\)/)[1];
                    const isSelected =
                      alternativaSelecionada[question.ids] === index;
                    const isRiscada =
                      alternativasRiscadasPorQuestao[question.ids]?.[index] ||
                      false;

                    return (
                      <li
                        className={`alternativa ${isSelected ? "selecionada" : ""
                          } ${isRiscada ? "riscado" : ""}`}
                        key={index}
                        onClick={() =>
                          handleAlternativaClick(question.ids, index)
                        }
                      >
                        <Box
                          className={`icon-container ${isRiscada ? "riscado" : ""
                            }`}
                        >
                          <IoMdCut
                            className={`tesoura-icon ${isRiscada ? "riscado" : ""
                              }`}
                            size={14} // Defina o tamanho desejado em pixels
                            color={isRiscada ? "#1c5253" : "black"} // Defina a cor desejada
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRiscarAlternativa(question.ids, index);
                            }}
                          />
                        </Box>

                        <span
                          className={`letra-alternativa-circle ${isSelected ? "selecionada" : ""
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
                    disabled={
                      (paymentInfo === null || paymentInfo === 0) &&
                      cliques >= 15
                    }
                  >
                    Responder
                  </button>

                  {resultados[question.ids] === true && (
                    <p className="resposta-correta">Parabéns! Você acertou!</p>
                  )}
                  {resultados[question.ids] === false && (
                    <p className="resposta-incorreta">
                      Você Errou! Resposta: {question.resposta}
                    </p>
                  )}
                </div>

                <button
                  className="button-comentario"
                  onClick={() => toggleComentario(question.ids)}
                >
                  {" "}
                  Comentário
                </button>

                <Link
                  to="/MeuPerfil"
                  className="button-estatisticas"
                  target="_blank"
                >
                  Meu Desempenho
                </Link>

                <Container className="linha-horizontal-comentario"></Container>

                <Container
                  className="campo-comentario"
                  style={{
                    // Impede que o texto quebre para a próxima linha
                    overflowX: "auto", // Adiciona a rolagem horizontal quando necessário
                  }}
                >
                  <p
                    className={
                      comentariosVisiveis[question.ids]
                        ? "comentario visivel"
                        : "comentario"
                    }
                    style={{
                      // Impede que o texto quebre para a próxima linha
                      overflowX: "auto", // Adiciona a rolagem horizontal quando necessário
                    }}
                  >
                    {question.comentario}
                  </p>
                </Container>

                {estatisticasVisiveis && (
                  <Container className="campo-estatistica">
                    {Object.entries(desempenhoPorDisciplina).map(
                      ([disciplina, { acertos, erros }]) => {
                        const data = [
                          ["Tipo", "Quantidade"],
                          ["Acertos", acertos],
                          ["Erros", erros],
                        ];
                        const options = {
                          is3D: true,
                        };

                        return (
                          <PieChart
                            key={disciplina}
                            title={disciplina}
                            data={data}
                            options={options}
                          />
                        );
                      }
                    )}
                  </Container>
                )}
              </div>


            ))}

            <Box className="pagination">
              <button onClick={handlePreviousPage} disabled={paginaAtual === 1}>
                Questão Anterior
              </button>
              <span>
                {paginaAtual} de {totalPages}
              </span>
              <button
                onClick={handleNextPage}
              // disabled={paginaAtual >= totalPages || paymentInfo === 0 || paymentInfo === null}
              >
                Próxima Questão
              </button>
            </Box>
          </div>
        ) : (
          <Box className="login">
            <p>SESO em Concursos</p>

            <img
              src={imagemSvg}
              alt="Descrição da imagem"
              width="30%"
              height="30%"
            />

            <p>
              Faça login com sua conta do Google para responder questões
              diariamente.
            </p>
            <button onClick={signInWithGoogle} className="login-button">
              Entrar com o Google
            </button>

            <Depoimentos/>
          </Box>
        )}

        {user && (
          <Box className="Rodapé">
            <Box className="Box-Rodapé2">
              <p className="Texto-Rodapé2">Assine para Responder Questões ilimitadas Diariamente.</p>
            </Box>
            <Box className="Box-Rodapé">
              <p className="Texto-Rodapé">
                <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>SESOEMCONCURSOS.COM.BR
                </Link></p>

              <p className="Texto-Rodapé">
                <Link to="https://api.whatsapp.com/send?phone=5574981265381" target="_blank" style={{ textDecoration: 'none', color: 'white' }}>Atendimento ao Cliente
                </Link></p>
              <p className="Texto-Rodapé">Preços</p>
              <p className="Texto-Rodapé">Quem Somos</p>
            </Box>

            <Box className="Box-Rodapé">
              <p className="Texto-Rodapé">
                <Link to="/MeuPerfil" target="_blank" style={{ textDecoration: 'none', color: 'white' }}>
                  Meu Desempenho
                </Link>
              </p>
              <p className="Texto-Rodapé">
              <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
                Questões</Link></p>

              <p className="Texto-Rodapé">
              <Link to="/RankingDesempenho" target="_blank" style={{ textDecoration: 'none', color: 'white' }}>
                Ranking de Desempenho</Link></p>
              <p className="Texto-Rodapé">Como usar o SESO em Concursos</p>
            </Box>

            <Box className="Box-Rodapé">
              <p className="Texto-Rodapé">Instagram</p>
              <p className="Texto-Rodapé">Aulas</p>
              <p className="Texto-Rodapé">Planos de Estudos</p>
              <p className="Texto-Rodapé">Como usar o SESO em Concursos</p>
            </Box>

            <Box className="Box-Rodapé1">
              <p className="Texto-Rodapé1">© 2023 - SESO em Concursos</p>
            </Box>
          </Box>
        )}

      </Container>
    </div>
  );
}

export default Home;

// useEffect(() => {
//   const unsubscribe = auth.onAuthStateChanged(async (user) => {
//     if (user) {
//       setUser(user);

//       const userRef = doc(db, "users", user.uid);
//       const userDoc = await getDoc(userRef);

//       if (userDoc.exists()) {
//         const userData = userDoc.data();
//         const userDisplayName = userData.displayName;
//         const userPaymentInfo = userData.paymentInfo;

//         // Recupere as informações de desempenho do documento do usuário
//         const desempenhoSalvo = userData.desempenhoPorDisciplina;

//         // Atualize o estado desempenhoPorDisciplina com as informações recuperadas
//         setDesempenhoPorDisciplina(desempenhoSalvo);

//         // Recupere as informações de desempenho total do documento do usuário
//         const desempenhoTotalSalvo = userData.desempenhoTotal || {
//           acertos: 0,
//           erros: 0,
//         };

//         // Atualize o estado desempenhoTotal com as informações recuperadas
//         setDesempenhoTotal(desempenhoTotalSalvo);

//         // Atualize o estado paymentInfo
//         setPaymentInfo(userPaymentInfo);

//         // Recupere a data de expiração do documento do usuário
//         const expirationDate = userData.expirationDate;

//         // Se expirationDate existir e não for nulo, atualize o estado
//         if (expirationDate) {
//           setCurrentDate(expirationDate.toDate().toLocaleDateString());
//         }

//         const paymentInfo = userDoc.data().paymentInfo;
//         let maxQuestionsToDisplay = 0;
//         let accessDurationDays = 0;

//         // Defina maxQuestionsToDisplay com base no número máximo de questões disponíveis
//         if (paymentInfo === 0 || paymentInfo === null) {
//           maxQuestionsToDisplay = Math.min(15, questoesPagina.length);
//           accessDurationDays = 1;
//         } else if (paymentInfo === 1) {
//           maxQuestionsToDisplay = questoesPagina.length;
//           accessDurationDays = 30;
//         } else if (paymentInfo === 6500) {
//           maxQuestionsToDisplay = questoesPagina.length;
//           accessDurationDays = 180;
//         } else if (paymentInfo === 12000) {
//           maxQuestionsToDisplay = questoesPagina.length;
//           accessDurationDays = 365;
//         }

//         const totalPages = Math.ceil(
//           questoesPagina.length / maxQuestionsToDisplay
//         );

//         setMaxQuestionsToDisplay(maxQuestionsToDisplay);

//         const questionsToDisplay = questoesPagina.slice(
//           0,
//           maxQuestionsToDisplay
//         );
//         setQuestionsToShow(questionsToDisplay);

//         setPaginaAtual(1);

//         // const currentDate = new Date();

//         // expirationDate.setDate(currentDate.getDate() + accessDurationDays);

//         // await setDoc(userRef, { expirationDate }, { merge: true });

//         // console.log(
//         //   `Acesso concedido por ${accessDurationDays} dias a partir de ${currentDate.toISOString()}`
//         // );
//       } else {
//         // Se o documento do usuário não existir, crie-o com paymentInfo ausente
//         await setDoc(userRef, {
//           expirationDate: null,
//           paymentInfo: null,
//           desempenhoTotal: {
//             acertos: 0,
//             erros: 0,
//           },
//         });

//         console.log("Documento do usuário criado.");
//       }
//     } else {
//       setUser(null);
//     }
//   });

//   return () => unsubscribe();
// }, [auth, maxQuestionsToDisplay]);


