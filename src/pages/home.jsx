import React, { useState, useEffect } from "react";
import FiltroMulti from "../FiltroMulti.jsx";
import { CaretRight, ChatCenteredText, ChartPie } from "@phosphor-icons/react";
import "../App.css";
import Chart from "react-google-charts";
import PieChart from "../PieChart.jsx";
import imagemSvg from "../img/img-login-1.svg";
import SESOLogo from "../img/logo-seso-5.png";
import { Link } from "react-router-dom";
import MenuMui from "../MenuMui.jsx";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import BrushIcon from '@mui/icons-material/Brush';
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import { IoMdCut } from "react-icons/io";
import Select from "@mui/material/Select";
import ContentCutRoundedIcon from '@mui/icons-material/ContentCutRounded';
import { loadStripe } from "@stripe/stripe-js";
import AutoGraphOutlinedIcon from "@mui/icons-material/AutoGraphOutlined";
import Container from "@mui/material/Container";
import Cronometro from './Cronometro.jsx';
import PegarWhats from './PegarWhats.jsx';

import AnuncioCursos from './AnuncioCursos.jsx';

import {
  Modal,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  ListItem,
  List,
  ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText
} from "@mui/material";
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import PollOutlinedIcon from '@mui/icons-material/PollOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { TextField, TextareaAutosize } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import IconButton from "@mui/material/IconButton";
import Depoimentos from "./Depoimentos.jsx";
import EstatisticasQuestao from "./EstatisticasQuestao.jsx";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import LaptopChromebookIcon from '@mui/icons-material/LaptopChromebook';
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { useMediaQuery } from '@mui/material';
import { initializeApp } from "firebase/app";
import {
  getDocs,
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  where, increment,
} from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import "firebase/database";
import { useParams } from "react-router-dom";
import Comentarios from "./Comentarios.jsx";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useNavigate } from 'react-router-dom';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_REACT_APP_API_KEY,
  authDomain: import.meta.env.VITE_REACT_APP_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_REACT_APP_PROJECT_ID,
};

const pages = ["Questões"];
const settings = ["Perfil"];

const pageLinks = {
  Questões: "/",
};
const settingsLinks = {
  Perfil: "/MeuDesempenho",
};

