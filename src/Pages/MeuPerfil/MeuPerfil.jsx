import React, { useEffect, useState } from "react";
import { Container, Box, IconButton, Typography, Button, Snackbar, MenuItem } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import "./MeuPerfil.css";
import { getAuth } from "firebase/auth";
import { useUser } from "../../Context/UserContext";
import Chart from "react-google-charts";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import RefreshIcon from '@mui/icons-material/Refresh';
import Select from '@mui/material/Select';

function MeuPerfil() {
    const { user, displayName, } = useUser();
    const [photoURL, setPhotoURL] = useState("");
    const [email, setEmail] = useState("");
    const [desempenhoTotal, setDesempenhoTotal] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [disciplinaSelecionada, setDisciplinaSelecionada] = useState("");
    const [desempenhoPorDisciplina, setDesempenhoPorDisciplina] = useState({});
    const [desempenhoPorBanca, setDesempenhoPorBanca] = useState({});
    const [bancaSelecionada, setBancaSelecionada] = useState("");


    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (currentUser) {
            setEmail(currentUser.email);
            setPhotoURL(currentUser.photoURL);
        }
    }, []);

    const fetchDesempenhoTotal = async (userId) => {
        try {
            const userRef = doc(db, "users", userId);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const desempenhoTotal = userData.desempenhoTotal;
                return desempenhoTotal;
            } else {
                return null;
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

    const totalQuestoesRespondidas =
        (desempenhoTotal?.acertos || 0) + (desempenhoTotal?.erros || 0)


    const handleZerarDesempenhoTotal = () => {
        setShowAlert(true);
    };

    const zerarDesempenhoTotal = async () => {
        if (!user) {
            console.log("Usuário não autenticado.");
            return;
        }

        const userRef = doc(db, "users", user.uid);

        try {
            await updateDoc(userRef, { desempenhoTotal: { acertos: 0, erros: 0 } });
            setDesempenhoTotal({ acertos: 0, erros: 0 });
            console.log("Desempenho total zerado com sucesso!");
        } catch (error) {
            console.error("Erro ao zerar o desempenho total:", error);
        }

        setShowAlert(false); // Feche o alerta após a ação ser confirmada
    };

    const cancelarZerarDesempenhoTotal = () => {
        setShowAlert(false);
    };

    useEffect(() => {
        if (desempenhoPorDisciplina) {
            const disciplinas = Object.keys(desempenhoPorDisciplina);
            if (disciplinas.length > 0) {
                setDisciplinaSelecionada(disciplinas[0]);
            }
        }
    }, [desempenhoPorDisciplina]);

    const disciplinaSelecionadaData =
        disciplinaSelecionada && desempenhoPorDisciplina[disciplinaSelecionada];

    useEffect(() => {
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
        fetchDesempenhoPorDisciplina();
    }, [user, db]);

    const zerarDesempenhoPorDisciplina = async () => {
        if (!user) {
            console.log("Usuário não autenticado.");
            return;
        }
        const userRef = doc(db, "users", user.uid);
        if (!disciplinaSelecionada) {
            console.log("Selecione uma disciplina para zerar o desempenho.");
            return;
        }

        try {
            const desempenhoZerado = { ...desempenhoPorDisciplina };
            delete desempenhoZerado[disciplinaSelecionada];
            await updateDoc(userRef, { desempenhoPorDisciplina: desempenhoZerado });
            setDesempenhoPorDisciplina(desempenhoZerado);
        } catch (error) {
            console.error(`Erro ao zerar o desempenho da disciplina ${disciplinaSelecionada}:`, error);
        }
    };

    useEffect(() => {
        if (desempenhoPorBanca) {
            const bancas = Object.keys(desempenhoPorBanca);
            if (bancas.length > 0) {
                setBancaSelecionada(bancas[0]);
            }
        }
    }, [desempenhoPorBanca]);


    const bancaSelecionadaData =
        bancaSelecionada && desempenhoPorBanca[bancaSelecionada];

    useEffect(() => {
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
        fetchDesempenhoPorBanca();
    }, [user, db]);


    const zerarDesempenhoPorBanca = async () => {
        if (!user) {
            return;
        }

        const userRef = doc(db, "users", user.uid);

        if (!bancaSelecionada) {
            console.log("Selecione uma banca para zerar o desempenho.");
            return;
        }

        try {
            const desempenhoZerado = { ...desempenhoPorBanca };
            delete desempenhoZerado[bancaSelecionada];

            await updateDoc(userRef, { desempenhoPorBanca: desempenhoZerado });

            setDesempenhoPorBanca(desempenhoZerado);

        } catch (error) {
            console.error(`Erro ao zerar o desempenho da banca ${bancaSelecionada}:`, error);

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
                        height={'300px'}
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
                        }}
                    />
                </div>

            </Box>
            <div style={{ textAlign: 'center' }}>
                <p className="acertos">{totalQuestoesRespondidas} Questões Resolvidas</p>
            </div>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <IconButton
                    onClick={handleZerarDesempenhoTotal} // Adicione o manipulador de clique para mostrar o alerta
                    sx={{ color: "white", justifyContent: "center" }}
                    aria-label="Zerar Desempenho Total"
                >
                    <RefreshIcon /> {/* Use o ícone apropriado */}
                    <Typography variant="body2">Zerar Desempenho Total</Typography>
                </IconButton>
            </Box>
            <Snackbar
                open={showAlert}
                autoHideDuration={7000}
                onClose={cancelarZerarDesempenhoTotal}
                anchorOrigin={{ vertical: "center", horizontal: "center" }}
                sx={{ backgroundColor: "red" }}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={cancelarZerarDesempenhoTotal}
                    severity="warning"
                    sx={{ backgroundColor: "red", color: "white" }} // Defina a cor do texto do Snackbar
                >
                    Deseja zerar o desempenho total?
                    <Button color="inherit" size="small" onClick={zerarDesempenhoTotal}>
                        Confirmar
                    </Button>
                    <Button color="inherit" size="small" onClick={cancelarZerarDesempenhoTotal}>
                        Cancelar
                    </Button>
                </MuiAlert>
            </Snackbar>
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
                                pieHole: 0.4,
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
            <Box sx={{ marginBottom: "1em" }} className="Box-select">
                <p className="disciplinaSelecionada"> Filtre seu Desempenho por Banca:</p>
                <Select className="Select-Desempenho"
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
                                pieHole: 0.4,
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

        </Container >
    )
}

export default MeuPerfil;
