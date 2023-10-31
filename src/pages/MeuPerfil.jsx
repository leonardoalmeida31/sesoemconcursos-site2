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
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh'; // Use o ícone apropriado
import Typography from '@mui/material/Typography';
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
  const [photoURL, setPhotoURL] = useState("");
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
          const userEmail = userData.email;
          const userPhotoURL = user.photoURL; // Obtenha a URL da foto do perfil do usuário

          setDisplayName(userDisplayName);
          setEmail(userEmail); // Atualize o estado com o email
          setPhotoURL(userPhotoURL); // Atualize o estado com a URL da foto
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


  const [respostaCorreta, setRespostaCorreta] = useState(null);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [desempenhoPorDisciplina, setDesempenhoPorDisciplina] = useState({});
  const [desempenhoPorBanca, setDesempenhoPorBanca] = useState({});
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



  const [disciplinaSelecionadaParaZerar, setDisciplinaSelecionadaParaZerar] = useState(null);

  const zerarDesempenhoPorDisciplina = async () => {
    if (!user) {
      // Verifique se o usuário está autenticado
      console.log("Usuário não autenticado.");
      // Você pode redirecionar o usuário para fazer login ou exibir uma mensagem de erro.
      return;
    }

    const userRef = doc(db, "users", user.uid);

    if (!disciplinaSelecionada) {
      console.log("Selecione uma disciplina para zerar o desempenho.");
      // Exiba uma mensagem informando ao usuário para selecionar uma disciplina.
      return;
    }

    try {
      // Crie um objeto vazio para representar o desempenho por disciplina zerado
      const desempenhoZerado = { ...desempenhoPorDisciplina };
      delete desempenhoZerado[disciplinaSelecionada];

      // Atualize os dados no Firebase para zerar o desempenho da disciplina selecionada do usuário
      await updateDoc(userRef, { desempenhoPorDisciplina: desempenhoZerado });

      // Atualize o estado local para refletir o desempenho zerado
      setDesempenhoPorDisciplina(desempenhoZerado);
      console.log(`Desempenho da disciplina ${disciplinaSelecionada} zerado com sucesso!`);
    } catch (error) {
      console.error(`Erro ao zerar o desempenho da disciplina ${disciplinaSelecionada}:`, error);
      // Lidar com erros, exibir mensagens de erro, etc.
    }
  };


  const zerarDesempenhoTotal = async () => {
    if (!user) {
      // Verifique se o usuário está autenticado
      console.log("Usuário não autenticado.");
      // Você pode redirecionar o usuário para fazer login ou exibir uma mensagem de erro.
      return;
    }

    const userRef = doc(db, "users", user.uid);

    try {
      // Atualize os dados no Firebase para zerar o desempenho total do usuário
      await updateDoc(userRef, { desempenhoTotal: { acertos: 0, erros: 0 } });

      // Atualize o estado local para refletir o desempenho total zerado
      setDesempenhoTotal({ acertos: 0, erros: 0 });
      console.log("Desempenho total zerado com sucesso!");
    } catch (error) {
      console.error("Erro ao zerar o desempenho total:", error);
      // Lidar com erros, exibir mensagens de erro, etc.
    }
  };




  //função de buscar desempenho e exibir por banca:

  useEffect(() => {
    // Função para buscar o desempenho por disciplina do Firebase
    const fetchDesempenhoPorBanca = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const desempenho = userData.desempenhoPorBanca || {};
          setDesempenhoPorBanca(desempenho);
        }
      }
    };

    // Chame a função para buscar o desempenho por disciplina
    fetchDesempenhoPorBanca();
  }, [user, db]);


  const [bancaSelecionada, setBancaSelecionada] = useState("");

  useEffect(() => {
    if (desempenhoPorBanca) {
      const bancas = Object.keys(desempenhoPorBanca);
      if (bancas.length > 0) {
        setBancaSelecionada(bancas[0]); // Defina a primeira disciplina como selecionada por padrão
      }
    }
  }, [desempenhoPorBanca]);


  const bancaSelecionadaData =
    bancaSelecionada && desempenhoPorBanca[bancaSelecionada];





  const [bancaSelecionadaParaZerar, setBancaSelecionadaParaZerar] = useState(null);

  const zerarDesempenhoPorBanca = async () => {
    if (!user) {
      // Verifique se o usuário está autenticado
      console.log("Usuário não autenticado.");
      // Você pode redirecionar o usuário para fazer login ou exibir uma mensagem de erro.
      return;
    }

    const userRef = doc(db, "users", user.uid);

    if (!bancaSelecionada) {
      console.log("Selecione uma banca para zerar o desempenho.");
      // Exiba uma mensagem informando ao usuário para selecionar uma banca.
      return;
    }

    try {
      // Crie um objeto vazio para representar o desempenho por disciplina zerado
      const desempenhoZerado = { ...desempenhoPorBanca };
      delete desempenhoZerado[bancaSelecionada];

      // Atualize os dados no Firebase para zerar o desempenho da disciplina selecionada do usuário
      await updateDoc(userRef, { desempenhoPorBanca: desempenhoZerado });

      // Atualize o estado local para refletir o desempenho zerado
      setDesempenhoPorBanca(desempenhoZerado);
      console.log(`Desempenho da banca ${bancaSelecionada} zerado com sucesso!`);
    } catch (error) {
      console.error(`Erro ao zerar o desempenho da banca ${bancaSelecionada}:`, error);
      // Lidar com erros, exibir mensagens de erro, etc.
    }
  };

  return (

    <Container className="ContainerTotal">

      <Box className="box-user">
        {photoURL && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src={photoURL} alt="Foto do usuário" className="user-photo" style={{ borderRadius: "50%" }} />
          </div>
        )}
        <p className="nome-user2">Olá, {displayName}</p>
        {email && <p className="nome-user2">Email: {email}</p>}





      </Box>


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
               // Defina o tamanho do buraco no gráfico (valores de 0 a 1)
            }}
          />
        </div>
        {/* Legenda personalizada */}
        <div style={{ textAlign: 'center' }}>
          <p className="acertos">{totalQuestoesRespondidas} Questões Resolvidas</p>
        </div>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <IconButton
            onClick={zerarDesempenhoTotal}
            sx={{ color: "white", justifyContent: "center" }}
            aria-label="Zerar Desempenho por Disciplina"
          >
            <RefreshIcon /> {/* Use o ícone apropriado */}
            <Typography variant="body2">Zerar Desempenho Total</Typography>
          </IconButton>
        </Box>

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
              height={'300px'}
              chartType="PieChart"
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
                colors: ['#1c5253', '#B22222'],
                backgroundColor: 'white',
                fontSize: 10,
                pieHole: 0.4, // Defina o tamanho do buraco no gráfico (valores de 0 a 1)
              }}
            />
          </div>

          <ul>
            <li className="acertos">Acertos: {disciplinaSelecionadaData.acertos || 0} &nbsp;&nbsp;&nbsp;&nbsp;Erros: {disciplinaSelecionadaData.erros || 0}</li>



          </ul>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <IconButton
              onClick={zerarDesempenhoPorDisciplina}
              sx={{ color: "white", justifyContent: "center" }}
              aria-label="Zerar Desempenho por Disciplina"
            >
              <RefreshIcon /> {/* Use o ícone apropriado */}
              <Typography variant="body2">Zerar Desempenho Nessa Disciplina</Typography>
            </IconButton>
          </Box>

        </Container>
      ) : (
        <p className="disciplinaSelecionada"></p>
      )}




      <Box sx={{marginBottom: "1em"}}className="Box-select">
        <p className="disciplinaSelecionada"> Filtre seu Desempenho por Banca:</p>
        <Select  className="Select-Desempenho"
          value={bancaSelecionada}
          onChange={(e) => setBancaSelecionada(e.target.value)}
        >
          <MenuItem value={null}>Selecione uma banca</MenuItem>
          {Object.keys(desempenhoPorBanca).map((banca) => (
            <MenuItem key={banca} value={banca}>
              {banca}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {bancaSelecionadaData ? (
        <Container className="banca-grafico">

          <div style={{ borderRadius: '10px', overflow: 'hidden' }}>
            <Chart
              width={'100%'}
              height={'300px'}
              chartType="PieChart"
              loader={<Container>Carregando gráfico...</Container>}
              data={[
                ['Desempenho', 'Quantidade', { role: 'style' }],
                ['Acertos', bancaSelecionadaData.acertos || 0, '#1c5253'],
                ['Erros', bancaSelecionadaData.erros || 0, '#B22222'],
              ]}
              options={{
                title: `Desempenho em ${bancaSelecionada}`,
                titleTextStyle: {
                  fontSize: 12,
                  bold: true,
                  alignment: 'center',
                },
                colors: ['#1c5253', '#B22222'],
                backgroundColor: 'white',
                fontSize: 10,
                pieHole: 0.4, // Defina o tamanho do buraco no gráfico (valores de 0 a 1)
              }}
            />
          </div>

          <ul>
            <li className="acertos">Acertos: {bancaSelecionadaData.acertos || 0} &nbsp;&nbsp;&nbsp;&nbsp;Erros: {bancaSelecionadaData.erros || 0}</li>



          </ul>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <IconButton
              onClick={zerarDesempenhoPorBanca}
              sx={{ color: "white", justifyContent: "center" }}
              aria-label="Zerar Desempenho por Banca"
            >
              <RefreshIcon /> {/* Use o ícone apropriado */}
              <Typography variant="body2">Zerar Desempenho Nessa Banca</Typography>
            </IconButton>
          </Box>

        </Container>
      ) : (
        <p className="bancaSelecionada"></p>
      )}
    </Container>

  );

}

export default MeuPerfil;
