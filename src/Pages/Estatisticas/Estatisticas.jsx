import { useState, useEffect } from "react";
import { Box, Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import FiltroMulti from "../../components/Filtros/FiltroMulti";
import { db } from "../../firebase";
import { getAuth } from "firebase/auth";

function Estatisticas() {
    const [user, setUser] = useState(null);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [questoesFiltradas, setQuestoesFiltradas] = useState([]);
    const [questoesPorPagina, setQuestoesPorPagina] = useState(5);
    const totalPages = Math.ceil(questoesFiltradas.length / questoesPorPagina);
    const [questoesPorDisciplina, setQuestoesPorDisciplina] = useState({});
    const [questoesPorAssunto, setQuestoesPorAssunto] = useState({});

    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (currentUser) {
            setUser(currentUser);
        }
    }, []);

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
            <Container>
                <Typography sx={{ fontSize: '0.875em', fontWeight: '400', fontFamily: 'Poppins', textAlign: "center", padding: '1em', paddingTop: '0.400em', color: "#1c5253" }}>
                    A única plataforma de Questões de concursos especializada em Serviço Social
                </Typography>
                <FiltroMulti onFilterChange={setQuestoesFiltradas} setPaginaAtual={setPaginaAtual} db={db} />
            </Container>
            <Container sx={{ padding: '0em', maxWidth: 'false' }} className="fundo-Home">
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
            </Container>

            {Object.keys(questoesPorDisciplina).length > 0 && (
                <Container>
                    <Typography variant="h6" sx={{ marginBottom: '1em' }}>Estatísticas por Disciplina:</Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Disciplina</TableCell>
                                    <TableCell align="right">Quantidade</TableCell>
                                    <TableCell align="right">Percentual</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.entries(questoesPorDisciplina).map(([disciplina, count]) => (
                                    <TableRow key={disciplina}>
                                        <TableCell>{disciplina}</TableCell>
                                        <TableCell align="right">{count}</TableCell>
                                        <TableCell align="right">{((count / questoesFiltradas.length) * 100).toFixed(2)}%</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
            )}

            {Object.keys(questoesPorAssunto).length > 0 && (
                <Container>
                    <Typography variant="h6" sx={{ marginBottom: '1em' }}>Estatísticas por Assunto:</Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Assunto</TableCell>
                                    <TableCell align="right">Quantidade</TableCell>
                                    <TableCell align="right">Percentual</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.entries(questoesPorAssunto).map(([assunto, count]) => (
                                    <TableRow key={assunto}>
                                        <TableCell>{assunto}</TableCell>
                                        <TableCell align="right">{count}</TableCell>
                                        <TableCell align="right">{((count / questoesFiltradas.length) * 100).toFixed(2)}%</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
            )}
        </Box>
    );
}

export default Estatisticas;
