import React, { useState, useEffect } from "react";
import HeaderMain from "../../components/Header/HeaderMain";
import { Box, Typography, Container, Modal, Table, TableContainer, TableBody, TableRow, TableCell, Paper, Button, IconButton } from "@mui/material";
import { useUser } from "../../Context/UserContext";
import LockIcon from '@mui/icons-material/Lock';

const customPages = [
    { name: 'Questoes', path: '/' },
    { name: 'Meu Desempenho', path: '/MeuPerfil' },
    { name: 'Ranking', path: '/RankingDesempenho' },
    { name: 'Assinar com Cartão', path: '/Assinatura' },
    { name: 'Assinar com Pix', path: '/AssinarPIX' },
];

function Aulas() {
    const { paymentInfo } = useUser();
    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleCheckout = async () => {
        <>
            Ola mundo!
        </>
    };


    return (
        <div className="Home">
            <HeaderMain pages={customPages} />
            <Box sx={{ justifyContent: 'center' }}>
                <Typography sx={{ fontSize: '1em', fontWeight: 'bold', fontFamily: 'Poppins', textAlign: "center", paddingTop: '0.400em', color: "#1c5253" }}>
                    Página Oficial de Vídeo Aulas do SESO em Concursos
                </Typography>

                {paymentInfo === null ? (
                    <div>
                        <p><br></br></p>
                    </div>
                ) : (
                    <>
                        <Typography sx={{ fontSize: '1em', fontWeight: 'bold', fontFamily: 'Poppins', textAlign: "center", paddingTop: '2em', color: "#1c5253" }}>
                            ESTATUTO DA CRIANÇA E DO ADOLESCENTE:
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
                                src="https://www.youtube.com/embed/RIXOLpIqSQc?start=120"
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>

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
                <div>
                    {paymentInfo === null ? (
                        <div>
                            <p>Aulas exclusivas para Assinantes. <br></br>Assine para Assistir.</p>
                            <IconButton disabled>
                                <LockIcon />
                            </IconButton>
                        </div>
                    ) : (
                        <>

                        </>
                    )}
                </div>


            </Container>
            <Box className="Rodapé">
                <Box className="Box-Rodapé2"></Box>

                <Box className="Box-Rodapé1">
                    <p className="Texto-Rodapé1">© 2023 - SESO em Concursos</p>
                </Box>
            </Box>
        </div>
    )
}

export default Aulas;