import React, { useEffect, useState } from "react";
import "./RankingDesempenho.css";
import { Container, Box, Typography, Button, Paper, List, ListItem, ListItemText, Avatar, Divider } from "@mui/material";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../firebase";

function RankingDesempenho() {
    const [usersWithPerformance, setUsersWithPerformance] = useState([]);
    const [critérioClassificação, setCritérioClassificação] = useState("acertos");
    const [direçãoClassificação, setDireçãoClassificação] = useState("desc");


    useEffect(() => {
        const fetchUsersWithPerformance = async () => {
            try {
                const usersSnapshot = await getDocs(collection(db, "users"));
                const usersData = [];

                for (const userDoc of usersSnapshot.docs) {
                    const userData = userDoc.data();
                    if (userData.desempenhoTotal && userData.desempenhoTotal.acertos >= 20) {
                        usersData.push({
                            id: userDoc.id,
                            displayName: userData.displayName,
                            desempenhoTotal: userData.desempenhoTotal,
                        });
                    }
                }
                usersData.sort((a, b) => {
                    if (b.desempenhoTotal.acertos !== a.desempenhoTotal.acertos) {
                        return b.desempenhoTotal.acertos - a.desempenhoTotal.acertos;
                    }
                    return a.desempenhoTotal.erros - b.desempenhoTotal.erros;
                });

                setUsersWithPerformance(usersData);
            } catch (error) {
                console.error("Erro ao buscar usuários com desempenho:", error);
            }
        };

        fetchUsersWithPerformance();
    }, [db]);

    const calculatePercentage = (acertos, erros) => {
        if (acertos >= 10) {
            const totalQuestoes = acertos + erros;
            if (totalQuestoes === 0) {
                return 0;
            }
            return ((acertos / totalQuestoes) * 100).toFixed(2);
        } else {
            return null;
        }
    };

    const classificarUsuários = (critério, direção) => {
        const usuáriosClassificados = [...usersWithPerformance];
        usuáriosClassificados.sort((a, b) => {
            if (critério === "acertos") {
                return direção === "asc" ? a.desempenhoTotal.acertos - b.desempenhoTotal.acertos : b.desempenhoTotal.acertos - a.desempenhoTotal.acertos;
            } else if (critério === "erros") {
                return direção === "asc" ? a.desempenhoTotal.erros - b.desempenhoTotal.erros : b.desempenhoTotal.erros - a.desempenhoTotal.erros;
            } else if (critério === "porcentagem") {
                const porcentagemA = (a.desempenhoTotal.acertos / (a.desempenhoTotal.acertos + a.desempenhoTotal.erros)) || 0;
                const porcentagemB = (b.desempenhoTotal.acertos / (b.desempenhoTotal.acertos + b.desempenhoTotal.erros)) || 0;
                return direção === "asc" ? porcentagemA - porcentagemB : porcentagemB - porcentagemA;
            }
            return 0;
        });

        setUsersWithPerformance(usuáriosClassificados);
    };
    useEffect(() => {
        classificarUsuários(critérioClassificação, direçãoClassificação);
    }, [critérioClassificação, direçãoClassificação]);


    return (
        <Container className="ContainerTotal">
            <Box mt={4} mb={4}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", fontFamily: "Poppins", color: "white", textAlign: "center", marginBottom: "1em" }}>
                    Ranking de Desempenho - SESO em Concursos
                </Typography>

                <Box className="botões-filtro" >
                    <Button sx={{ marginRight: '1em', background: "linear-gradient(180deg, #1c5253 0%, #1a3e40 100%)", color: "white", fontWeight: "600", fontFamily: "Poppins", borderColor: 'white', }} variant="outlined" onClick={() => { setCritérioClassificação("acertos"); setDireçãoClassificação("desc"); }}>Mais Acertos</Button>
                    <Button sx={{ marginRight: '1em', background: "linear-gradient(180deg, #1c5253 0%, #1a3e40 100%)", color: "white", fontWeight: "600", fontFamily: "Poppins", borderColor: 'white' }} variant="outlined" onClick={() => { setCritérioClassificação("erros"); setDireçãoClassificação("desc"); }}>Mais Erros</Button>
                    <Button sx={{ marginRight: '1em', background: "linear-gradient(180deg, #1c5253 0%, #1a3e40 100%)", color: "white", fontWeight: "600", fontFamily: "Poppins", borderColor: 'white' }} variant="outlined" onClick={() => { setCritérioClassificação("porcentagem"); setDireçãoClassificação("desc"); }}>Maior Porcentagem</Button>
                </Box>
                <Paper elevation={3} sx={{ background: "linear-gradient(180deg, #1c5253 0%, #1a3e40 100%)" }}>
                    <List>
                        {usersWithPerformance.slice(0, 50).map((usuário, índice) => (
                            <div key={usuário.id}>
                                <ListItem sx={{ padding: "0.500em", display: "flex", alignItems: "center" }}>
                                    <Avatar sx={{ marginRight: "1em", marginLeft: "0.500em", backgroundColor: "#1c5253" }}>{índice + 1}</Avatar>
                                    <ListItemText>
                                        <Typography variant="subtitle1" sx={{ fontFamily: "Poppins", color: "white" }}>
                                            {usuário.displayName}
                                        </Typography>
                                        <div>
                                            <Typography variant="body2" sx={{ fontWeight: "bold", color: "#00a86b" }}>
                                                <span style={{ marginRight: "0.25em" }}>✓</span> {usuário.desempenhoTotal.acertos} Questões Corretas!
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: "bold", color: "#FF0000" }}>
                                                <span style={{ marginRight: "0.25em" }}>✗</span> {usuário.desempenhoTotal.erros} Erradas.
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: "bold", color: "#007BFF" }}>
                                                {calculatePercentage(usuário.desempenhoTotal.acertos, usuário.desempenhoTotal.erros)}% de Acertos.
                                            </Typography>
                                        </div>
                                    </ListItemText>
                                </ListItem>
                                {índice < usersWithPerformance.length - 1 && <Divider />}
                            </div>
                        ))}
                    </List>
                </Paper>
            </Box>
        </Container>
    )
}

export default RankingDesempenho;