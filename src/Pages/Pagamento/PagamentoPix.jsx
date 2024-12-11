import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Container, Grid, Typography, Paper, IconButton, Button, Box, Dialog, DialogActions, DialogTitle, DialogContent } from "@mui/material"
import VerifiedTwoToneIcon from '@mui/icons-material/VerifiedTwoTone';
import { useUser } from "../../Context/UserContext";
import { auth, db } from "../../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { getAuth } from "firebase/auth";

function PagamentoPix() {
    const [qrCode1, setQrCode1] = useState(null);
    const [qrCodeBase641, setQrCodeBase641] = useState(null);
    const [paymentStatus1, setPaymentStatus1] = useState('');
    const [paymentId1, setPaymentId1] = useState(null);

    const [qrCode2, setQrCode2] = useState(null);
    const [qrCodeBase642, setQrCodeBase642] = useState(null);
    const [paymentStatus2, setPaymentStatus2] = useState('');
    const [paymentId2, setPaymentId2] = useState(null);

    const [user, setUser] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (currentUser) {
            setUser(currentUser);
        }
    }, []);



    const createPixPayment = async (amount, planName) => {
        try {
            const response = await axios.post('https://api-seso-em-dados.vercel.app/create_pix_payment', {
                transaction_amount: amount,
                description: `Assinatura do plano ${planName} no SESO em Concursos - R$ ${amount}`,
                payer: {
                    email: user.email
                }
            });

            if (amount === 60.00) {
                setQrCode1(response.data.qrCode);
                setQrCodeBase641(response.data.qrCodeBase64);
                setPaymentId1(response.data.payment.id);
                setPaymentStatus1('Aguardando pagamento...');
            } else {
                setQrCode2(response.data.qrCode);
                setQrCodeBase642(response.data.qrCodeBase64);
                setPaymentId2(response.data.payment.id);
                setPaymentStatus2('Aguardando pagamento...');
            }
        } catch (error) {
            console.error('Erro ao criar pagamento Pix:', error);
            if (amount === 60.00) {
                setPaymentStatus1('Erro ao criar pagamento.');
            } else {
                setPaymentStatus2('Erro ao criar pagamento.');
            }
        }
    };

    const checkPaymentStatus = async (paymentId, setPaymentStatus, updateAmount) => {
        if (!paymentId) return;

        try {
            const response = await axios.get(`https://api-seso-em-dados.vercel.app/check_payment_status?payment_id=${paymentId}`);
            const status = response.data.status;
            if (status === 'approved') {
                setPaymentStatus('Pagamento confirmado!');
                setOpenDialog(true);
                await updatePaymentInfo(updateAmount);
            } else {
                setPaymentStatus('Aguardando pagamento...');
            }
        } catch (error) {
            console.error('Erro ao verificar status do pagamento:', error);
        }
    };

    const updatePaymentInfo = async (amount) => {
        if (!user) return;
        try {
            const vencimentoPix = new Date();
            const expirationDays = amount === 60.00 ? 180 : 365;
            vencimentoPix.setDate(vencimentoPix.getDate() + expirationDays);

            const formattedDate = vencimentoPix.toLocaleDateString("pt-BR", {
                day: "2-digit", 
                month: "long", 
                year: "numeric"
            });
            const formattedTime = vencimentoPix.toLocaleTimeString("pt-BR", {
                hour: "2-digit", 
                minute: "2-digit", 
                second: "2-digit", 
                hour12: false, 
                timeZone: 'America/Sao_Paulo'
            });

            const formattedExpirationDate = `${formattedDate} às ${formattedTime} UTC-3`;

            if (amount === 60.00) {
                vencimentoPix.setDate(vencimentoPix.getDate() + 180);
            } else if (amount === 110.00) {
                vencimentoPix.setDate(vencimentoPix.getDate() + 365);
            }

            const token = generateToken();

            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, {
                paymentInfo: {
                    amountPaid: amount,
                    token: token
                },
                vencimentoPix: formattedExpirationDate,
                expirationDate: vencimentoPix.toISOString()
            });
        } catch (error) {
            console.error('Erro ao atualizar informações de pagamento no Firestore:', error);
        }
    };


    const generateToken = () => {
        return 'TOKEN-' + Math.random().toString(36).substr(2, 9);
    };



    useEffect(() => {
        const intervalId1 = setInterval(() => {
            checkPaymentStatus(paymentId1, setPaymentStatus1, 1);
        }, 5000);

        const intervalId2 = setInterval(() => {
            checkPaymentStatus(paymentId2, setPaymentStatus2, 2);
        }, 5000);

        return () => {
            clearInterval(intervalId1);
            clearInterval(intervalId2);
        }
    }, [paymentId1, paymentId2]);

    useEffect(() => {
        if (openDialog) {
            const timer = setTimeout(() => {
                navigate('/');
            }, 10000);

            return () => clearTimeout(timer);
        }
    }, [openDialog, navigate]);



    return (
        <Container maxWidth="xl" sx={{ backgroundColor: '#EEF2F2', padding: '1em', borderRadius: '15px', height: '100%' }}>
            <Grid item xs={12} sm={12} sx={{
                fontFamily: 'Poppins', textAlign: 'center', color: 'white', padding: '0.5em', background: 'radial-gradient(circle, #2e5457, #2f5659, #182828)', borderRadius: '7px', width: { xs: '100%', md: '84%' }, margin: '0 auto', justifyContent: 'center'
            }}
            >
                <Typography sx={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: '2em', textAlign: 'center', color: 'white', padding: '0.3em', background: 'radial-gradient(circle, #2e5457,  #2f5659, #182828 )', }}>
                    ASSINATURA POR PIX
                </Typography>

                <Typography sx={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: '1em', textAlign: 'center', color: 'white', padding: '0.3em', background: 'radial-gradient(circle, #2e5457,  #2f5659, #182828 )', }}>
                    Assinando por PIX você ganha desconto e praticidade na sua assinatura. Confira abaixo os nossos planos:
                </Typography>
            </Grid>
            <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
                <Grid item xs={12} sm={5}>
                    <Paper elevation={3} sx={{ padding: 4, borderRadius: '15px', alignItems: 'center', background: 'radial-gradient(circle, #2e5457, #2c5254, #2f5659, #182828 )', }}>
                        <Typography sx={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: '1.5em', textAlign: 'center', color: 'white' }}>
                            PLANO SEMESTRAL SESO EM CONCURSOS
                        </Typography>
                        <Typography sx={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: '3em', textAlign: 'center', color: 'white', padding: '0.3em' }}>
                            R$ 60,00
                        </Typography>
                        <Typography sx={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: '1.5em', textAlign: 'center', color: 'white', padding: '0.3em', background: 'radial-gradient(circle, #2e5457,  #2f5659, #182828 )', borderRadius: '7px', marginBottom: '0.5em', marginRight: '2em', marginLeft: '2em', justifyContent: 'center', display: 'flex' }}>
                            PLANO MAIS POPULAR
                        </Typography>
                        <IconButton>
                            <Typography sx={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: '0.8em', textAlign: 'left', color: 'white' }}> <VerifiedTwoToneIcon sx={{ color: '#1AAE6D', fontSize: '1em', marginRight: '0.3em' }} />
                                Estude com Questões Ilimitadas
                            </Typography>
                        </IconButton>
                        <IconButton>
                            <Typography sx={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: '0.8em', textAlign: 'left', color: 'white' }}> <VerifiedTwoToneIcon sx={{ color: '#1AAE6D', fontSize: '1em', marginRight: '0.3em' }} />
                                Mais de 4 mil questões comentadas por Assistentes Sociais
                            </Typography>
                        </IconButton>

                        <IconButton>
                            <Typography sx={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: '0.8em', textAlign: 'left', color: 'white' }}> <VerifiedTwoToneIcon sx={{ color: '#1AAE6D', fontSize: '1em', marginRight: '0.3em' }} />
                                Centenas de Questões Discursivas/Dissertativas
                            </Typography>
                        </IconButton>

                        <IconButton>
                            <Typography sx={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: '0.8em', textAlign: 'left', color: 'white' }}> <VerifiedTwoToneIcon sx={{ color: '#1AAE6D', fontSize: '1em', marginRight: '0.3em' }} />
                                Acompanhe seu desempenho com Ciência de Dados
                            </Typography>
                        </IconButton>

                        <IconButton>
                            <Typography sx={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: '0.8em', textAlign: 'left', color: 'white' }}> <VerifiedTwoToneIcon sx={{ color: '#1AAE6D', fontSize: '1em', marginRight: '0.3em' }} />
                                Filtros Personalizados para o seu Concurso
                            </Typography>
                        </IconButton>

                        <IconButton>
                            <Typography sx={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: '0.8em', textAlign: 'left', color: 'white' }}> <VerifiedTwoToneIcon sx={{ color: '#1AAE6D', fontSize: '1em', marginRight: '0.3em' }} />
                                Uma aula de Mentoria Liberada
                            </Typography>
                        </IconButton>

                        <IconButton>
                            <Typography sx={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: '0.8em', textAlign: 'left', color: 'white' }}> <VerifiedTwoToneIcon sx={{ color: '#1AAE6D', fontSize: '1em', marginRight: '0.3em' }} />
                                Analise suas estatísticas de desempenho
                            </Typography>
                        </IconButton>

                        <IconButton>
                            <Typography sx={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: '0.8em', textAlign: 'left', color: 'white' }}> <VerifiedTwoToneIcon sx={{ color: '#1AAE6D', fontSize: '1em', marginRight: '0.3em' }} />
                                Assinatura Válida por 06 meses
                            </Typography>
                        </IconButton>

                        <IconButton>
                            <Typography sx={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: '0.8em', textAlign: 'left', color: 'white' }}> <VerifiedTwoToneIcon sx={{ color: '#1AAE6D', fontSize: '1em', marginRight: '0.3em' }} />
                                Suporte no WhatsApp com Assistente Social para tirar dúvidas
                            </Typography>
                        </IconButton>

                        <Grid sx={{ justifyContent: 'center', textAlign: 'center', }}>
                            <Button sx={{ padding: '1em 3em', marginTop: '1em', fontWeight: '600', backgroundColor: '#1AAE6D' }} variant="contained" color="primary" onClick={() => createPixPayment(60.00, "Semestral SESO em Concursos")}>
                                Assinar Plano Semestral
                            </Button>
                            {qrCode1 && (
                                <Box mt={2}>
                                    <Typography sx={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: '1em', textAlign: 'center', color: 'white', padding: '0.5em' }}>ESCANEIE O QR CODE ABAIXO<br />E REALIZE O PAGAMENTO</Typography>
                                    <Box component="img" src={`data:image/png;base64,${qrCodeBase641}`} alt="QR Code Plano Básico" sx={{ width: '300px', height: '300px' }} />
                                    <Typography sx={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: '1em', textAlign: 'center', color: 'white', padding: '0.5em' }}>Ou copie o código abaixo:</Typography>
                                    <Paper sx={{ padding: '1em', borderRadius: '5px', backgroundColor: '#f5f5f5', textAlign: 'center' }}>
                                        <Typography sx={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: '0.9em', color: 'black', wordBreak: 'break-all' }}>
                                            {qrCode1} {/* Certifique-se de que você está usando o código correto */}
                                        </Typography>
                                        <Button variant="contained" sx={{ marginTop: '1em' }} onClick={() => navigator.clipboard.writeText(qrCode1)}>
                                            Copiar Código
                                        </Button>
                                    </Paper>
                                </Box>
                            )}

                            {paymentStatus1 && <Typography variant="body1">{paymentStatus1}</Typography>}

                        </Grid>

                    </Paper>

                </Grid>
                <Grid item xs={12} sm={5} sx={{}}>
                    <Paper elevation={3} sx={{ padding: 4, borderRadius: '15px', alignItems: 'center', background: 'radial-gradient(circle, #2e5457, #2c5254, #2f5659, #182828 )', }}>
                        <Typography sx={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: '1.5em', textAlign: 'center', color: 'white' }}>
                            PLANO ANUAL SESO EM CONCURSOS
                        </Typography>
                        <Typography sx={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: '3em', textAlign: 'center', color: 'white', padding: '0.3em' }}>
                            R$ 110,00
                        </Typography>
                        <Typography sx={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: '1.5em', textAlign: 'center', color: 'white', padding: '0.3em', background: 'radial-gradient(circle, #2e5457,  #2f5659, #182828 )', borderRadius: '7px', marginBottom: '0.5em', marginRight: '2em', marginLeft: '2em', justifyContent: 'center', display: 'flex' }}>
                            PLANO C/ MAIOR DESCONTO
                        </Typography>
                        <IconButton>
                            <Typography sx={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: '0.8em', textAlign: 'left', color: 'white' }}> <VerifiedTwoToneIcon sx={{ color: '#1AAE6D', fontSize: '1em', marginRight: '0.3em' }} />
                                Estude com Questões Ilimitadas
                            </Typography>
                        </IconButton>
                        <IconButton>
                            <Typography sx={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: '0.8em', textAlign: 'left', color: 'white' }}> <VerifiedTwoToneIcon sx={{ color: '#1AAE6D', fontSize: '1em', marginRight: '0.3em' }} />
                                Mais de 4 mil questões comentadas por Assistentes Sociais
                            </Typography>
                        </IconButton>

                        <IconButton>
                            <Typography sx={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: '0.8em', textAlign: 'left', color: 'white' }}> <VerifiedTwoToneIcon sx={{ color: '#1AAE6D', fontSize: '1em', marginRight: '0.3em' }} />
                                Centenas de Questões Discursivas/Dissertativas
                            </Typography>
                        </IconButton>

                        <IconButton>
                            <Typography sx={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: '0.8em', textAlign: 'left', color: 'white' }}> <VerifiedTwoToneIcon sx={{ color: '#1AAE6D', fontSize: '1em', marginRight: '0.3em' }} />
                                Acompanhe seu desempenho com Ciência de Dados
                            </Typography>
                        </IconButton>

                        <IconButton>
                            <Typography sx={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: '0.8em', textAlign: 'left', color: 'white' }}> <VerifiedTwoToneIcon sx={{ color: '#1AAE6D', fontSize: '1em', marginRight: '0.3em' }} />
                                Filtros Personalizados para o seu Concurso
                            </Typography>
                        </IconButton>

                        <IconButton>
                            <Typography sx={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: '0.8em', textAlign: 'left', color: 'white' }}> <VerifiedTwoToneIcon sx={{ color: '#1AAE6D', fontSize: '1em', marginRight: '0.3em' }} />
                                Duas aulas de Mentoria Liberada
                            </Typography>
                        </IconButton>

                        <IconButton>
                            <Typography sx={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: '0.8em', textAlign: 'left', color: 'white' }}> <VerifiedTwoToneIcon sx={{ color: '#1AAE6D', fontSize: '1em', marginRight: '0.3em' }} />
                                Analise suas estatísticas de desempenho
                            </Typography>
                        </IconButton>

                        <IconButton>
                            <Typography sx={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: '0.8em', textAlign: 'left', color: 'white' }}> <VerifiedTwoToneIcon sx={{ color: '#1AAE6D', fontSize: '1em', marginRight: '0.3em' }} />
                                Assinatura Válida por 12 meses
                            </Typography>
                        </IconButton>

                        <IconButton>
                            <Typography sx={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: '0.8em', textAlign: 'left', color: 'white' }}> <VerifiedTwoToneIcon sx={{ color: '#1AAE6D', fontSize: '1em', marginRight: '0.3em' }} />
                                Suporte no WhatsApp com Assistente Social para tirar dúvidas
                            </Typography>
                        </IconButton>

                        <Grid sx={{ justifyContent: 'center', textAlign: 'center', }}>
                            <Button sx={{ padding: '1em 3em', marginTop: '1em', fontWeight: '600', backgroundColor: '#1AAE6D' }} variant="contained" color="secondary" onClick={() => createPixPayment(110.00, "Anual SESO em Concursos")}>
                                Assinar Plano Anual
                            </Button>
                            {qrCode2 && (
                                <Grid item xs={12} sm={12} mt={2}>
                                    <Typography sx={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: '1em', textAlign: 'center', color: 'white', padding: '0.5em' }}>ESCANEIE O QR CODE ABAIXO<br />E REALIZE O PAGAMENTO</Typography>
                                    <Box component="img" src={`data:image/png;base64,${qrCodeBase642}`} alt="QR Code Plano Avançado" sx={{ width: '300px', height: '300px' }} />
                                    <Typography sx={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: '1em', textAlign: 'center', color: 'white', padding: '0.5em' }}>Ou copie o código abaixo:</Typography>
                                    <Paper sx={{ padding: '1em', borderRadius: '5px', backgroundColor: '#f5f5f5', textAlign: 'center' }}>
                                        <Typography sx={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: '0.9em', color: 'black', wordBreak: 'break-all' }}>
                                            {qrCode2} {/* Certifique-se de que você está usando o código correto */}
                                        </Typography>
                                        <Button variant="contained" sx={{ marginTop: '1em' }} onClick={() => navigator.clipboard.writeText(qrCode2)}>
                                            Copiar Código
                                        </Button>
                                    </Paper>
                                </Grid>
                            )}
                            {paymentStatus2 && <Typography variant="body1">{paymentStatus2}</Typography>}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Container >
    )
}

export default PagamentoPix;