function Home() {
  const firebaseApp = initializeApp(firebaseConfig);
  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);
  // const questionsCollectionRef = collection(db, "questions");
  const [user, setUser] = useState(null);
  const [questoesPorPagina, setQuestoesPorPagina] = useState(5); // Defina o valor padrão como 10
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
  const isMobile = useMediaQuery('(max-width: 600px)');
  const [questionsToShow, setQuestionsToShow] = useState([]);
  const [maxQuestionsToDisplay, setMaxQuestionsToDisplay] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [currentDate, setCurrentDate] = useState(
    new Date().toLocaleDateString()
  );
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const stripePublicKey = import.meta.env.VITE_REACT_APP_STRIPE_PUBLIC_KEY;
  const stripePromise = loadStripe(stripePublicKey);

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);


  const [open, setOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');

  const navigate = useNavigate();


  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

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
            desempenhoPorBanca: {}, // Defina um objeto vazio como valor padrão
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
    const questionsRef = ref(getDatabase(firebaseApp), "questions");
    onValue(questionsRef, (snapshot) => {
      const questionData = snapshot.val();

      if (questionData) {
        const questionArray = Object.keys(questionData).map((key) => ({
          id: key,
          ...questionData[key],
        }));

        shuffleArray(questionArray);
        setQuestions(questionArray);
      }
    });

    return () => { };
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
    // Redefina a página para 1 quando um filtro for aplicado
    setPaginaAtual(1); // Adicione esta linha para redefinir a página para 1
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
  const [desempenhoPorBanca, setDesempenhoPorBanca] = useState({});


  const [desempenhoTotal, setDesempenhoTotal] = useState({
    acertos: 0,
    erros: 0,
  });

  const saveUserResponses = async (questionId, respostaSelecionada) => {
    try {
      const collectionRef = collection(db, "alternativasRespondidas");
      const userResponseRef = doc(collectionRef, questionId.toString());

      const userResponseDoc = await getDoc(userResponseRef);
      if (userResponseDoc.exists()) {
        const responseData = userResponseDoc.data();

        // Verifica se a alternativa já foi respondida antes
        if (responseData.respostaCounts && responseData.respostaCounts[respostaSelecionada] !== undefined) {
          // Se a alternativa já foi respondida, incrementa o contador
          responseData.respostaCounts[respostaSelecionada]++;
        } else {
          // Se for a primeira vez que essa alternativa é respondida, inicializa o contador
          if (!responseData.respostaCounts) {
            responseData.respostaCounts = {};
          }
          responseData.respostaCounts[respostaSelecionada] = 1;
        }

        // Atualiza o documento com os dados atualizados
        await setDoc(userResponseRef, responseData);
        console.log("Resposta do usuário salva com sucesso!");
      } else {
        // Se o documento não existe, cria um novo documento com a resposta selecionada
        const newResponseData = {
          questionId: questionId,
          respostaSelecionada: respostaSelecionada,
          respostaCounts: {
            [respostaSelecionada]: 1,
          },
          // Outros dados relevantes que você queira armazenar
        };

        await setDoc(userResponseRef, newResponseData);
        console.log("Resposta do usuário salva com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao salvar a resposta do usuário:", error);
    }
  };



  const [feedbackLocal, setFeedbackLocal] = useState({});
  const [feedbackFirebase, setFeedbackFirebase] = useState(null); // Para armazenar o feedback do Firebase

  useEffect(() => {
    const carregarRespostas = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const respostasSalvas = userData.respostas || {};

          // Converter o timestamp do Firestore para um objeto Date
          const respostasConvertidas = Object.keys(respostasSalvas).reduce((acc, key) => {
            const resposta = respostasSalvas[key];
            return {
              ...acc,
              [key]: {
                resultado: resposta.resultado, // Mantenha o resultado
                data: resposta.data ? resposta.data.toDate() : null, // Data convertida
                respostaCorreta: resposta.respostaCorreta // Resposta correta para feedback
              }
            };
          }, {});

          setResultados(respostasConvertidas); // Atualiza o estado com as respostas convertidas
        }
      }
    };

    carregarRespostas(); // Chama a função para carregar as respostas
  }, [user]);



  const [cliques, setCliques] = useState(null);
  const handleRespostaClick = async (question) => {
    const respostaUsuario = alternativaSelecionada[question.ids];
    const respostaCorreta = question.resposta.charCodeAt(0) - 65;
    const questaoId = question.ids;
    const resultadoQuestao = respostaUsuario === respostaCorreta;

    // Atualize o feedback local
    // Atualize o estado com o feedback local
    setFeedbackLocal((prevFeedback) => ({
      ...prevFeedback,
      [question.ids]: {
        resultado: resultadoQuestao,
        respostaCorreta: question.resposta, // Supondo que question.resposta contém a resposta correta
      },
    }));

    // Atualize o estado de resultados com o resultado e a data
    setResultados((prevResultados) => ({
      ...prevResultados,
      [questaoId]: { resultado: resultadoQuestao, data: new Date().toISOString() },
    }));

    // Atualizar acertos/erros e desempenho
    if (resultadoQuestao) {
      setRespostaCorreta(true);
      setAcertos(acertos + 1);
      setDesempenhoTotal((prev) => ({ ...prev, acertos: prev.acertos + 1 }));
      setDesempenhoPorDisciplina((prev) => ({
        ...prev,
        [question.disciplina]: {
          acertos: (prev[question.disciplina]?.acertos || 0) + 1,
          erros: prev[question.disciplina]?.erros || 0,
        },
      }));
      setDesempenhoPorBanca((prev) => ({
        ...prev,
        [question.banca]: {
          acertos: (prev[question.banca]?.acertos || 0) + 1,
          erros: prev[question.banca]?.erros || 0,
        },
      }));
    } else {
      setRespostaCorreta(false);
      setErros(erros + 1);
      setDesempenhoTotal((prev) => ({ ...prev, erros: prev.erros + 1 }));
      setDesempenhoPorDisciplina((prev) => ({
        ...prev,
        [question.disciplina]: {
          acertos: prev[question.disciplina]?.acertos || 0,
          erros: (prev[question.disciplina]?.erros || 0) + 1,
        },
      }));
      setDesempenhoPorBanca((prev) => ({
        ...prev,
        [question.banca]: {
          acertos: prev[question.banca]?.acertos || 0,
          erros: (prev[question.banca]?.erros || 0) + 1,
        },
      }));
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

        const respostaData = {
          questaoId,
          respostaUsuario,
          resultado: resultadoQuestao,
          respostaCorreta: question.resposta,
          data: serverTimestamp(), // Usando o timestamp do Firebase
        };

        await setDoc(userRef, {
          respostas: {
            [questaoId]: respostaData
          }
        }, { merge: true });

        // Recupere as informações de desempenho do documento do usuário
        const desempenhoSalvo = userData.desempenhoPorDisciplina;

        // Atualize as informações de desempenho no documento do usuário
        await setDoc(userRef, { desempenhoPorDisciplina }, { merge: true });
        await setDoc(userRef, { desempenhoPorBanca }, { merge: true });
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
          // Atualize o desempenho por "banca" no Firebase
          await updateDoc(userRef, { desempenhoPorBanca });
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
    const banca = question.banca;

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
            price: "price_1NrgsdB3raGqSSUVG7HNSE2v",
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
            price: "price_1NwtihB3raGqSSUVxHmuE62X",
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


  const bull = (
    <Box
      component="span"
      sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
    >
      •
    </Box>
  );

  const card = (
    <React.Fragment>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Você pode responder apenas 15 questões por dia.
        </Typography>

        <Typography
          sx={{ fontSize: 18, color: "black" }}
          color="text.secondary"
        >
          Assine para responder questões ilimitadas todos os dias!
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={() => openModal()} size="small">
          Assinar agora
        </Button>
      </CardActions>
    </React.Fragment>
  );



  // Função para riscar o texto selecionado
  function riscarTexto() {
    var selection = window.getSelection().getRangeAt(0);
    var selectedText = selection.extractContents();
    var span = document.createElement("span");
    span.style.textDecoration = "line-through";
    span.appendChild(selectedText);
    selection.insertNode(span);
  }

  // Função para destacar o texto selecionado
  function destacarTexto(cor) {
    var selection = window.getSelection().getRangeAt(0);
    var selectedText = selection.extractContents();
    var span = document.createElement("span");
    span.style.backgroundColor = cor;
    span.appendChild(selectedText);
    selection.insertNode(span);
  }

  // Função para alterar a cor do texto selecionado
  function alterarCorTexto(cor) {
    var selection = window.getSelection().getRangeAt(0);
    var selectedText = selection.extractContents();
    var span = document.createElement("span");
    span.style.color = cor;
    span.appendChild(selectedText);
    selection.insertNode(span);
  }

  // Função para apagar todas as ações realizadas em todos os textos
  function apagarAcoes() {
    var spans = document.querySelectorAll("span");
    spans.forEach(function (span) {
      span.removeAttribute("style");
    });
  }

  // Adiciona um ouvinte de eventos para o evento de clique direito
  document.addEventListener("contextmenu", function (event) {
    event.preventDefault();

    // Cria o menu de contexto
    var menu = document.createElement("div");
    menu.style.width = "auto";
    menu.style.height = "auto";
    menu.style.backgroundColor = "#EEF2F2";
    menu.style.border = "2px inset #1C5253";
    menu.style.borderRadius = "7px";
    menu.style.padding = "10px";
    menu.style.position = "fixed";
    menu.style.top = event.clientY + "px";
    menu.style.left = event.clientX + "px";
    menu.style.zIndex = "1000";
    // Adicionado para permitir que os botões sejam ajustados em várias linhas se necessário

    // Título do menu
    var titulo = document.createElement("div");
    titulo.textContent = "Personalize sua Questão:";
    titulo.style.fontWeight = "bold";
    titulo.style.marginBottom = "10px";
    titulo.style.fontSize = "14px";
    titulo.style.fontFamily = "Poppins";
    menu.appendChild(titulo);

    // Adiciona opções ao menu
    var riscar = document.createElement("img");
    riscar.src = "https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/imagens%2Fsinal-de-interface-de-texto-tachado.png?alt=media&token=5a05f348-7648-4441-8ac6-9e53bad0114d";
    riscar.style.width = "30px"; // Substitua '20px' pela largura desejada
    riscar.style.height = "30px";
    riscar.style.marginRight = "15px";
    riscar.addEventListener("mouseover", function () {
      riscar.style.transition = "all 0.5s ease-in-out";
      riscar.style.transform = "scale(1.3)";
    });

    riscar.addEventListener("mouseout", function () {
      riscar.style.transition = "all 0.5s ease-in-out";
      riscar.style.transform = "scale(1)";
    });
    riscar.onclick = riscarTexto;
    menu.appendChild(riscar);


    var destacarAmarelo = document.createElement("img"); // Use 'img' em vez de 'button'
    destacarAmarelo.src = "https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/imagens%2Feditor-de-texto-amarelo.png?alt=media&token=0e1d4b61-2f29-4f3e-9992-f73f30a17827"; // Substitua isso pelo caminho do seu ícon
    destacarAmarelo.style.width = "30px"; // Substitua '20px' pela largura desejada
    destacarAmarelo.style.height = "30px"; // Substitua '20px' pela altura desejada
    destacarAmarelo.style.marginRight = "15px";
    destacarAmarelo.addEventListener("mouseover", function () {
      destacarAmarelo.style.transition = "all 0.5s ease-in-out";
      destacarAmarelo.style.transform = "scale(1.3)";
    });

    destacarAmarelo.addEventListener("mouseout", function () {
      destacarAmarelo.style.transition = "all 0.5s ease-in-out";
      destacarAmarelo.style.transform = "scale(1)";
    });
    destacarAmarelo.onclick = function () { destacarTexto("yellow"); };
    menu.appendChild(destacarAmarelo); // Adicionado ao menu

    var destacarVermelho = document.createElement("img"); // Use 'img' em vez de 'button'
    destacarVermelho.src = "https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/imagens%2Feditor-de-texto-vermelho.png?alt=media&token=142759b0-73bf-4b7c-9e7b-160050b10792"; // Substitua isso pelo caminho do seu ícon
    destacarVermelho.style.width = "30px"; // Substitua '20px' pela largura desejada
    destacarVermelho.style.height = "30px"; // Substitua '20px' pela altura desejada
    destacarVermelho.style.marginRight = "15px";
    destacarVermelho.addEventListener("mouseover", function () {
      destacarVermelho.style.transition = "all 0.5s ease-in-out";
      destacarVermelho.style.transform = "scale(1.3)";
    });

    destacarVermelho.addEventListener("mouseout", function () {
      destacarVermelho.style.transition = "all 0.5s ease-in-out";
      destacarVermelho.style.transform = "scale(1)";
    });
    destacarVermelho.onclick = function () { destacarTexto("red"); };
    menu.appendChild(destacarVermelho); // Adicionado ao menu

    var destacarVerde = document.createElement("img"); // Use 'img' em vez de 'button'
    destacarVerde.src = "https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/imagens%2Feditor-de-texto-verde.png?alt=media&token=40cf8130-2909-4daa-8472-364edc845a6c"; // Substitua isso pelo caminho do seu ícon
    destacarVerde.style.width = "30px"; // Substitua '20px' pela largura desejada
    destacarVerde.style.height = "30px"; // Substitua '20px' pela altura desejada
    destacarVerde.style.marginRight = "15px";
    destacarVerde.style.display = "inline-block";
    destacarVerde.addEventListener("mouseover", function () {
      destacarVerde.style.transition = "all 0.5s ease-in-out";
      destacarVerde.style.transform = "scale(1.3)";
    });

    destacarVerde.addEventListener("mouseout", function () {
      destacarVerde.style.transition = "all 0.5s ease-in-out";
      destacarVerde.style.transform = "scale(1)";
    });
    destacarVerde.onclick = function () { destacarTexto("#1c5253"); };
    menu.appendChild(destacarVerde); // Adicionado ao menu

    var destacarAzul = document.createElement("img"); // Use 'img' em vez de 'button'
    destacarAzul.src = "https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/imagens%2Fimage.png?alt=media&token=629bac6a-56b9-42c1-b4f2-0bb6e522b4df"; // Substitua isso pelo caminho do seu ícon
    destacarAzul.style.width = "30px"; // Substitua '20px' pela largura desejada
    destacarAzul.style.height = "30px"; // Substitua '20px' pela altura desejada
    destacarAzul.style.marginRight = "15px";
    destacarAzul.style.display = "inline-block";
    destacarAzul.addEventListener("mouseover", function () {
      destacarAzul.style.transition = "all 0.5s ease-in-out";
      destacarAzul.style.transform = "scale(1.3)";
    });

    destacarAzul.addEventListener("mouseout", function () {
      destacarAzul.style.transition = "all 0.5s ease-in-out";
      destacarAzul.style.transform = "scale(1)";
    });
    destacarAzul.onclick = function () { destacarTexto("#86BEDA"); };
    menu.appendChild(destacarAzul); // Adicionado ao menu

    var corTextoVermelho = document.createElement("img"); // Renomeado para corTextoVermelho
    corTextoVermelho.src = "https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/imagens%2Ftexto-vermelho.png?alt=media&token=753fcaf4-54f9-4fc0-8d96-fa7d43679f9a";
    corTextoVermelho.style.marginRight = "15px";
    corTextoVermelho.style.width = "30px"; // Substitua '20px' pela largura desejada
    corTextoVermelho.style.height = "30px"; // Substitua '20px' pela altura desejada
    corTextoVermelho.addEventListener("mouseover", function () {
      corTextoVermelho.style.transition = "all 0.5s ease-in-out";
      corTextoVermelho.style.transform = "scale(1.3)";
    });

    corTextoVermelho.addEventListener("mouseout", function () {
      corTextoVermelho.style.transition = "all 0.5s ease-in-out";
      corTextoVermelho.style.transform = "scale(1)";
    });
    corTextoVermelho.onclick = function () { alterarCorTexto("red"); };
    menu.appendChild(corTextoVermelho); // Adicionado ao menu


    var corTextoBranco = document.createElement("img"); // Renomeado para corTextoBranco
    corTextoBranco.src = "https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/imagens%2Ftexto-branco.png?alt=media&token=2e4339ad-cc35-4651-84a4-6a620047558e";
    corTextoBranco.style.marginRight = "15px";
    corTextoBranco.style.width = "30px"; // Substitua '20px' pela largura desejada
    corTextoBranco.style.height = "30px"; // Substitua '20px' pela altura desejada
    corTextoBranco.addEventListener("mouseover", function () {
      corTextoBranco.style.transition = "all 0.5s ease-in-out";
      corTextoBranco.style.transform = "scale(1.3)";
    });

    corTextoBranco.addEventListener("mouseout", function () {
      corTextoBranco.style.transition = "all 0.5s ease-in-out";
      corTextoBranco.style.transform = "scale(1)";
    });
    corTextoBranco.onclick = function () { alterarCorTexto("white"); };
    menu.appendChild(corTextoBranco); // Adicionado ao menu




    var corTextoBranco = document.createElement("img"); // Renomeado para corTextoBranco
    corTextoBranco.src = "https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/imagens%2Ftexto-verde.png?alt=media&token=1ca89406-fd0c-4f50-8150-bf47a7c648c7";
    corTextoBranco.style.marginRight = "15px";
    corTextoBranco.style.width = "30px"; // Substitua '20px' pela largura desejada
    corTextoBranco.style.height = "30px"; // Substitua '20px' pela altura desejada
    corTextoBranco.addEventListener("mouseover", function () {
      corTextoBranco.style.transition = "all 0.5s ease-in-out";
      corTextoBranco.style.transform = "scale(1.3)";
    });

    corTextoBranco.addEventListener("mouseout", function () {
      corTextoBranco.style.transition = "all 0.5s ease-in-out";
      corTextoBranco.style.transform = "scale(1)";
    });
    corTextoBranco.onclick = function () { alterarCorTexto("#1c5253"); };
    menu.appendChild(corTextoBranco); // Adicionado ao menu




    // Adiciona uma opção ao menu para apagar todas as ações
    var apagarAcoesBtn = document.createElement("img");
    apagarAcoesBtn.src = "https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/imagens%2Fborracha.png?alt=media&token=7cd951b9-0268-4310-9ddc-5865f78f08f2";
    apagarAcoesBtn.style.width = "30px"; // Substitua '20px' pela largura desejada
    apagarAcoesBtn.style.height = "30px"; // Substitua '20px' pela altura desejada
    apagarAcoesBtn.addEventListener("mouseover", function () {
      apagarAcoesBtn.style.transition = "all 0.6s ease-in-out";
      apagarAcoesBtn.style.transform = "scale(1.3)";
    });

    apagarAcoesBtn.addEventListener("mouseout", function () {
      apagarAcoesBtn.style.transition = "all 0.5s ease-in-out";
      apagarAcoesBtn.style.transform = "scale(1)";
    });
    apagarAcoesBtn.onclick = apagarAcoes;
    menu.appendChild(apagarAcoesBtn);

    // Adiciona o menu ao documento
    document.body.appendChild(menu);

    // Remove o menu quando o usuário clica em qualquer lugar
    document.addEventListener("click", function () {
      menu.remove();
    }, { once: true });
  });







  //WHATS PEGAR NUMERO:

  useEffect(() => {
    const checkWhatsappNumber = async () => {
      if (user) {
        const userRef = doc(db, 'users', user.uid); // Assumindo que a coleção de usuários se chama 'users'
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (!userData.whatsapp) {
            setOpen(true); // Abre o Dialog se não existir número de WhatsApp
          }
        }
      }
    };

    checkWhatsappNumber();
  }, [user, db]);

  const handleSaveWhatsappNumber = async () => {
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { whatsapp: whatsappNumber });
      setOpen(false); // Fecha o Dialog após salvar o número
    }
  };




  async function salvarResposta(userId, questionId, alternativa, acertou) {
    const docRef = doc(db, "respostasContar", `${userId}_${questionId}`);
    const dataResposta = new Date().toISOString();

    // Verificar se já existe uma resposta para esta questão
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Sobrescreve o documento existente
      await setDoc(docRef, {
        userId,
        questionId,
        dataResposta,
        alternativa,
        resultado: acertou ? "acertou" : "errou"
      });
    } else {
      // Cria um novo documento
      await setDoc(docRef, {
        userId,
        questionId,
        dataResposta,
        alternativa,
        resultado: acertou ? "acertou" : "errou"
      });
    }
  }
  return (
    <Box >
      {user && (
        <AnuncioCursos />

      )}

      {user && (
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Adicionar Número do WhatsApp</DialogTitle>
          <DialogContent>
            <DialogContentText>Por favor, adicione seu número de WhatsApp para atualizar o seu cadastro.</DialogContentText>
            <TextField autoFocus margin="dense" id="whatsapp" label="Digite o seu Número do WhatsApp" type="text" fullWidth variant="standard" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} />
          </DialogContent>
          <DialogActions>
            {/* <Button onClick={() => setOpen(false)}>Cancelar</Button> */}
            <Button onClick={handleSaveWhatsappNumber}>Salvar</Button>
          </DialogActions>
        </Dialog>
      )}
      {user && (

        <AppBar
          sx={{ backgroundColor: "#1c5253", marginBottom: "1em" }} position="static"
        >
          <Container maxWidth="xl">




            <Toolbar disableGutters>
              {/*<Avatar alt="SESO Logo" src={SESOLogo}   sx={{  width: 40,  height: 40,   marginRight: "0.100em",  }}
      />*/}
              <Typography noWrap component="a" href="/" sx={{ mr: 1, display: { xs: "none", md: "flex" }, fontFamily: "Poppins", fontWeight: 500, letterSpacing: "-0.01rem", color: "inherit", textDecoration: "none", }}
              >
                SESO em Concursos
              </Typography>

              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton size="medium" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu id="menu-appbar" anchorEl={anchorElNav} anchorOrigin={{ vertical: "bottom", horizontal: "left", }} keepMounted transformOrigin={{ vertical: "top", horizontal: "left", }} open={Boolean(anchorElNav)} onClose={handleCloseNavMenu} sx={{ display: { xs: "block", md: "none" }, }}
                >
                  {pages.map((page) => (
                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">{page}</Typography>
                    </MenuItem>
                  ))}
                  <MenuItem>
                    <Link to="/Aulas" style={{ textDecoration: "none", fontFamily: "Poppins", }}>
                      <Typography sx={{ color: "black", }}>
                        Aulas</Typography>
                    </Link>
                  </MenuItem>
                  <MenuItem sx={{ marginRight: "-.5em" }}>
                    <Link to="/Discursivas" style={{ textDecoration: "none", fontFamily: "Poppins", }}>
                      <Typography sx={{ color: "black", marginRight: "-.5em" }}>
                        Discursivas</Typography>
                    </Link>
                  </MenuItem>
                  <MenuItem sx={{ marginRight: "-.5em" }}>
                    <Link to="/Mentorias" style={{ textDecoration: "none", fontFamily: "Poppins", }}>
                      <Typography sx={{ color: "black", }}>
                        Mentoria
                      </Typography>
                    </Link>
                  </MenuItem>
                  <MenuItem sx={{ marginRight: "-.5em" }}>
                    <Link to="/MeuPerfil" style={{ textDecoration: "none" }}>
                      <Typography sx={{ color: "black", }}>
                        Meu Desempenho
                      </Typography>
                    </Link>
                  </MenuItem>
                  <MenuItem sx={{ marginRight: "-.5em" }}>
                    <Link
                      to="/RankingDesempenho"
                      style={{ textDecoration: "none" }}
                    >
                      <Typography sx={{ color: "black", }}>Ranking</Typography>
                    </Link>
                  </MenuItem>
                  <MenuItem sx={{ marginRight: "-.5em" }}>
                    <Link
                      to="/Assinatura"
                      style={{ textDecoration: "none" }}
                    >
                      <Typography sx={{ color: "black", }}>
                        Assinar com Cartão
                      </Typography>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      to="/AssinarPIX"
                      style={{ textDecoration: "none" }}
                    >
                      <Typography sx={{ color: "black", }}>
                        Assinar com Pix
                      </Typography>
                    </Link>
                  </MenuItem>
                </Menu>
              </Box>

              <Typography noWrap component="a" href="/" sx={{
                mr: 3, display: { xs: "flex", md: "none" }, flexGrow: 1, fontFamily: "Poppins", fontWeight: 500, letterSpacing: ".1rem", color: "inherit",
                textDecoration: "none",
              }}
              >
                SESO em Concursos
              </Typography>

              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                {pages.map((page) => (
                  <Link
                    key={page}
                    to={pageLinks[page]}
                    style={{ textDecoration: "none" }}
                  >
                    <Button sx={{ my: 2, color: "white", display: "block" }}>
                      {page}
                    </Button>
                  </Link>
                ))}
                <MenuItem>
                  <Link to="/Aulas" style={{ textDecoration: "none", fontFamily: "Poppins", }}>
                    <Button sx={{ color: "white", fontSize: '0.800em', marginRight: "-.7em" }}>Aulas</Button>
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link to="/Discursivas" style={{ textDecoration: "none", fontFamily: "Poppins", }}>
                    <Button sx={{ color: "white", fontSize: '0.800em', marginRight: "-.7em" }}>DISCURSIVAS</Button>
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link to="/Mentorias" style={{ textDecoration: "none", fontFamily: "Poppins", }}>
                    <Button sx={{ color: "white", fontSize: '0.800em', marginRight: "-.7em" }}>MENTORIA</Button>
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link to="/MeuPerfil" style={{ textDecoration: "none" }}>
                    <Button sx={{ color: "white", fontSize: '0.800em', marginRight: "-.7em" }}>Meu Desempenho</Button>
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link
                    to="/RankingDesempenho"
                    style={{ textDecoration: "none" }}
                  >
                    <Button sx={{ color: "white", fontSize: '0.800em', marginRight: "-.7em" }}>Ranking</Button>
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link to="/Assinatura" style={{ textDecoration: "none" }}>
                    <Button sx={{ color: "white", fontSize: '0.800em', marginRight: "-.7em" }}>Assinar com Cartão</Button>
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link to="/AssinarPIX" style={{ textDecoration: "none" }}>
                    <Button sx={{ color: "white", fontSize: '0.800em', marginRight: "-.7em" }}>Assinar com Pix</Button>
                  </Link>
                </MenuItem>
              </Box>

              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="Remy Sharp" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                  <MenuItem>
                    <a
                      href="https://api.whatsapp.com/send?phone=5574981265381"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      Suporte WhatsApp
                    </a>
                  </MenuItem>

                  <MenuItem>
                    <Typography onClick={signOut} sx={{ color: "black" }}>
                      Sair/Trocar Conta
                    </Typography>
                  </MenuItem>

                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      )}

      {user && (
        <Container maxWidth='xl'>
          <Typography sx={{ fontSize: '0.875em', fontWeight: '400', fontFamily: 'Poppins', textAlign: "center", padding: '1em', paddingTop: '0.400em', color: "#1c5253" }}>
            A única plataforma de Questões de concursos especializada em Serviço Social
          </Typography>
          <FiltroMulti onFilterChange={setQuestoesFiltradas} setPaginaAtual={setPaginaAtual} db={db} />
        </Container>
      )}
      <Container maxWidth="xl" sx={{ padding: '0em', maxWidth: 'false' }} className="fundo-Home">

        <div className="logout-button-container">
          <Modal
            open={modalOpen}
            onClose={closeModal}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Box
              className="modal-content"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                padding: "15px",
                borderRadius: "8px",
                textAlign: "center",
                width: "80%",
                maxWidth: "500px",
                backgroundColor: "#f4f4f4", // Cor de fundo do modal
              }}
            >
              <Typography variant="h5">
                Conheça Nossos Planos de Assinatura
              </Typography>

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
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Button
                variant="contained"
                color="secondary"
                onClick={closeModal}
              >
                Fechar
              </Button>
            </Box>
          </Modal>
        </div>

        {user && (

          <Box sx={{
            marginTop: '2.2em', display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
          }} border="1px solid #ccc" borderRadius={1} padding={2}>
            <Select
              value={questoesPorPagina}
              onChange={(e) => setQuestoesPorPagina(Number(e.target.value))}
              size="small"
              sx={{ backgroundColor: '#f2f2f2', fontSize: '0.800em', fontFamily: 'Poppins' }}
            >
              <MenuItem value={1}>1 Questão por página</MenuItem>
              <MenuItem value={5}>5 Questões por página</MenuItem>
              <MenuItem value={10}>10 Questões por página</MenuItem>
              <MenuItem value={15}>15 Questões por página</MenuItem>
              <MenuItem value={20}>20 Questões por página</MenuItem>
            </Select>

            <Cronometro /> {/* Renderize o componente Cronometro aqui */}

          </Box>)}



        {user ? (

          <Box >

            {questoesPagina.map((question) => (
              <div key={question.id} >
                <Box
                  sx={{
                    backgroundColor: '#1c5253',
                    color: 'white',
                    borderTopRightRadius: '7px',
                    borderTopLeftRadius: '7px',
                    marginTop: '2em',
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    maxWidth: '100%', // Garante que o Box se expanda horizontalmente
                  }}

                >
                  <Typography
                    style={{
                      whiteSpace: 'nowrap',
                      paddingTop: '0.800em',
                      paddingBottom: '0.800em',
                      alignItems: 'center',
                      marginTop: 2,
                      fontFamily: 'Poppins',
                      fontSize: '1em',
                      fontWeight: '400',
                      textAlign: 'left', // Alteração para alinhar à esquerda
                      display: 'inline-flex', // Exibir o conteúdo em linha
                    }}
                  >
                    &nbsp;&nbsp;
                    ID: {question.ids}&nbsp;&nbsp;&nbsp;{question.disciplina}
                    <ArrowRightIcon />{question.assunto}&nbsp;&nbsp;
                  </Typography>

                </Box>

                <Box sx={{ borderLeft: "1px solid #1c52531e", borderRight: "1px solid #1c52531e", borderBottom: "1px solid #1c52531e", }}>
                  <Box
                    sx={{
                      overflowX: 'auto',
                      overflowY: 'hidden',
                      maxWidth: '100%', // Garante que o Box se expanda horizontalmente
                    }}

                  >
                    <Typography style={{ whiteSpace: 'nowrap', paddingTop: '0.500em', paddingLeft: '0.300em', fontFamily: 'Poppins', fontSize: '1em', textAlign: 'left', color: '#1c5253', fontWeight: '500' }}>Banca: &nbsp;{question.banca}
                      &nbsp;&nbsp;&nbsp;&nbsp;Ano: &nbsp;{question.ano}
                      &nbsp;&nbsp;&nbsp;&nbsp;Cargo: &nbsp;{question.cargo}
                      &nbsp;&nbsp;&nbsp;&nbsp;Órgão: &nbsp;{question.concurso}&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;Data da Prova: &nbsp;{question.dataProva}&nbsp;&nbsp;
                    </Typography>

                  </Box>
                  <Box style={{ height: '2px', backgroundColor: '#1c525341', margin: '10px 0' }}></Box>

                  {resultados[question.ids]?.resultado !== undefined && (
                    <div>
                      <p className={resultados[question.ids]?.resultado ? "resposta-correta1" : "resposta-incorreta1"}>
                        {resultados[question.ids]?.resultado ? 'Você acertou essa Questão em:' : 'Você errou essa Questão em'}
                        &nbsp;{resultados[question.ids]?.data ? resultados[question.ids]?.data.toLocaleString('pt-BR') : 'Data inválida'} &nbsp;
                      </p>
                    </div>
                  )}




                  <p className="enunciado" dangerouslySetInnerHTML={{ __html: question.enunciado }}></p>

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
                        <Typography sx={{ margin: '0.500em', fontFamily: 'Poppins, Arial', fontSize: '0.900em', padding: '0.300em', color: 'black', fontSize: '1.1em', marginBottom: '0.8em' }}
                          className={`alternativa ${isSelected ? "selecionada" : ""} ${isRiscada ? "riscado" : ""}`}
                          key={index}
                          onClick={() => handleAlternativaClick(question.ids, index)}
                        >
                          <Box
                            className={`icon-container ${isRiscada ? "riscado" : ""}`}
                          >
                            <ContentCutRoundedIcon style={{ color: '#1c5253', fontSize: "small", }}
                              className={`tesoura-icon ${isRiscada ? "riscado" : ""}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRiscarAlternativa(question.ids, index);
                              }}
                            />
                          </Box>

                          <span
                            className={`letra-alternativa-circle ${isSelected ? "selecionada" : ""}`}
                          >
                            {letraAlternativa}
                          </span>
                          <span dangerouslySetInnerHTML={{ __html: alternativa.replace(/^\(([A-E])\)/, "") }} />
                        </Typography>

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

                    {feedbackLocal[question.ids] && (
                      <div className="feedback-local">
                        {feedbackLocal[question.ids].resultado ? (
                          <p className="resposta-correta">Você acertou!</p>
                        ) : (
                          <p className="resposta-incorreta">
                            Você errou! Resposta correta: {feedbackLocal[question.ids].respostaCorreta}
                          </p>
                        )}
                      </div>
                    )}





                  </div>

                </Box >

                <Box sx={{ display: "flex", flexDirection: "row", color: "#1c5253", alignItems: "flex-start", overflowX: 'auto', maxWidth: '100%', overflowY: 'hidden', justifyContent: 'flex-start', }}>
                  <IconButton
                    sx={{ color: '#1c5253', padding: '0.700em' }}
                    className="button-comentario"
                    onClick={() => toggleComentario(question.ids)}
                  >
                    <QuestionAnswerOutlinedIcon fontSize="small" sx={{ color: '#1c5253', backgroundColor: 'transparent' }} />
                    <Typography sx={{ fontSize: '0.550em', color: '#1c5253', marginLeft: '0.500em', fontFamily: 'Poppins', fontWeight: '500' }} color="error">
                      Comentários
                    </Typography>
                  </IconButton>

                  <IconButton sx={{ color: '#1c5253', padding: '0.700em' }}>
                    <Link to="/MeuPerfil" target="_blank" style={{ display: 'flex', textDecoration: 'none' }}>
                      <PollOutlinedIcon fontSize="small" sx={{ color: '#1c5253', backgroundColor: 'transparent' }} />
                      <Typography sx={{ fontSize: '0.550em', color: '#1c5253', marginLeft: '0.500em', fontFamily: 'Poppins', fontWeight: '500' }} color="error">
                        Meu Desempenho
                      </Typography>
                    </Link>
                  </IconButton>

                  {paymentInfo !== null && (
                    <EstatisticasQuestao key={question.id} questionId={question.ids} />
                  )}
                  <IconButton sx={{ color: '#1c5253', padding: '0.700em' }}>
                    <a
                      href="/Mentorias"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'flex', textDecoration: 'none' }}
                    >
                      <LaptopChromebookIcon fontSize="small" sx={{ color: '#1c5253', backgroundColor: 'transparent' }} />
                      <Typography
                        sx={{ fontSize: '0.550em', color: '#1c5253', marginLeft: '0.500em', fontFamily: 'Poppins', fontWeight: '500' }}
                        color="error"
                      >
                        Mentorias
                      </Typography>
                    </a>
                  </IconButton>

                  <IconButton sx={{ color: '#1c5253', padding: '0.700em' }}>
                    <a
                      href="https://chat.whatsapp.com/E4ANUZMGtFIKajR7qqzBxI"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'flex', textDecoration: 'none' }}
                    >
                      <WhatsAppIcon fontSize="small" sx={{ color: '#1c5253', backgroundColor: 'transparent' }} />
                      <Typography
                        sx={{ fontSize: '0.550em', color: '#1c5253', marginLeft: '0.500em', fontFamily: 'Poppins', fontWeight: '500' }}
                        color="error"
                      >
                        Grupo de Estudos
                      </Typography>
                    </a>
                  </IconButton>
                </Box>


                <Box className="linha-horizontal-comentario"></Box>

                <Grid 
                  className="campo-comentario"
                  container
                  direction="column" // Define os elementos na vertical
                  style={{
                    overflowX: "auto", // Adiciona a rolagem horizontal quando necessário
                  }}
                >
                  <Box 
                    sx={{
                      paddingBottom: '2em',
                      marginTop: '3em',
                      marginBottom: '3em',
                      backgroundColor: 'transparent'
                    }}
                    className={
                      comentariosVisiveis[question.ids]
                        ? "comentario visivel"
                        : "comentarios"
                    }
                  >
                    <Comentarios question={question} db={db} user={user} />
                  </Box>

                  <p
                    className={
                      comentariosVisiveis[question.ids]
                        ? "comentario visivel"
                        : "comentario"
                    }
                    style={{
                      overflowX: "auto", // Adiciona a rolagem horizontal quando necessário
                    }}
                  >
                    {question.comentario}
                  </p>
                </Grid>


              </div>
            ))}
            {paymentInfo === null && (
              <Box sx={{ maxWidth: 400 }}>
                <Card variant="outlined">{card}</Card>
              </Box>
            )}


            <Box className="pagination">
              <Button onClick={handlePreviousPage} disabled={paginaAtual === 1}>
                Anterior
              </Button>
              <Typography sx={{ fontFamily: "Poppins", fontSize: "0.850em", fontWeight: "500", padding: "0.500em", textAlign: "center" }}>
                {paginaAtual.toLocaleString('pt-BR')} de {totalPages.toLocaleString('pt-BR')}
              </Typography>
              <Button onClick={handleNextPage}>
                Próxima
              </Button>
            </Box>

            <Grid item xs={12} xl={6} sx={{ display: 'flex', justifyContent: 'left', padding: '2em' }}>

              <Grid item xs={12}  >

                {/* Avatar para tamanho xs */}
                <Grid item xs={12} sm={12} sx={{ display: { xs: 'flex', xl: 'none' }, justifyContent: 'center' }}>



                  <Avatar
                    alt="Avatar for XS"
                    src="https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/ANUNCIOS-CURSOS-FOTOS-SITE%2Fcurso%20c%C3%B3digo%20de%20%C3%A9tica%20600x600%20(3).png?alt=media&token=981da548-4efe-473e-a61e-99d957996088"
                    sx={{
                      width: '100%',
                      height: '100%',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                      paddingTop: '1em',
                      paddingBottom: '1em',
                      borderRadius: 0,
                    }}
                  />

                </Grid>

                {/* Avatar para tamanho xl */}
                <Grid item xs={12} xl={12} sx={{ display: { xs: 'none', xl: 'flex' }, justifyContent: 'left' }}>

                  <Avatar
                    alt="Avatar for XL"
                    src="https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/ANUNCIOS-CURSOS-FOTOS-SITE%2Fcurso%20c%C3%B3digo%20de%20%C3%A9tica%20600x600%20(3).png?alt=media&token=981da548-4efe-473e-a61e-99d957996088"
                    sx={{
                      width: '18em',
                      height: '100%',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                      paddingTop: '1em',
                      borderRadius: 0,
                    }}
                  />



                </Grid>
                <Grid sx={{ marginTop: '1em' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{
                      backgroundColor: '#2D6A4F',
                      padding: { sm: '1.5em 3em', xs: '0.5em 2em' },
                      borderRadius: '60px',
                      width: '100%',
                      '&:hover': {
                        backgroundColor: '#1B4D3E',
                      },
                    }}
                    href="https://sesoemconcursos.com.br/CursoCEP"
                    target="_blank" // Abre o link em uma nova aba
                    rel="noopener noreferrer" // Melhora a segurança ao abrir links externos
                  >
                    <Typography sx={{ fontSize: { sm: '1em', xs: '1em' }, fontWeight: '600' }}>
                      QUERO CONHECER
                    </Typography>
                  </Button>

                </Grid>

              </Grid>
            </Grid>

            {/* 
           <div style={{ position: 'relative', paddingBottom: '150%', height: 0, overflow: 'hidden' }}>
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSfYXx_jP8jrWzMGGs-qVhvn7YDuVeHzhfv4OMwQDdU7DT79lA/viewform?embedded=true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        frameBorder="0"
        marginHeight="0"
        marginWidth="0"
        title="Google Form"
      >
        A carregar…
      </iframe>
    </div> 
    
    */}

          </Box>

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

            <Depoimentos />
          </Box>
        )}

        {user && (
          <Box className="Rodapé">

            <Box className="Box-Rodapé">
              <p className="Texto-Rodapé">
                <Link to="/" style={{ textDecoration: "none", color: "white" }}>
                  SESOEMCONCURSOS.COM.BR
                </Link>
              </p>

              <p className="Texto-Rodapé">
                <Link
                  to="https://api.whatsapp.com/send?phone=5574981265381"
                  target="_blank"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Atendimento ao Cliente
                </Link>
              </p>
              <p className="Texto-Rodapé">
                <Link
                  to="https://chat.whatsapp.com/F2vTpLRwvPm5be8llpsdVu"
                  target="_blank"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Grupo no WhatsApp
                </Link>
              </p>
              <p className="Texto-Rodapé">Quem Somos</p>
              <p className="Texto-Rodapé">
                <Link
                  to="https://www.youtube.com/watch?v=2evADTh1FAY&t=1s"
                  target="_blank"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Como usar o SESO em Concursos
                </Link>
              </p>
            </Box>

            <Box className="Box-Rodapé">
              <p className="Texto-Rodapé">
                <Link
                  to="/MeuPerfil"
                  target="_blank"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Meu Desempenho
                </Link>
              </p>
              <p className="Texto-Rodapé">
                <Link to="/" style={{ textDecoration: "none", color: "white", }}>
                  Questões
                </Link>
              </p>

              <p className="Texto-Rodapé">
                <Link
                  to="/RankingDesempenho"
                  target="_blank"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Ranking de Desempenho
                </Link>
              </p>
              <p className="Texto-Rodapé">
                <Link
                  to="https://www.youtube.com/watch?v=2evADTh1FAY&t=1s"
                  target="_blank"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Como usar o SESO em Concursos
                </Link>
              </p>
            </Box>

            <Box className="Box-Rodapé">
              <p className="Texto-Rodapé">
                <Link
                  to="https://www.instagram.com/sesoemconcursos/"
                  target="_blank"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Instagram
                </Link>
              </p>
              <p className="Texto-Rodapé">
                <Link to="/Aulas" style={{ textDecoration: "none", color: "white", }}>
                  Aulas
                </Link>
              </p>
              <p className="Texto-Rodapé">Planos de Estudos</p>
              <p className="Texto-Rodapé">
                <Link
                  to="https://www.youtube.com/watch?v=2evADTh1FAY&t=1s"
                  target="_blank"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Como usar o SESO em Concursos
                </Link>
              </p>
            </Box>

            <Box className="Box-Rodapé1">
              <p className="Texto-Rodapé1">© 2023 - SESO em Concursos</p>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Home;