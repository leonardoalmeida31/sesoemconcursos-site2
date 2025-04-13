import React, { useEffect, useState } from "react";
import { Container, Box, IconButton, Typography, Button, Snackbar, MenuItem } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import ApexCharts from "react-apexcharts";
import { getAuth } from "firebase/auth";
import { useUser } from "../../Context/UserContext";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import RefreshIcon from '@mui/icons-material/Refresh';
import Select from '@mui/material/Select';
import HeaderMain from "../../components/Header/HeaderMain";

function MeuPerfil() {
    const { user, displayName } = useUser();
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
                return userData.desempenhoTotal;
            }
            return null;
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
        (desempenhoTotal?.acertos || 0) + (desempenhoTotal?.erros || 0);

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
        setShowAlert(false);
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
    }, [user]);

    const zerarDesempenhoPorDisciplina = async () => {
        if (!user || !disciplinaSelecionada) {
            console.log("Usuário não autenticado ou disciplina não selecionada.");
            return;
        }
        const userRef = doc(db, "users", user.uid);
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
    }, [user]);

    const zerarDesempenhoPorBanca = async () => {
        if (!user || !bancaSelecionada) {
            console.log("Usuário não autenticado ou banca não selecionada.");
            return;
        }
        const userRef = doc(db, "users", user.uid);
        try {
            const desempenhoZerado = { ...desempenhoPorBanca };
            delete desempenhoZerado[bancaSelecionada];
            await updateDoc(userRef, { desempenhoPorBanca: desempenhoZerado });
            setDesempenhoPorBanca(desempenhoZerado);
        } catch (error) {
            console.error(`Erro ao zerar o desempenho da banca ${bancaSelecionada}:`, error);
        }
    };

    // Configurações comuns para os gráficos ApexCharts
    const chartOptions = (title) => ({
        chart: {
            type: "donut",
            animations: {
                enabled: true,
                easing: "easeinout",
                speed: 800,
            },
            toolbar: {
                show: false,
            },
        },
        labels: ["Acertos", "Erros"],
        colors: ["#A3D9B1", "#F28F7A"], // Verde claro e coral para contraste
        title: {
            text: title,
            align: "center",
            style: {
                fontSize: "16px",
                fontWeight: "600",
                color: "#FFFFFF",
                fontFamily: "Poppins, sans-serif",
            },
        },
        dataLabels: {
            enabled: true,
            formatter: (val) => `${Math.round(val)}%`,
            style: {
                fontSize: "12px",
                fontFamily: "Poppins, sans-serif",
                colors: ["#333"],
            },
        },
        legend: {
            position: "bottom",
            fontSize: "12px",
            fontFamily: "Poppins, sans-serif",
            labels: {
                colors: "#FFFFFF",
            },
            markers: {
                width: 12,
                height: 12,
                radius: 12,
            },
        },
        plotOptions: {
            pie: {
                donut: {
                    size: "65%",
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: "Total",
                            fontSize: "14px",
                            fontFamily: "Poppins, sans-serif",
                            color: "#FFFFFF",
                            formatter: () => `${totalQuestoesRespondidas}`,
                        },
                    },
                },
            },
        },
        responsive: [
            {
                breakpoint: 600,
                options: {
                    chart: {
                        height: 250,
                    },
                    title: {
                        style: {
                            fontSize: "14px",
                        },
                    },
                    dataLabels: {
                        style: {
                            fontSize: "10px",
                        },
                    },
                    legend: {
                        fontSize: "10px",
                    },
                },
            },
        ],
    });

    return (

        <Box>
            <Box sx={{marginBottom: '1em'}}>
                <HeaderMain />
            </Box>

            <Container
                sx={{
                    py: { xs: 3, md: 5 },
                    background: "linear-gradient(135deg, #205254 0%, #3B7A7D 50%, #5A9A9F 100%)",
                    minHeight: "100vh",
                    fontFamily: "Poppins, sans-serif",
                }}
            >
                <style>
                    {`
                    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

                    .user-photo {
                        width: 120px;
                        height: 120px;
                        object-fit: cover;
                        border-radius: 50%;
                        border: 4px solid #A3D9B1;
                        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
                        margin-bottom: 1.5rem;
                        transition: transform 0.3s ease;
                    }
                    .user-photo:hover {
                        transform: scale(1.05);
                    }
                    .nome-user2 {
                        font-size: clamp(1rem, 5vw, 1.2rem);
                        color: #FFFFFF;
                        text-align: center;
                        margin: 0.5rem 0;
                        font-weight: 500;
                    }
                    .p-desempenho-geral {
                        font-size: clamp(1.5rem, 6vw, 1.8rem);
                        font-weight: 600;
                        color: #FFFFFF;
                        text-align: center;
                        margin: 2rem 0 1.5rem;
                        letter-spacing: 0.5px;
                        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    }
                    .box-grafico {
                        background: linear-gradient(135deg, #205254 0%, #3B7A7D 50%, #5A9A9F 100%);
                        border-radius: 16px;
                        padding: clamp(1rem, 4vw, 1.5rem);
                        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
                        margin-bottom: 2rem;
                        transition: transform 0.3s ease, box-shadow 0.3s ease;
                    }
                    .box-grafico:hover {
                        transform: translateY(-8px);
                        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
                    }
                    .acertos {
                        font-size: clamp(1rem, 4vw, 1.1rem);
                        color: #264653;
                        text-align: center;
                        margin: 1rem 0;
                        font-weight: 400;
                    }
                    .disciplinaSelecionada {
                        font-size: clamp(1.1rem, 4.5vw, 1.3rem);
                        color: #FFFFFF;
                        margin-bottom: 0.75rem;
                        font-weight: 500;
                        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    }
                    .Select-Desempenho {
                        width: 100%;
                        background: #FFFFFF;
                        border-radius: 10px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                        transition: all 0.3s ease;
                        font-family: 'Poppins', sans-serif;
                    }
                    .Select-Desempenho:hover {
                        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
                    }
                    .refresh-btn {
                        background: linear-gradient(45deg, #A3D9B1, #7CC98D);
                        color: #264653;
                        padding: clamp(0.5rem, 3vw, 0.75rem) clamp(1rem, 4vw, 1.5rem);
                        border-radius: 10px;
                        transition: background 0.3s ease, transform 0.2s ease;
                        font-family: 'Poppins', sans-serif;
                        font-size: clamp(0.9rem, 3.5vw, 1rem);
                    }
                    .refresh-btn:hover {
                        background: linear-gradient(45deg, #8CCB9A, #6AB876);
                        transform: scale(1.05);
                    }
                    .MuiSnackbar-root .MuiAlert-root {
                        background: linear-gradient(45deg, #F28F7A, #F4A261);
                        color: #FFFFFF;
                        border-radius: 12px;
                        font-family: 'Poppins', sans-serif;
                        font-size: clamp(0.9rem, 3.5vw, 1rem);
                    }
                    .MuiButton-root {
                        margin-left: 1rem;
                        color: #FFFFFF;
                        border: 1px solid #FFFFFF;
                        border-radius: 8px;
                        font-family: 'Poppins', sans-serif;
                        font-size: clamp(0.8rem, 3vw, 0.9rem);
                        transition: background 0.3s ease;
                    }
                    .MuiButton-root:hover {
                        background: rgba(255, 255, 255, 0.2);
                    }
                    @media (max-width: 600px) {
                        .user-photo {
                            width: 100px;
                            height: 100px;
                        }
                        .box-grafico {
                            padding: 1rem;
                        }
                        .refresh-btn {
                            padding: 0.5rem 1rem;
                            font-size: 0.9rem;
                        }
                        .p-desempenho-geral {
                            font-size: 1.5rem;
                        }
                    }
                `}
                </style>

                <Box
                    className="box-grafico"
                    sx={{
                        textAlign: "center",
                        py: { xs: 2, md: 3 },
                        px: { xs: 1, md: 2 },
                    }}
                >
                    {photoURL && (
                        <img src={photoURL} alt="Foto do usuário" className="user-photo" />
                    )}
                    <Typography className="nome-user2">Olá, {displayName}</Typography>
                    {email && <Typography className="nome-user2">Email: {email}</Typography>}
                </Box>

                <Typography className="p-desempenho-geral">CONFIRA SEU DESEMPENHO GERAL</Typography>
                <Box className="box-grafico">
                    {desempenhoTotal ? (
                        <ApexCharts
                            options={chartOptions("Desempenho Geral")}
                            series={[desempenhoTotal.acertos || 0, desempenhoTotal.erros || 0]}
                            type="donut"
                            height={300}
                        />
                    ) : (
                        <Typography
                            sx={{ fontFamily: "Poppins, sans-serif", color: "#FFFFFF", textAlign: "center" }}
                        >
                            Carregando gráfico...
                        </Typography>
                    )}
                    <Typography sx={{ color: 'white', textAlign: 'center' }} >{totalQuestoesRespondidas} Questões Resolvidas</Typography>
                    <IconButton
                        className="refresh-btn"
                        onClick={handleZerarDesempenhoTotal}
                        aria-label="Zerar Desempenho Total"
                    >
                        <RefreshIcon />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                            Zerar Desempenho Total
                        </Typography>
                    </IconButton>
                </Box>

                <Snackbar
                    open={showAlert}
                    autoHideDuration={7000}
                    onClose={cancelarZerarDesempenhoTotal}
                    anchorOrigin={{ vertical: "center", horizontal: "center" }}
                >
                    <MuiAlert
                        elevation={6}
                        variant="filled"
                        onClose={cancelarZerarDesempenhoTotal}
                        severity="warning"
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

                <Box className="box-grafico">
                    <Typography className="disciplinaSelecionada">
                        Filtre seu Desempenho por Disciplina:
                    </Typography>
                    <Select
                        className="Select-Desempenho"
                        value={disciplinaSelecionada}
                        onChange={(e) => setDisciplinaSelecionada(e.target.value)}
                        sx={{
                            fontFamily: "Poppins, sans-serif",
                            "& .MuiSelect-select": {
                                py: 1.5,
                            },
                        }}
                    >
                        <MenuItem value={null}>Selecione uma disciplina</MenuItem>
                        {Object.keys(desempenhoPorDisciplina).map((disciplina) => (
                            <MenuItem key={disciplina} value={disciplina}>
                                {disciplina}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>

                {disciplinaSelecionadaData && (
                    <Box className="box-grafico">
                        <ApexCharts
                            options={chartOptions(`Desempenho em ${disciplinaSelecionada}`)}
                            series={[disciplinaSelecionadaData.acertos || 0, disciplinaSelecionadaData.erros || 0]}
                            type="donut"
                            height={300}
                        />
                        <Typography sx={{ color: 'white', textAlign: 'center' }} >
                            Acertos: {disciplinaSelecionadaData.acertos || 0}    Erros:{" "}
                            {disciplinaSelecionadaData.erros || 0}
                        </Typography>
                        <IconButton
                            className="refresh-btn"
                            onClick={zerarDesempenhoPorDisciplina}
                            aria-label="Zerar Desempenho por Disciplina"
                        >
                            <RefreshIcon />
                            <Typography variant="body2" sx={{ ml: 1 }}>
                                Zerar Desempenho Nessa Disciplina
                            </Typography>
                        </IconButton>
                    </Box>
                )}

                <Box className="box-grafico">
                    <Typography className="disciplinaSelecionada">
                        Filtre seu Desempenho por Banca:
                    </Typography>
                    <Select
                        className="Select-Desempenho"
                        value={bancaSelecionada}
                        onChange={(e) => setBancaSelecionada(e.target.value)}
                        sx={{
                            fontFamily: "Poppins, sans-serif",
                            "& .MuiSelect-select": {
                                py: 1.5,
                            },
                        }}
                    >
                        <MenuItem value={null}>Selecione uma banca</MenuItem>
                        {Object.keys(desempenhoPorBanca).map((banca) => (
                            <MenuItem key={banca} value={banca}>
                                {banca}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>

                {bancaSelecionadaData && (
                    <Box className="box-grafico">
                        <ApexCharts
                            options={chartOptions(`Desempenho em ${bancaSelecionada}`)}
                            series={[bancaSelecionadaData.acertos || 0, bancaSelecionadaData.erros || 0]}
                            type="donut"
                            height={300}
                        />
                        <Typography className="acertos">
                            Acertos: {bancaSelecionadaData.acertos || 0}    Erros:{" "}
                            {bancaSelecionadaData.erros || 0}
                        </Typography>
                        <IconButton
                            className="refresh-btn"
                            onClick={zerarDesempenhoPorBanca}
                            aria-label="Zerar Desempenho por Banca"
                        >
                            <RefreshIcon />
                            <Typography variant="body2" sx={{ ml: 1 }}>
                                Zerar Desempenho Nessa Banca
                            </Typography>
                        </IconButton>
                    </Box>
                )}
            </Container>
        </Box>
    );
}

export default MeuPerfil;