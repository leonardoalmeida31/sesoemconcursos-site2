import React, { useState, useEffect } from "react";
import FiltroMulti from "../FiltroMulti.jsx";
import { CaretRight, ChatCenteredText, ChartPie } from "@phosphor-icons/react";
import "./MeuPerfil.css";
import Chart from "react-google-charts";
import PieChart from "../PieChart.jsx";
import imagemSvg from '../img/img-login-1.svg';
import { Link } from 'react-router-dom';
import MenuMui from '../MenuMui.jsx';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';


import AutoGraphOutlinedIcon from '@mui/icons-material/AutoGraphOutlined';
import Container from '@mui/material/Container';
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



function MeuPerfil() {
  const firebaseApp = initializeApp(firebaseConfig);
  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);
  const questionsCollectionRef = collection(db, "users");
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


  // const signInWithGoogle = async () => {
  //   try {
  //     const auth = getAuth();
  //     const provider = new GoogleAuthProvider();

  //     const userCredential = await signInWithPopup(auth, provider);
  //     const user = userCredential.user;

  //     const uid = user.uid;
  //     const email = user.email;
  //     const displayName = user.displayName; // Obtenha o nome de exibição do usuário
  //     const userRef = doc(db, "users", uid);

  //     // Verifica se o documento do usuário já existe
  //     const userDoc = await getDoc(userRef);

  //     if (!userDoc.exists()) {
  //       // Se o documento não existir, crie-o com um valor inicial para paymentInfo
  //       await setDoc(userRef, { email, paymentInfo: null });
  //     }

  //     // Adicione um listener para atualizações do perfil do usuário
  //     auth.onAuthStateChanged(async (user) => {
  //       if (user) {
  //         const updatedUser = auth.currentUser;
  //         const updatedDisplayName = updatedUser.displayName;

  //         // Atualize o nome do usuário no documento Firestore
  //         await updateDoc(userRef, { displayName: updatedDisplayName });
  //       }
  //     });
  //     // Resto do código...
  //   } catch (error) {
  //     console.error("Erro ao fazer login com o Google:", error);
  //   }
  // };

  // const signOut = async () => {
  //   try {
  //     const auth = getAuth();
  //     await auth.signOut();
  //     setUser(null);
  //   } catch (error) {
  //     console.error("Erro ao fazer logout:", error);
  //   }
  // };

  const [desempenhoTotal, setDesempenhoTotal] = useState(null);

  const fetchDesempenhoTotal = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const desempenhoTotal = userData.desempenhoTotal;
        return desempenhoTotal;
      } else {
        return null; // Retorne null se o documento do usuário não existir
      }
    } catch (error) {
      console.error("Erro ao buscar desempenhoTotal:", error);
      return null;
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const userId = user.uid;
        const desempenhoTotal = await fetchDesempenhoTotal(userId);
        if (desempenhoTotal !== null) {
          setDesempenhoTotal(desempenhoTotal);
        }
      }
    };

    fetchData();
  }, [user]);


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

          setDisplayName(userDisplayName); // Atualize o estado com o nome do usuário

          // Obtenha o email do usuário diretamente do documento do usuário
          const userEmail = userData.email;

          setEmail(userEmail); // Atualize o estado do email
        } else {
          setUser(null);
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



  // const handleAlternativaClick = (questionId, alternativaIndex) => {
  //   const newAlternativaSelecionada = {
  //     [questionId]: alternativaIndex,
  //   };
  //   setAlternativaSelecionada(newAlternativaSelecionada);
  // };


  //criação de novo filtro de estatiscas por disciplina
  const [respostaCorreta, setRespostaCorreta] = useState(null);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [desempenhoPorDisciplina, setDesempenhoPorDisciplina] = useState({});


  // const handleRespostaClick = async (question) => {


  //   // Verifique se a resposta do usuário está correta
  //   const respostaUsuario = alternativaSelecionada[question.ids];
  //   const respostaCorreta = question.resposta.charCodeAt(0) - 65;
  //   const questaoId = question.ids;

  //   const resultadoQuestao = respostaUsuario === respostaCorreta;

  //   // Atualize o estado dos resultados com o resultado da questão
  //   setResultados((prevResultados) => ({
  //     ...prevResultados,
  //     [questaoId]: resultadoQuestao,
  //   }));

  //   if (respostaUsuario === respostaCorreta) {
  //     setRespostaCorreta(true); // A resposta do usuário está correta
  //     setAcertos(acertos + 1); // Incrementa o número de acertos
  //     setDesempenhoPorDisciplina((prevDesempenho) => {

  //       const disciplina = question.disciplina;
  //       return {
  //         ...prevDesempenho,
  //         [disciplina]: {
  //           acertos: (prevDesempenho[disciplina]?.acertos || 0) + 1,
  //           erros: prevDesempenho[disciplina]?.erros || 0,
  //         },
  //       };
  //     });
  //   } else {
  //     setRespostaCorreta(false); // A resposta do usuário está incorreta
  //     setErros(erros + 1); // Incrementa o número de erros
  //     setDesempenhoPorDisciplina((prevDesempenho) => {
  //       const disciplina = question.disciplina;
  //       return {
  //         ...prevDesempenho,
  //         [disciplina]: {
  //           acertos: prevDesempenho[disciplina]?.acertos || 0,
  //           erros: (prevDesempenho[disciplina]?.erros || 0) + 1,
  //         },
  //       };
  //     });
  //   }
  //   // Salvar as informações de desempenho no Firebase
  //   if (user) {
  //     const userRef = doc(db, "users", user.uid);

  //     // Obtenha o documento do usuário
  //     const userDoc = await getDoc(userRef);

  //     if (userDoc.exists()) {
  //       const userData = userDoc.data();

  //       // Recupere as informações de desempenho do documento do usuário
  //       const desempenhoSalvo = userData.desempenhoPorDisciplina;

  //       // Atualize as informações de desempenho no documento do usuário
  //       await setDoc(userRef, { desempenhoPorDisciplina }, { merge: true });
  //     }
  //   }




  //   if (!user) {
  //     // O usuário não está autenticado, redirecione para a página de login
  //     console.log("Usuário não autenticado.");
  //     // Redirecionar para a página de login ou mostrar uma mensagem
  //     return;
  //   }

  //   // Verifique se a assinatura é igual a zero ou null
  //   if (paymentInfo === null || paymentInfo === 0) {
  //     // O usuário não tem uma assinatura

  //     // Verifique se é um novo dia
  //     const newDate = new Date().toLocaleDateString();
  //     if (newDate !== currentDate) {
  //       // Reinicie a contagem para o novo dia
  //       setCurrentDate(newDate);
  //       setAnsweredCount(0);
  //     }

  //     // Verifique se o usuário atingiu o limite de 15 respostas hoje
  //     if (answeredCount >= 15) {
  //       console.log("Você atingiu o limite de 15 respostas hoje.");
  //       // Exiba uma mensagem informando que o usuário atingiu o limite
  //       return;
  //     }

  //     // Permita que o usuário responda à questão e atualize a contagem
  //     verificarResposta(question);
  //     setAnsweredCount(answeredCount + 1);
  //   } else {
  //     // O usuário tem uma assinatura válida, permita que ele responda à questão
  //     verificarResposta(question);
  //   }
  // };



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


  const [estatisticasVisiveis, setEstatisticasVisiveis] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Função para buscar o desempenho por disciplina do Firebase
    const fetchDesempenhoPorDisciplina = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const desempenho = userData.desempenhoPorDisciplina || {};
          setDesempenhoPorDisciplina(desempenho);
        }
      }
    };

    // Chame a função para buscar o desempenho por disciplina
    fetchDesempenhoPorDisciplina();
  }, [user, db]);


  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState("");

  useEffect(() => {
    if (desempenhoPorDisciplina) {
      const disciplinas = Object.keys(desempenhoPorDisciplina);
      if (disciplinas.length > 0) {
        setDisciplinaSelecionada(disciplinas[0]); // Defina a primeira disciplina como selecionada por padrão
      }
    }
  }, [desempenhoPorDisciplina]);


  const disciplinaSelecionadaData =
    disciplinaSelecionada && desempenhoPorDisciplina[disciplinaSelecionada];

  // Calcular o número total de questões respondidas
  const totalQuestoesRespondidas =
    (desempenhoTotal?.acertos || 0) + (desempenhoTotal?.erros || 0);


  return (

    <Container className="ContainerTotal">

      <Box className="box-user"> <p className="nome-user2">Olá, {displayName}</p> </Box>

      <p className="p-desempenho-geral">CONFIRA SEU DESEMPENHO GERAL</p>
      <Box className="box-grafico-geral">
        <div style={{ borderRadius: '10px', overflow: 'hidden' }}>
          <Chart
            width={'100%'}
            height={'300px'} // Defina a altura desejada para o gráfico
            chartType="PieChart"
            loader={<div>Carregando gráfico...</div>}
            data={[
              ['Desempenho', 'Quantidade'],
              ['Acertos', desempenhoTotal?.acertos || 0],
              ['Erros', desempenhoTotal?.erros || 0],
            ]}
            options={{
              title: 'Desempenho Geral',
              titleTextStyle: {
                fontSize: 12,
                bold: true,
                alignment: 'center',
              },
              colors: ['#1c5253', '#B22222'],
              backgroundColor: 'white',
              pieHole: 0.4, // Defina o tamanho do buraco no gráfico (valores de 0 a 1)
            }}
          />
        </div>
        {/* Legenda personalizada */}
        <div style={{ textAlign: 'center' }}>
          <p className="acertos">{totalQuestoesRespondidas} Questões Resolvidas</p>
        </div>
      </Box>





      <Box className="Box-select">
        <p className="disciplinaSelecionada"> Filtre seu Desempenho por Disciplina:</p>
        <Select className="Select-Desempenho"
          value={disciplinaSelecionada}
          onChange={(e) => setDisciplinaSelecionada(e.target.value)}
        >
          <MenuItem value={null}>Selecione uma disciplina</MenuItem>
          {Object.keys(desempenhoPorDisciplina).map((disciplina) => (
            <MenuItem key={disciplina} value={disciplina}>
              {disciplina}
            </MenuItem>
          ))}
        </Select>
      </Box>



      {disciplinaSelecionadaData ? (
        <Container className="disciplina-grafico">






          <div style={{ borderRadius: '10px', overflow: 'hidden' }}>
            <Chart
              width={'100%'}
              height={'100%'}
              chartType="BarChart"
              loader={<Container>Carregando gráfico...</Container>}
              data={[
                ['Desempenho', 'Quantidade', { role: 'style' }],
                ['Acertos', disciplinaSelecionadaData.acertos || 0, '#1c5253'],
                ['Erros', disciplinaSelecionadaData.erros || 0, '#B22222'],
              ]}
              options={{
                title: `Desempenho em ${disciplinaSelecionada}`,
                titleTextStyle: {
                  fontSize: 12,
                  bold: true,
                  alignment: 'center',
                },
                backgroundColor: 'white',
                bars: 'horizontal',
                bar: { groupWidth: '30%' }, // Ajuste a largura das barras aqui (por exemplo, 50%)
              }}
            />
          </div>

          <ul>
            <li className="acertos">Acertos: {disciplinaSelecionadaData.acertos || 0} &nbsp;&nbsp;&nbsp;&nbsp;Erros: {disciplinaSelecionadaData.erros || 0}</li>

          </ul>


        </Container>
      ) : (
        <p className="disciplinaSelecionada"></p>
      )}

    </Container>


  );

}

export default MeuPerfil;
