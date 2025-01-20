/* eslint-disable no-unused-vars */
import React, { useRef, useEffect, useState } from "react";
import QuestaoPorPagina from "./QuestaoPorPagina";
import { Box, Grid2, Grid, Typography, Paper, Button, Card, Container, } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { db, app, auth } from "../../firebase";
import { getDatabase, ref, onValue } from "firebase/database";
import "../../App.css";
import QuestaoResposta from "./QuestõesRespostas";
import { useUser } from "../../Context/UserContext";
import { setDoc, getDoc, doc, updateDoc, serverTimestamp, collection } from "firebase/firestore";
import ComentariosQuestao from "./ComentarioQuestao";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Comentarios from "../Depoimentos/Comentarios";
import Pagination from "../Pagination/Pagination";
import { writeBatch } from "firebase/firestore";
import FiltroMulti from "../Filtros/FiltroMulti";
import Cronometro from "../Cronometro/Cronometro";
import { useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { jsPDF } from "jspdf";
function Questao() {
    const componentRef = useRef();
    const [questions, setQuestions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [questoesPorPagina, setQuestoesPorPagina] = useState(5);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const indiceInicial = (paginaAtual - 1) * questoesPorPagina;
    const [alternativaSelecionada, setAlternativaSelecionada] = useState({});
    const [alternativasRiscadasPorQuestao, setAlternativasRiscadasPorQuestao] =
        useState({});
    const [cliques, setCliques] = useState(null);
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [user, setUser] = useState(null);
    const [feedbackLocal, setFeedbackLocal] = useState({});
    const [resultados, setResultados] = useState({});
    const [respostaCorreta, setRespostaCorreta] = useState(null);
    const [acertos, setAcertos] = useState(0);
    const [erros, setErros] = useState(0);
    const [desempenhoPorDisciplina, setDesempenhoPorDisciplina] = useState({});
    const [desempenhoPorBanca, setDesempenhoPorBanca] = useState({});
    const [comentariosVisiveis, setComentariosVisiveis] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [questoesFiltradas, setQuestoesFiltradas] = useState([]);
    const [filtroBanca, setFiltroBanca] = useState(null);
    const [filtroDisciplina, setFiltroDisciplina] = useState(null);
    const [filtroAssunto, setFiltroAssunto] = useState(null);
    const [filtroAno, setFiltroAno] = useState(null);
    const [filtroModalidade, setFiltroModalidade] = useState(null);
    const [filtroArea, setFiltroArea] = useState(null);
    const isMobile = useMediaQuery('(max-width: 600px)');
    const [maxQuestionsToDisplay, setMaxQuestionsToDisplay] = useState(0);
    const [questionsToShow, setQuestionsToShow] = useState([]);
    const [expirationDate, setExpirationDate] = useState(null);
    const [feedbackFirebase, setFeedbackFirebase] = useState(null);
    const [copied, setCopied] = useState(false);
    const [fontSize, setFontSize] = useState(1);

    const aumentarFonte = () => setFontSize((prev) => Math.min(prev + 0.1, 2));
    const diminuirFonte = () => setFontSize((prev) => Math.max(prev - 0.1, 0.8));


    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (currentUser) {
            setUser(currentUser);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setUser(user);
                const userRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const paymentInfo = userData.paymentInfo;
                    const expirationDate = userData.expirationDate;

                    setPaymentInfo(paymentInfo);
                    setExpirationDate(expirationDate);
                    setDesempenhoPorDisciplina(userData.desempenhoPorDisciplina || {});
                    setDesempenhoTotal(userData.desempenhoTotal || { acertos: 0, erros: 0 });

                    let accessDurationDays = 0;
                    let newExpirationDate = expirationDate;


                    if (paymentInfo === 0 || paymentInfo === null) {
                        newExpirationDate = new Date();
                        newExpirationDate.setDate(newExpirationDate.getDate() + 1);
                        setMaxQuestionsToDisplay(Math.min(15, questoesPagina.length));
                    } else if (paymentInfo === 1) {
                        newExpirationDate = new Date();
                        newExpirationDate.setDate(newExpirationDate.getDate() + 30);
                        setMaxQuestionsToDisplay(questoesPagina.length);
                    } else if (paymentInfo === 2) {
                        newExpirationDate = new Date();
                        newExpirationDate.setDate(newExpirationDate.getDate() + 180);
                        setMaxQuestionsToDisplay(questoesPagina.length);
                    } else if (paymentInfo === 3) {
                        newExpirationDate = new Date();
                        newExpirationDate.setDate(newExpirationDate.getDate() + 365);
                        setMaxQuestionsToDisplay(questoesPagina.length);
                    } else if (paymentInfo === 60.00) {
                        newExpirationDate = new Date();
                        newExpirationDate.setDate(newExpirationDate.getDate() + 180);
                        setMaxQuestionsToDisplay(questoesPagina.length);
                    } else if (paymentInfo === 110.00) {
                        newExpirationDate = new Date();
                        newExpirationDate.setDate(newExpirationDate.getDate() + 365);
                        setMaxQuestionsToDisplay(questoesPagina.length);
                    }


                    if (newExpirationDate !== expirationDate) {
                        await setDoc(userRef, { expirationDate: newExpirationDate }, { merge: true });
                        setExpirationDate(newExpirationDate);
                    }

                } else {
                    await setDoc(userRef, {
                        expirationDate: null,
                        paymentInfo: null,
                        desempenhoTotal: { acertos: 0, erros: 0 },
                        desempenhoPorDisciplina: {},
                        desempenhoPorBanca: {},
                        cliques: 0,
                    });
                }
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, [auth, maxQuestionsToDisplay]);



    // useEffect(() => {
    //     const unsubscribe = auth.onAuthStateChanged(async (user) => {
    //       if (user) {
    //         setUser(user);

    //         const userRef = doc(db, "users", user.uid);
    //         const userDoc = await getDoc(userRef);

    //         if (userDoc.exists()) {
    //           const userData = userDoc.data();
    //           const userDisplayName = userData.displayName;
    //           const userPaymentInfo = userData.paymentInfo;
    //           const expirationDate = userData.expirationDate;

    //           const desempenhoSalvo = userData.desempenhoPorDisciplina;

    //           setDesempenhoPorDisciplina(desempenhoSalvo);

    //               const desempenhoTotalSalvo = userData.desempenhoTotal || {
    //             acertos: 0,
    //             erros: 0,
    //           };
    //               setDesempenhoTotal(desempenhoTotalSalvo);

    //           setPaymentInfo(userPaymentInfo);

    //           const paymentInfo = userDoc.data().paymentInfo;
    //           let maxQuestionsToDisplay = 0;
    //           let accessDurationDays = 0;

    //           if (paymentInfo === 0 || paymentInfo === null) {
    //             maxQuestionsToDisplay = Math.min(15, questoesPagina.length);
    //             accessDurationDays = 1;
    //           } else if (paymentInfo === 1) {
    //             maxQuestionsToDisplay = questoesPagina.length;
    //             accessDurationDays = 180;
    //           } else if (paymentInfo === 2) {
    //             maxQuestionsToDisplay = questoesPagina.length;
    //             accessDurationDays = 365;
    //           }

    //           const totalPages = Math.ceil(
    //             questoesPagina.length / maxQuestionsToDisplay
    //           );

    //           setMaxQuestionsToDisplay(maxQuestionsToDisplay);

    //           const questionsToDisplay = questoesPagina.slice(
    //             0,
    //             maxQuestionsToDisplay
    //           );
    //           setQuestionsToShow(questionsToDisplay);

    //           setPaginaAtual(1);


    //           if (!expirationDate) {
    //             const currentDate = new Date();
    //             const expirationDate = new Date(currentDate);
    //             expirationDate.setDate(currentDate.getDate() + accessDurationDays);


    //             await setDoc(userRef, { expirationDate }, { merge: true });

    //           }
    //         } else {

    //           await setDoc(userRef, {
    //             expirationDate: null,
    //             paymentInfo: null,
    //             desempenhoTotal: {
    //               acertos: 0,
    //               erros: 0,
    //             },
    //             desempenhoPorDisciplina: {}, 
    //             desempenhoPorBanca: {}, 
    //             cliques: 0,
    //           });
    //         }
    //       } else {
    //         setUser(null);
    //       }
    //     });

    //     return () => unsubscribe();
    //   }, [auth, maxQuestionsToDisplay]);

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    useEffect(() => {
        const questionsRef = ref(getDatabase(app), "questions");
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
    }, [filtroBanca, filtroDisciplina, filtroAssunto, filtroAno, filtroModalidade, filtroArea, questions]);


    // useEffect(() => {
    //     const filtered = questions.filter((question) => {
    //         return (
    //             (!filtroBanca || question.banca === filtroBanca) &&
    //             (!filtroDisciplina || question.disciplina === filtroDisciplina) &&
    //             (!filtroAno || question.ano === filtroAno) &&
    //             (!filtroAssunto || question.assunto === filtroAssunto) &&
    //             (!filtroModalidade || question.modalidade === filtroModalidade)
    //         );
    //     });

    //     setQuestoesFiltradas(filtered);
    //     setPaginaAtual(1);
    // }, [
    //     filtroBanca,
    //     filtroDisciplina,
    //     filtroAssunto,
    //     filtroAno,
    //     filtroModalidade,
    //     filtroArea,
    //     questions,
    // ]);

    const questoesPagina = questoesFiltradas.slice(
        indiceInicial,
        indiceInicial + questoesPorPagina
    );

    const handleAlternativaClick = (questionId, alternativaIndex) => {
        const newAlternativaSelecionada = {
            [questionId]: alternativaIndex,
        };
        setAlternativaSelecionada(newAlternativaSelecionada);
    };

    const handleRespostaClick = async (question) => {
        const respostaUsuario = alternativaSelecionada[question.ids];

        if (typeof respostaUsuario === 'undefined') {
            console.warn(`Resposta não selecionada para a questão ${question.ids}`);
            return;
        }

        const respostaCorreta = question.resposta.charCodeAt(0) - 65;
        const questaoId = question.ids;
        const resultadoQuestao = respostaUsuario === respostaCorreta;

        setFeedbackLocal((prevFeedback) => ({
            ...prevFeedback,
            [question.ids]: {
                resultado: resultadoQuestao,
                respostaCorreta: question.resposta,
            },
        }));

        setResultados((prevResultados) => ({
            ...prevResultados,
            [questaoId]: { resultado: resultadoQuestao, data: new Date().toISOString() },
        }));

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

        if (user) {
            const userRef = doc(db, "users", user.uid);

            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const respostaData = {
                    questaoId,
                    respostaUsuario,
                    resultado: resultadoQuestao,
                    respostaCorreta: question.resposta,
                    data: serverTimestamp(),
                };

                await setDoc(userRef, {
                    respostas: {
                        [questaoId]: respostaData
                    },
                    desempenhoPorDisciplina,
                    desempenhoPorBanca,
                    desempenhoTotal,
                }, { merge: true });

                if (paymentInfo === null || paymentInfo === 0 || cliques < 15) {
                    verificarResposta(question);
                    const newCliques = cliques + 1;
                    await updateDoc(userRef, { cliques: newCliques });
                    setCliques(newCliques);
                } else {
                    verificarResposta(question);
                }
            }
        }
        console.log("Cliclou")
    };

    const inicializarCliques = async () => {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            const cliquesDoUsuario = userData.cliques || 0;

            setCliques(cliquesDoUsuario);
        }
    };


    useEffect(() => {
        const carregarRespostas = async () => {
            if (user) {
                const userRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const respostasSalvas = userData.respostas || {};


                    const respostasConvertidas = Object.keys(respostasSalvas).reduce((acc, key) => {
                        const resposta = respostasSalvas[key];
                        return {
                            ...acc,
                            [key]: {
                                resultado: resposta.resultado,
                                data: resposta.data ? resposta.data.toDate() : null,
                                respostaCorreta: resposta.respostaCorreta
                            }
                        };
                    }, {});

                    setResultados(respostasConvertidas);
                }
            }
        };

        carregarRespostas();
    }, [user]);

    useEffect(() => {
        if (user) {
            inicializarCliques();

            const resetCliquesInterval = setInterval(() => {
                const userRef = doc(db, "users", user.uid);
                updateDoc(userRef, { cliques: 0 })
                    .then(() => {
                        console.log("Campo 'cliques' reiniciado para 0.");
                    })
                    .catch((error) => {
                        console.error("Erro ao reiniciar o campo 'cliques':", error);
                    });
            }, 12 * 60 * 60 * 1000);
            return () => clearInterval(resetCliquesInterval);
        }
    }, [user]);

    const verificarResposta = async (question) => {
        const questionId = question.ids;

        const respostaCorreta = question.resposta.charCodeAt(0) - 65;

        const disciplina = question.disciplina;
        const banca = question.banca;

        if (alternativaSelecionada === respostaCorreta) {
            return;
        }

    };


    const [desempenhoTotal, setDesempenhoTotal] = useState({
        acertos: 0,
        erros: 0,
    });

    const toggleComentario = (questionId) => {
        console.log("Toggled comentario for questionId:", questionId);
        setComentariosVisiveis((prevVisiveis) => ({
            ...prevVisiveis,
            [questionId]: !prevVisiveis[questionId],
        }));
    };


    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const totalPages = Math.ceil(questoesFiltradas.length / questoesPorPagina);

    const handlePageChange = (page) => {
        setPaginaAtual(page);
        console.log(`Página atual: ${page}`);
    };


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


    const handleRiscarAlternativa = (questionId, index) => {
        setAlternativasRiscadasPorQuestao((prev) => ({
            ...prev,
            [questionId]: {
                ...prev[questionId],
                [index]: !prev[questionId]?.[index],
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


        var destacarAmarelo = document.createElement("img");
        destacarAmarelo.src = "https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/imagens%2Feditor-de-texto-amarelo.png?alt=media&token=0e1d4b61-2f29-4f3e-9992-f73f30a17827"; // Substitua isso pelo caminho do seu ícon
        destacarAmarelo.style.width = "30px";
        destacarAmarelo.style.height = "30px";
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
        menu.appendChild(destacarAmarelo);

        var destacarVermelho = document.createElement("img");
        destacarVermelho.src = "https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/imagens%2Feditor-de-texto-vermelho.png?alt=media&token=142759b0-73bf-4b7c-9e7b-160050b10792"; // Substitua isso pelo caminho do seu ícon
        destacarVermelho.style.width = "30px";
        destacarVermelho.style.height = "30px";
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
        menu.appendChild(destacarVermelho);

        var destacarVerde = document.createElement("img");
        destacarVerde.src = "https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/imagens%2Feditor-de-texto-verde.png?alt=media&token=40cf8130-2909-4daa-8472-364edc845a6c"; // Substitua isso pelo caminho do seu ícon
        destacarVerde.style.width = "30px";
        destacarVerde.style.height = "30px";
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
        menu.appendChild(destacarVerde);

        var destacarAzul = document.createElement("img");
        destacarAzul.src = "https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/imagens%2Fimage.png?alt=media&token=629bac6a-56b9-42c1-b4f2-0bb6e522b4df"; // Substitua isso pelo caminho do seu ícon
        destacarAzul.style.width = "30px";
        destacarAzul.style.height = "30px";
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
        menu.appendChild(destacarAzul);
        var corTextoVermelho = document.createElement("img");
        corTextoVermelho.src = "https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/imagens%2Ftexto-vermelho.png?alt=media&token=753fcaf4-54f9-4fc0-8d96-fa7d43679f9a";
        corTextoVermelho.style.marginRight = "15px";
        corTextoVermelho.style.width = "30px";
        corTextoVermelho.style.height = "30px";
        corTextoVermelho.addEventListener("mouseover", function () {
            corTextoVermelho.style.transition = "all 0.5s ease-in-out";
            corTextoVermelho.style.transform = "scale(1.3)";
        });

        corTextoVermelho.addEventListener("mouseout", function () {
            corTextoVermelho.style.transition = "all 0.5s ease-in-out";
            corTextoVermelho.style.transform = "scale(1)";
        });
        corTextoVermelho.onclick = function () { alterarCorTexto("red"); };
        menu.appendChild(corTextoVermelho);


        var corTextoBranco = document.createElement("img");
        corTextoBranco.src = "https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/imagens%2Ftexto-branco.png?alt=media&token=2e4339ad-cc35-4651-84a4-6a620047558e";
        corTextoBranco.style.marginRight = "15px";
        corTextoBranco.style.width = "30px";
        corTextoBranco.style.height = "30px";
        corTextoBranco.addEventListener("mouseover", function () {
            corTextoBranco.style.transition = "all 0.5s ease-in-out";
            corTextoBranco.style.transform = "scale(1.3)";
        });

        corTextoBranco.addEventListener("mouseout", function () {
            corTextoBranco.style.transition = "all 0.5s ease-in-out";
            corTextoBranco.style.transform = "scale(1)";
        });
        corTextoBranco.onclick = function () { alterarCorTexto("white"); };
        menu.appendChild(corTextoBranco);


        var apagarAcoesBtn = document.createElement("img");
        apagarAcoesBtn.src = "https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/imagens%2Fborracha.png?alt=media&token=7cd951b9-0268-4310-9ddc-5865f78f08f2";
        apagarAcoesBtn.style.width = "30px";
        apagarAcoesBtn.style.height = "30px";
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


        document.body.appendChild(menu);

        document.addEventListener("click", function () {
            menu.remove();
        }, { once: true });
    });


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

    const handlePrint = () => {
        const printContent = questoesPagina.map((question) => {
            const alternativas = question.alternativas.map((alternativa, index) => {
                return `<p><strong>${alternativa.match(/^\(([A-E])\)/)[1]}:</strong> ${alternativa.replace(/^\([A-E]\)/, '')}</p>`;
            }).join("");

            const respostaCorreta = question.resposta || "Resposta não encontrada";

            return `
                <div style="padding: 1em; margin-bottom: 1em; border-bottom: 1px solid #ccc;">
                    <h3>ID: ${question.ids} - ${question.disciplina}</h3>
                    <p><strong>Assunto:</strong> ${question.assunto}</p>
                    <p><strong>Banca:</strong> ${question.banca} <strong>Ano:</strong> ${question.ano} <strong>Cargo:</strong> ${question.cargo}</p>
                    <p><strong>Enunciado:</strong> ${question.enunciado}</p>
                    <div><strong>Alternativas:</strong> ${alternativas}</div>
                    <p><strong>Resposta correta:</strong> ${respostaCorreta}</p>
                </div>
            `;
        }).join("");
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Impressão de Questões SESO em Concursos</title></head><body>');
        printWindow.document.write(printContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };


    return (
        <Box
            sx={{
                maxWidth: '100%',
                padding: isMobile ? '0em' : '0em',

            }}
            className="fundo-Home"
        >

            <Container maxWidth="xl" sx={{ padding: '0em' }}>
                <Container maxWidth='xl'>
                    <Typography
                        sx={{
                            fontSize: { xs: '0.8em', md: '1.2em' },
                            fontWeight: '400',
                            fontFamily: 'Poppins',
                            textAlign: 'center',
                            padding: '1em',
                            color: '#1c5253',
                        }}
                    >
                        A única plataforma de Questões de concursos especializada em Serviço Social
                    </Typography>

                    <FiltroMulti onFilterChange={setQuestoesFiltradas} setPaginaAtual={setPaginaAtual} db={db} />
                </Container>

                <Box
                    sx={{
                        marginTop: '2.2em',
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        border: '1px solid #ccc',
                        borderRadius: 1,
                        padding: 2,
                    }}
                    ref={componentRef}
                >
                    <QuestaoPorPagina
                        questoesPorPaginaInicial={questoesPorPagina}
                        onChangeQuestoesPorPagina={setQuestoesPorPagina}
                        handlePrint={handlePrint}
                    />

                    <Cronometro />

                    <Button
                        onClick={aumentarFonte}
                        sx={{
                     
                            marginTop: {
                                xs: "1em", // Para dispositivos móveis
                                md: "0em", // Para telas maiores (desktop)
                            },
                            marginBottom: {
                                xs: "0.5em", // Para dispositivos móveis
                                md: "0em", // Para telas maiores (desktop)
                            },
                            marginRight: {
                                xs: "0em", // Para dispositivos móveis
                                md: "0.5em", // Para telas maiores (desktop)
                            },
                            fontSize: {
                                xs: "1.2em", // Para dispositivos móveis
                                md: "1.5em", // Para telas maiores (desktop)
                            },
                            fontFamily: "Poppins",
                            fontWeight: "700",
                            color: "#1c5253",
                            backgroundColor: "transparent",
                            border: "1px solid #1c5253",
                            '&:hover': {
                                backgroundColor: "rgba(28, 82, 83, 0.1)",
                            },
                        }}
                    >
                        A<span style={{ fontSize: "0.9em", fontWeight: "normal" }}>+</span>
                    </Button>
                    <Button
                        onClick={diminuirFonte}
                        sx={{
                      
                            fontSize: {
                                xs: "1em", // Para dispositivos móveis
                                md: "1.2em", // Para telas maiores (desktop)
                            },
                            marginBottom: {
                                xs: "0.5em", // Para dispositivos móveis
                                md: "0em", // Para telas maiores (desktop)
                            },
                            fontFamily: "Poppins",
                            fontWeight: "700",
                            color: "#1c5253",
                            backgroundColor: "transparent",
                            border: "1px solid #1c5253",
                            '&:hover': {
                                backgroundColor: "rgba(28, 82, 83, 0.1)",
                            },
                        }}
                    >
                        a<span style={{ fontSize: "0.8em", fontWeight: "normal" }}>-</span>
                    </Button>


                </Box>
                <Box sx={{ display: "flex", justifyContent: "right", marginBottom: "1em", marginTop: '1em' }}>

                </Box>
                <Box  ref={componentRef} component={Paper} id="print-section" sx={{}}>
                    {questoesPagina.map((question) => (
                        <div key={question.id}>
                            <Link to={`/questao/${question.ids}`}>
                                <Box
                                    sx={{
                                        backgroundColor: '#1c5253',
                                        color: 'white',
                                        borderTopRightRadius: '7px',
                                        borderTopLeftRadius: '7px',
                                        marginTop: '2em',
                                        overflowX: 'auto',
                                        overflowY: 'hidden',
                                        maxWidth: '100%',
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            whiteSpace: 'nowrap',
                                            paddingY: '0.8em',
                                            alignItems: 'center',
                                            fontFamily: 'Poppins',
                                            fontSize: '0.8em',
                                            fontWeight: '400',
                                            textAlign: 'left',
                                            display: 'inline-flex',
                                            marginX: 2,
                                        }}
                                    >
                                        ID: {question.ids}&nbsp;&nbsp;&nbsp;{question.disciplina}
                                        <ArrowRightIcon />{question.assunto}&nbsp;&nbsp;
                                    </Typography>
                                </Box>
                            </Link>

                            <Box
                            >
                                <Box
                                    sx={{
                                        overflowX: 'auto',
                                        overflowY: 'hidden',
                                        maxWidth: '100%',
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            whiteSpace: 'nowrap',
                                            paddingY: '0.5em',
                                            paddingLeft: '0.3em',
                                            fontFamily: 'Poppins',
                                            fontSize: '0.8em',
                                            textAlign: 'left',
                                            color: '#1c5253',
                                            fontWeight: '500',
                                        }}
                                    >
                                        Banca: {question.banca}&nbsp;&nbsp;&nbsp;&nbsp;Ano: {question.ano}&nbsp;&nbsp;&nbsp;&nbsp;Cargo: {question.cargo}
                                        &nbsp;&nbsp;&nbsp;&nbsp;Órgão: {question.concurso}&nbsp;&nbsp;&nbsp;&nbsp;Data da Prova: {question.dataProva}
                                    </Typography>
                                </Box>

                                <Box style={{ height: '2px', backgroundColor: '#1c525341', margin: '10px 0', }}></Box>

                                {resultados[question.ids]?.resultado !== undefined && (
                                    <div>
                                        <p className={resultados[question.ids]?.resultado ? "resposta-correta1" : "resposta-incorreta1"}>
                                            {resultados[question.ids]?.resultado ? 'Você acertou essa Questão em:' : 'Você errou essa Questão em'}
                                            &nbsp;
                                            {resultados[question.ids]?.data
                                                ? new Date(resultados[question.ids]?.data).toLocaleString('pt-BR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit',
                                                    hour12: false
                                                })
                                                : 'Data inválida'}
                                            &nbsp;
                                        </p>

                                    </div>
                                )}
                                <p
                                    className="enunciado"
                                    style={{
                                        fontSize: `${fontSize}em`,
                                        fontWeight: "normal",
                                        fontFamily: "Poppins",
                                        textAlign: "left",
                                        marginLeft: "0.7em",
                                        marginRight: "0.7em",
                                        whiteSpace: "pre-line",
                                        justifyContent: "flex-start",
                                        overflowX: 'auto',

                                    }}
                                    dangerouslySetInnerHTML={{ __html: question.enunciado }}
                                ></p>
                                <QuestaoResposta
                                    question={question}
                                    alternativaSelecionada={alternativaSelecionada}
                                    alternativasRiscadasPorQuestao={alternativasRiscadasPorQuestao}
                                    handleAlternativaClick={handleAlternativaClick}
                                    handleRiscarAlternativa={handleRiscarAlternativa}
                                    paymentInfo={paymentInfo}
                                    cliques={cliques}
                                    feedbackLocal={feedbackLocal}
                                    handleRespostaClick={handleRespostaClick}
                                    fontSize={fontSize}
                                />
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    color: '#1c5253',
                                    alignItems: 'flex-start',
                                    overflowX: 'auto',
                                    maxWidth: '100%',
                                    justifyContent: 'flex-start',
                                  
                                }}
                            >
                                <ComentariosQuestao
                                    question={question}
                                    toggleComentario={toggleComentario}
                                    paymentInfo={paymentInfo}
                                    fontSize={fontSize}
                                />
                            </Box>
                            <Box className="linha-horizontal-comentario"></Box>
                            <Grid2
                                className="campo-comentario"
                                container
                                direction="column"
                                sx={{
                                    overflowX: 'auto',
                                }}
                            >
                                <Box
                                    sx={{
                                        paddingBottom: '2em',
                                        marginTop: '3em',
                                        marginBottom: '3em',
                                        backgroundColor: 'transparent',
                                    }}
                                    className={comentariosVisiveis[question.ids] ? 'comentario visivel' : 'comentarios'}
                                >
                                    <Comentarios question={question} db={db} user={user} />
                                </Box>
                                <p
                                    className={comentariosVisiveis[question.ids] ? 'comentario visivel' : 'comentario'}
                                    style={{ overflowX: 'auto' }}
                                >
                                    {question.comentario}
                                </p>
                            </Grid2>
                        </div>
                    ))}
                    {paymentInfo === null && (
                        <Box sx={{ maxWidth: 400 }}>
                            <Card variant="outlined">{card}</Card>
                        </Box>
                    )}
                    <Pagination
                        handlePageChange={handlePageChange}
                        paginaAtual={paginaAtual}
                        totalPages={totalPages}
                    />
                </Box>
            </Container>

        </Box>

    );
}

export default Questao;
