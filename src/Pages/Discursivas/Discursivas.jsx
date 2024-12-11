import React, { useEffect, useState } from "react";
import HeaderMain from "../../components/Header/HeaderMain";
import {
    Box, Typography,
    Button, Container, Modal, Table,
    TableContainer, TableRow, TableBody,
    TableCell, Paper, MenuItem, IconButton
} from "@mui/material";
import { getAuth } from "firebase/auth";
import { useUser } from "../../Context/UserContext";
import { db } from "../../firebase";
import { getDocs, collection, limit, query } from "firebase/firestore";
import { useMediaQuery } from '@mui/material';
import Select from "@mui/material/Select";
import LockIcon from '@mui/icons-material/Lock';
import Cronometro from "../../components/Cronometro/Cronometro";
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import RDiscursivas from "../../components/RDiscursivas/RDiscursivas";

function Discursivas() {
    const { paymentInfo } = useUser();
    const [user, setUser] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const isMobile = useMediaQuery('(max-width: 600px)');
    const [questoesPorPagina, setQuestoesPorPagina] = useState(5);
    const [questions, setQuestions] = useState([]);
    const indiceInicial = (paginaAtual - 1) * questoesPorPagina;
    const [comentariosVisiveis, setComentariosVisiveis] = useState({});

    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (currentUser) {
            setUser(currentUser);
        }
    }, []);

    const customPages = [
        { name: 'Questoes', path: '/' },
        { name: 'Meu Desempenho', path: '/MeuPerfil' },
        { name: 'Ranking', path: '/RankingDesempenho' },
        { name: 'Assinar com Cartão', path: '/Assinatura' },
        { name: 'Assinar com Pix', path: '/AssinarPIX' },
    ];

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const modalStyle = {
        display: modalOpen ? "flex" : "none",
        justifyContent: "center",
        alignItems: "center",
    };

    const handleCheckout = async () => {
        <>
            Ola mundo!
        </>
    };

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    useEffect(() => {
        const questionsCollectionRef = collection(db, "discursivas");
        const queryWithLimit = query(questionsCollectionRef, limit(500));

        const getQuestions = async () => {
            const data = await getDocs(queryWithLimit);
            setQuestions(
                shuffleArray(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            );
        };
        getQuestions();
    }, []);

    const questoesPagina = questions.slice(
        indiceInicial,
        indiceInicial + questoesPorPagina
    );

    const toggleComentario = (questionId) => {
        setComentariosVisiveis((prevVisiveis) => ({
            ...prevVisiveis,
            [questionId]: !prevVisiveis[questionId],
        }));
    };

    const totalPages = Math.ceil(questions.length / questoesPorPagina);

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

    return (
        <div className="Home">
            <HeaderMain pages={customPages} />
            <Box sx={{ justifyContent: 'center' }}>
                <Typography sx={{ fontSize: '1em', fontWeight: 'bold', fontFamily: 'Poppins', textAlign: "center", paddingTop: '0.400em', color: "#1c5253" }}>
                    DISCURSIVAS
                </Typography>
                {paymentInfo === null ? (
                    <div>
                        <p><br></br></p>
                    </div>
                ) : (
                    <>
                        <Typography sx={{ fontSize: '1em', fontWeight: 'bold', fontFamily: 'Poppins', textAlign: "center", paddingTop: '0.400em', color: "#1c5253" }}>
                            NO VÍDEO ABAIXO VEJA COMO ESTUDAR DISCURSIVAS PARA CONCURSOS
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '1em',
                            }}
                        >

                            <iframe
                                width="854"
                                height="480"
                                src="https://www.youtube.com/embed/uX-Xk86d_l0?si=K42ykJb0NM-VPIuF"
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </Box>
                        <Box sx={{ justifyContent: 'center', display: 'flex' }}>

                            <a href="https://docs.google.com/document/d/11igAxtM4AKYgi-jYn6ISTEAte1kLz5CFKT5tyGjZ0h0/edit?usp=sharing" target="_blank" rel="noopener noreferrer">
                                <Button>Toque aqui para acessar o texto com comando</Button>
                            </a>
                        </Box>
                    </>
                )}
            </Box>
            <Container className="fundo-Home">
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
                                backgroundColor: "#f4f4f4",
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
                                                <Button variant="contained" onClick={handleCheckout}>
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
                                                <Button variant="contained" onClick={handleCheckout}>
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
                <Box sx={{
                    marginTop: '2em', display: 'flex',
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
                    <Cronometro />
                </Box>
                <div>
                    {paymentInfo === true ? (
                        <div>
                            <p>Questões dicursivas exclusivas para Assinantes. <br></br>Assine para Responder.</p>
                            <IconButton disabled>
                                <LockIcon />
                            </IconButton>
                        </div>
                    ) : (
                        <>
                            {questoesPagina.map((question) => (
                                <div key={question.id} className="question-container">
                                    <Box className="cabecalho-disciplina">
                                        <p>
                                            ID: {question.ids}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            {question.disciplina}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            {question.assunto}
                                        </p>
                                    </Box>
                                    <Box className="cabecalho-orgao">
                                        <p>
                                            <span style={{ color: "black" }}>Banca:</span> &nbsp;{question.banca}
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "black" }}>Ano:</span> &nbsp;{question.ano}
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "black" }}>Cargo: </span>&nbsp;{question.cargo}
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        </p>
                                        <p><span style={{ color: "black" }}>Órgão: </span>&nbsp;  {question.concurso}</p>
                                    </Box>
                                    <p className="enunciado">{question.enunciado}</p>



                                    <IconButton sx={{ color: "#1c5253", }}
                                        className="button-comentario"
                                        onClick={() => toggleComentario(question.ids)}
                                    >
                                        {" "}
                                        <QuestionAnswerOutlinedIcon fontSize="small" sx={{ color: "#1c5253", backgroundColor: 'transparent' }} />
                                        <Typography sx={{ fontSize: '0.550em', color: "#1c5253", marginLeft: '0.500em', fontFamily: 'Poppins', fontWeight: '500' }} color="error">Responder/Respostas
                                        </Typography>
                                    </IconButton>


                                    <Container className="linha-horizontal-comentario"></Container>

                                    <Container
                                        className="campo-comentario"
                                        style={{
                                            overflowX: "auto",
                                        }}
                                    >

                                        <Box sx={{ paddingBottom: '2em', marginTop: '3em', marginBottom: '3em', backgroundColor: 'transparent' }} className={
                                            comentariosVisiveis[question.ids]
                                                ? "comentario visivel"
                                                : "comentarios"
                                        } >
                                            <RDiscursivas question={question} db={db} user={user} />
                                        </Box>
                                    </Container>
                                </div>
                            ))}
                            <Box className="pagination">
                                <button onClick={handlePreviousPage} disabled={paginaAtual === 1}>
                                    Página Anterior
                                </button>
                                <span>
                                    {paginaAtual} de {totalPages}
                                </span>
                                <button
                                    onClick={handleNextPage}
                                >
                                    Próxima Página
                                </button>
                            </Box>
                        </>
                    )}
                </div>
                <Box className="Rodapé">
                    <Box className="Box-Rodapé2"></Box>

                    <Box className="Box-Rodapé1">
                        <p className="Texto-Rodapé1">© 2023 - SESO em Concursos</p>
                    </Box>
                </Box>
            </Container>


        </div>
    )
}

export default Discursivas;