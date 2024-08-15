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
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import { IoMdCut } from "react-icons/io";
import Select from "@mui/material/Select";
import ContentCutRoundedIcon from '@mui/icons-material/ContentCutRounded';
import { loadStripe } from "@stripe/stripe-js";
import AutoGraphOutlinedIcon from "@mui/icons-material/AutoGraphOutlined";
import Container from "@mui/material/Container";
import { styled } from "@mui/system";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

import {
    Modal, Button, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper, ListItem, List, ListItemText
} from "@mui/material";
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import PollOutlinedIcon from '@mui/icons-material/PollOutlined';
import { TextField, TextareaAutosize } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import IconButton from "@mui/material/IconButton";
import Depoimentos from "./Depoimentos.jsx";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { useMediaQuery } from '@mui/material';
import { initializeApp } from "firebase/app";
import {
    getDocs, getFirestore, collection, doc, setDoc, getDoc, updateDoc, addDoc, onSnapshot, serverTimestamp, query, where,
} from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import "firebase/database";
import { useParams } from "react-router-dom";
import Comentarios from "./Comentarios.jsx";

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

const StyledCard = styled(Card)(({ theme }) => ({
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
}));

const StyledPrice = styled(Typography)(({ theme }) => ({
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#007bff",
    alignItems: "center"
}));

const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: "1rem",
    backgroundColor: "#007bff",
    color: "white",
    '&:hover': {
        backgroundColor: "#0056b3",
    },
}));

