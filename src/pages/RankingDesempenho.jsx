import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import "./RankingDesempenho.css";
import { Link } from 'react-router-dom';
import MenuMui from '../MenuMui.jsx';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';


import AutoGraphOutlinedIcon from '@mui/icons-material/AutoGraphOutlined';
import { Box, Container, Typography, List, ListItem, ListItemText, Paper, Divider, Avatar } from "@mui/material";
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



function RankingDesempenho() {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const auth = getAuth(firebaseApp);
    const questionsCollectionRef = collection(db, "users");
    const [user, setUser] = useState(null);

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


    // Calcular o número total de questões respondidas
    const totalQuestoesRespondidas =
        (desempenhoTotal?.acertos || 0) + (desempenhoTotal?.erros || 0);

    const [usersWithPerformance, setUsersWithPerformance] = useState([]);

    useEffect(() => {
        // Recupere os dados dos usuários do Firestore, incluindo o desempenho total
        const fetchUsersWithPerformance = async () => {
            try {
                const usersSnapshot = await getDocs(collection(db, "users"));
                const usersData = [];
    
                for (const userDoc of usersSnapshot.docs) {
                    const userData = userDoc.data();
                    // Certifique-se de que o usuário tem um campo de desempenho total e pelo menos 10 acertos
                    if (userData.desempenhoTotal && userData.desempenhoTotal.acertos >= 20) {
                        usersData.push({
                            id: userDoc.id,
                            displayName: userData.displayName,
                            desempenhoTotal: userData.desempenhoTotal,
                        });
                    }
                }
    
                // Ordene os usuários com base no número de acertos (em ordem decrescente)
                // e, em seguida, no número de erros (em ordem crescente)
                usersData.sort((a, b) => {
                    // Primeiro, compare o número de acertos (em ordem decrescente)
                    if (b.desempenhoTotal.acertos !== a.desempenhoTotal.acertos) {
                        return b.desempenhoTotal.acertos - a.desempenhoTotal.acertos;
                    }
                    // Se o número de acertos for igual, compare o número de erros (em ordem crescente)
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
        if (acertos >= 10) { // Altere 10 para o limite desejado
            const totalQuestoes = acertos + erros;
            if (totalQuestoes === 0) {
                return 0; // Evitar divisão por zero
            }
            return ((acertos / totalQuestoes) * 100).toFixed(2);
        } else {
            return null; // Retornar nulo se o usuário tiver menos de 50 acertos
        }
    };
    


    // Variáveis de estado para critério e direção de classificação
    const [critérioClassificação, setCritérioClassificação] = useState("acertos"); // Classificação padrão por "acertos"
    const [direçãoClassificação, setDireçãoClassificação] = useState("desc"); // Ordem descendente padrão

    // Função para classificar os usuários com base no critério e direção selecionados
const classificarUsuários = (critério, direção) => {
    const usuáriosClassificados = [...usersWithPerformance]; // Use usersWithPerformance em vez de usuariosComDesempenho

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

    // Efeito para reclassificar os usuários quando o critério ou direção de classificação muda
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
                <Button  sx={{ marginRight: '1em', background: "linear-gradient(180deg, #1c5253 0%, #1a3e40 100%)", color: "white", fontWeight: "600", fontFamily: "Poppins",  borderColor: 'white',  }} variant="outlined" onClick={() => { setCritérioClassificação("acertos"); setDireçãoClassificação("desc"); }}>Mais Acertos</Button>
                <Button sx={{ marginRight: '1em', background: "linear-gradient(180deg, #1c5253 0%, #1a3e40 100%)", color: "white", fontWeight: "600", fontFamily: "Poppins",  borderColor: 'white' }}variant="outlined" onClick={() => { setCritérioClassificação("erros"); setDireçãoClassificação("desc"); }}>Mais Erros</Button>
                <Button sx={{ marginRight: '1em', background: "linear-gradient(180deg, #1c5253 0%, #1a3e40 100%)", color: "white", fontWeight: "600", fontFamily: "Poppins",  borderColor: 'white' }} variant="outlined" onClick={() => { setCritérioClassificação("porcentagem"); setDireçãoClassificação("desc"); }}>Maior Porcentagem</Button>
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
    );

}

export default RankingDesempenho;
