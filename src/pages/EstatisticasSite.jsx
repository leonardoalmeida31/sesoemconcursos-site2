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
import AutoGraphOutlinedIcon from "@mui/icons-material/AutoGraphOutlined";
import Container from "@mui/material/Container";
import Cronometro from './Cronometro.jsx';
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
    ListItemText
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
    where, increment
} from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import "firebase/database";
import { useParams } from "react-router-dom";
import Comentarios from "./Comentarios.jsx";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

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

                    // Atualize o estado desempenhoTotal com as informações recuperadas
                    setDesempenhoTotal(desempenhoTotalSalvo);

                    // Atualize o estado paymentInfo
                    setPaymentInfo(userPaymentInfo);

                    const paymentInfo = userDoc.data().paymentInfo;
                    let maxQuestionsToDisplay = 0;
                    let accessDurationDays = 0;

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


    const [questoesPorDisciplina, setQuestoesPorDisciplina] = useState({});
    // Função para calcular estatísticas de questões por disciplina
    useEffect(() => {
        const calcularEstatisticas = () => {
            const estatisticas = {};
            questoesFiltradas.forEach((question) => {
                const disciplina = question.disciplina;
                if (estatisticas[disciplina]) {
                    estatisticas[disciplina]++;
                } else {
                    estatisticas[disciplina] = 1;
                }
            });
            setQuestoesPorDisciplina(estatisticas);
        };

        calcularEstatisticas();
    }, [questoesFiltradas]);

    const [questoesPorAssunto, setQuestoesPorAssunto] = useState({});

    useEffect(() => {
        const calcularEstatisticas = () => {
            const estatisticas = {};
            questoesFiltradas.forEach((question) => {
                const assunto = question.assunto;
                if (estatisticas[assunto]) {
                    estatisticas[assunto]++;
                } else {
                    estatisticas[assunto] = 1;
                }
            });
            setQuestoesPorAssunto(estatisticas);
        };

        calcularEstatisticas();
    }, [questoesFiltradas]);



    return (
        <Box>

            {user && (
                <Container>
                    <Typography sx={{ fontSize: '0.875em', fontWeight: '400', fontFamily: 'Poppins', textAlign: "center", padding: '1em', paddingTop: '0.400em', color: "#1c5253" }}>
                        A única plataforma de Questões de concursos especializada em Serviço Social
                    </Typography>
                    <FiltroMulti onFilterChange={setQuestoesFiltradas} setPaginaAtual={setPaginaAtual} db={db} />
                </Container>
            )}
            <Container sx={{ padding: '0em', maxWidth: 'false' }} className="fundo-Home">

                {user ? (

                    <Box >

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

                {Object.keys(questoesPorDisciplina).length > 0 && (
                    <Container>
                        <Typography variant="h6">Estatísticas por Disciplina:</Typography>
                        <ul>
                            {Object.entries(questoesPorDisciplina).map(([disciplina, count]) => (
                                <li key={disciplina}>
                                    {disciplina}: {count} ({((count / questoesFiltradas.length) * 100).toFixed(2)}%)
                                </li>
                            ))}
                        </ul>
                    </Container>
                )}


                {Object.keys(questoesPorAssunto).length > 0 && (
                    <Container>
                        <Typography variant="h6">Estatísticas por Assunto:</Typography>
                        <ul>
                            {Object.entries(questoesPorAssunto).map(([assunto, count]) => (
                                <li key={assunto}>
                                    {assunto}: {count} ({((count / questoesFiltradas.length) * 100).toFixed(2)}%)
                                </li>
                            ))}
                        </ul>
                    </Container>
                )}

            </Container>
        </Box>
    );
}

export default Home;