function Assinatura() {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const auth = getAuth(firebaseApp);
    // const questionsCollectionRef = collection(db, "questions");
    const [user, setUser] = useState(null);
    const [questoesPorPagina, setQuestoesPorPagina] = useState(5); // Defina o valor padrão como 10

    const [questions, setQuestions] = useState([]);
    const [paginaAtual, setPaginaAtual] = useState(1);

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


    const planos = [
        {
            nome: "Mensal",
            preco: "R$ 11,99/mês",
            beneficios: [
                { texto: "Resolução de Questões Ilimitadas", icone: <CheckIcon style={{ color: "#1c5253" }} /> },
                { texto: "Comentários de professores", icone: <CheckIcon style={{ color: "#1c5253" }} /> },
                { texto: "Questões Discursivas Liberadas", icone: <CheckIcon style={{ color: "#1c5253" }} /> },
                { texto: "Acesso ao gráfico de Desempenho Ilimitado", icone: <CheckIcon style={{ color: "#1c5253" }} /> },
                { texto: "Participar do Ranking de Desempenho do Site", icone: <CheckIcon style={{ color: "#1c5253" }} /> },
                { texto: "Maior custo a longo prazo", icone: <ClearIcon style={{ color: "#ff0000" }} /> },
            ],
        },
        {
            nome: "Semestral",
            preco: "R$ 60,00/a cada 6 meses",
            beneficios: [
                { texto: "Resolução de Questões Ilimitadas", icone: <CheckIcon style={{ color: "#1c5253" }} /> },
                { texto: "Comentários de professores", icone: <CheckIcon style={{ color: "#1c5253" }} /> },
                { texto: "Questões Discursivas Liberadas", icone: <CheckIcon style={{ color: "#1c5253" }} /> },
                { texto: "Acesso ao gráfico de Desempenho Ilimitado", icone: <CheckIcon style={{ color: "#1c5253" }} /> },
                { texto: "Participar do Ranking de Desempenho do Site", icone: <CheckIcon style={{ color: "#1c5253" }} /> },
                { texto: "Plano mais popular", icone: <CheckIcon style={{ color: "#1c5253" }} /> },

            ],
        },
        {
            nome: "Anual",
            preco: "R$ 120,00/a cada 12 meses",
            beneficios: [
                { texto: "Resolução de Questões Ilimitadas", icone: <CheckIcon style={{ color: "#1c5253" }} /> },
                { texto: "Comentários de professores", icone: <CheckIcon style={{ color: "#1c5253" }} /> },
                { texto: "Questões Discursivas Liberadas", icone: <CheckIcon style={{ color: "#1c5253" }} /> },
                { texto: "Acesso ao gráfico de Desempenho Ilimitado", icone: <CheckIcon style={{ color: "#1c5253" }} /> },
                { texto: "Participar do Ranking de Desempenho do Site", icone: <CheckIcon style={{ color: "#1c5253" }} /> },
                { texto: "Maior desconto", icone: <CheckIcon style={{ color: "#1c5253" }} /> },

            ],
        },
    ];




    return (
        <div className="Home">
            {user && (
                <AppBar
                    sx={{ backgroundColor: "#1c5253", marginBottom: "1em" }} position="static"
                >
                    <Container maxWidth="x1">
                        <Toolbar disableGutters>
                            {/*<Avatar alt="SESO Logo" src={SESOLogo}   sx={{  width: 40,  height: 40,   marginRight: "0.100em",  }}
      />*/}
                            <Typography variant="h6" noWrap component="a" href="/" sx={{ mr: 3, display: { xs: "none", md: "flex" }, fontFamily: "Poppins", fontWeight: 500, letterSpacing: ".1rem", color: "inherit", textDecoration: "none", }}
                            >
                                SESO em Concursos
                            </Typography>

                            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                                <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit"
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
                                        <Link to="/Discursivas" style={{ textDecoration: "none", fontFamily: "Poppins", }}>
                                            <Typography sx={{ color: "black" }}>
                                                Discursivas
                                            </Typography>
                                        </Link>
                                    </MenuItem>
                                    <MenuItem>
                                        <Link to="/MeuPerfil" style={{ textDecoration: "none" }}>
                                            <Typography sx={{ color: "black" }}>
                                                Meu Desempenho
                                            </Typography>
                                        </Link>
                                    </MenuItem>
                                    <MenuItem>
                                        <Link
                                            to="/RankingDesempenho"
                                            style={{ textDecoration: "none" }}
                                        >
                                            <Typography sx={{ color: "black" }}>Ranking</Typography>
                                        </Link>
                                    </MenuItem>
                                    <MenuItem>
                                        <Typography
                                            onClick={() => openModal()}
                                            sx={{ color: "black" }}
                                        >
                                            Assinar com cartão
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem>
                                        <Link
                                            to="/AssinarPIX"
                                            style={{ textDecoration: "none" }}
                                        >
                                            <Typography sx={{ color: "black" }}>
                                                Assinar com Pix
                                            </Typography>
                                        </Link>
                                    </MenuItem>
                                </Menu>
                            </Box>

                            <Typography variant="h6" noWrap component="a" href="/" sx={{
                                mr: 2, display: { xs: "flex", md: "none" }, flexGrow: 1, fontFamily: "Poppins", fontWeight: 500, letterSpacing: ".1rem", color: "inherit",
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
                                    <Link to="/Discursivas" style={{ textDecoration: "none", fontFamily: "Poppins", }}>
                                        <Button sx={{ color: "white" }}>DISCURSIVAS</Button>
                                    </Link>
                                </MenuItem>
                                <MenuItem>
                                    <Link to="/MeuPerfil" style={{ textDecoration: "none" }}>
                                        <Button sx={{ color: "white" }}>Meu Desempenho</Button>
                                    </Link>
                                </MenuItem>
                                <MenuItem>
                                    <Link
                                        to="/RankingDesempenho"
                                        style={{ textDecoration: "none" }}
                                    >
                                        <Button sx={{ color: "white" }}>Ranking</Button>
                                    </Link>
                                </MenuItem>
                                <MenuItem>
                                    <Button onClick={() => openModal()} sx={{ color: "white" }}>
                                        Assinar com cartão
                                    </Button>
                                </MenuItem>
                                <MenuItem>
                                    <Link to="/AssinarPIX" style={{ textDecoration: "none" }}>
                                        <Button sx={{ color: "white" }}>Assinar com Pix</Button>
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
                <div>


                </div>
            )}
            <Container className="fundo-Home">
                <div className="logout-button-container">

                </div>

                {user ? (

                    <Box sx={{ display: "flex", justifyContent: "space-around", padding: "1em" }}>
                        <Button variant="contained" onClick={handleCheckout} sx={{ marginRight: "10px" }}>
                            Assinar MENSAL
                        </Button>

                        <Button variant="contained" onClick={handleCheckoutS} sx={{ marginRight: "10px" }}>
                            Assinar SEMESTRAL
                        </Button>

                        <Button variant="contained" onClick={handleCheckoutA} sx={{ marginRight: "10px" }}>
                            Assinar ANUAL
                        </Button>

                        
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


{user && ( <Container>
                    <Grid container spacing={3}>
                        {planos.map((plano, index) => (
                            <Grid item xs={15} sm={6} md={4} key={index}>
                                <StyledCard>
                                    <StyledCardContent>
                                        <Typography variant="h6" component="div">
                                            {plano.nome}
                                        </Typography>
                                        <StyledPrice sx={{ fontSize: "1.2em", color: "#1c5253" }}>{plano.preco}</StyledPrice>
                                        <List>
                                            {plano.beneficios.map((beneficio, idx) => (
                                                <ListItem key={idx}>
                                                    {beneficio.icone}
                                                    <ListItemText primary={beneficio.texto} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </StyledCardContent>
                                </StyledCard>
                            </Grid>
                        ))}
                    </Grid>

                </Container> )}
            </Container>
        </div>
    );
}

export default Assinatura;