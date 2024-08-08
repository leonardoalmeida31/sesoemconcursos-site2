import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Typography, Paper, Card, CardContent, Container, Grid, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_REACT_APP_API_KEY,
    authDomain: import.meta.env.VITE_REACT_APP_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_REACT_APP_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

const TestePix = () => {
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

    const createPixPayment = async (amount, planName) => {
        try {
            const response = await axios.post('https://api-seso-em-dados.vercel.app/create_pix_payment', {
                transaction_amount: amount, // Valor do pagamento em reais
                description: `Assinatura do plano ${planName} no SESO em Concursos - R$ ${amount}`, // Personalize o título aqui
                payer: {
                    email: user.email
                }
            });

            if (amount === 1.00) {
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
            if (amount === 1.00) {
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
                setOpenDialog(true); // Open dialog on payment confirmation
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
            vencimentoPix.setDate(vencimentoPix.getDate() + 180);

            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, {
                paymentInfo: {
                    amountPaid: amount
                },
                vencimentoPix: vencimentoPix
            });
        } catch (error) {
            console.error('Erro ao atualizar informações de pagamento no Firestore:', error);
        }
    };

    useEffect(() => {
        const intervalId1 = setInterval(() => {
            checkPaymentStatus(paymentId1, setPaymentStatus1, 1);
        }, 5000); // Verificar a cada 5 segundos

        const intervalId2 = setInterval(() => {
            checkPaymentStatus(paymentId2, setPaymentStatus2, 2);
        }, 5000); // Verificar a cada 5 segundos

        return () => {
            clearInterval(intervalId1); // Limpar o intervalo quando o componente for desmontado
            clearInterval(intervalId2);
        }
    }, [paymentId1, paymentId2]);

    useEffect(() => {
        if (openDialog) {
            const timer = setTimeout(() => {
                navigate('/'); // Redirecionar para a página principal
            }, 10000); // 7 segundos

            return () => clearTimeout(timer);
        }
    }, [openDialog, navigate]);

    const signInWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                console.log(user);
                setUser(user);
            })
            .catch((error) => {
                console.error('Erro ao fazer login com Google:', error);
            });
    };

    return (
        <Container maxWidth="md">
            {user ? (
                <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
                    <Grid item xs={12} sm={6}>
                        <Paper elevation={3} sx={{ padding: 4, textAlign: 'center' }}>
                            <Typography variant="h5" gutterBottom>
                                Plano SEMESTRAL
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                R$ 1,00
                            </Typography>
                            <Typography variant="body1" paragraph>
                                Acesso por 180 dias.
                            </Typography>
                            <Button variant="contained" color="primary" onClick={() => createPixPayment(1.00, "Semestral SESO em Concursos")}>
                                Assinar Plano Semestral 
                            </Button>
                            {qrCode1 && (
                                <Box mt={2}>
                                    <Typography variant="body1">QR Code:</Typography>
                                    <Box component="img" src={`data:image/png;base64,${qrCodeBase641}`} alt="QR Code Plano Básico" sx={{ width: '200px', height: '200px' }} />
                                </Box>
                            )}
                            {paymentStatus1 && <Typography variant="body1">{paymentStatus1}</Typography>}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Paper elevation={3} sx={{ padding: 4, textAlign: 'center' }}>
                            <Typography variant="h5" gutterBottom>
                                Plano ANUAL
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                R$ 2,00
                            </Typography>
                            <Typography variant="body1" paragraph>
                                Acesso por 180 dias com benefícios adicionais.
                            </Typography>
                            <Button variant="contained" color="secondary" onClick={() => createPixPayment(2.00, "Anual SESO em Concursos")}>
                                Assinar Plano Anual
                            </Button>
                            {qrCode2 && (
                                <Box mt={2}>
                                    <Typography variant="body1">QR Code:</Typography>
                                    <Box component="img" src={`data:image/png;base64,${qrCodeBase642}`} alt="QR Code Plano Premium" sx={{ width: '200px', height: '200px' }} />
                                </Box>
                            )}
                            {paymentStatus2 && <Typography variant="body1">{paymentStatus2}</Typography>}
                        </Paper>
                    </Grid>
                </Grid>
            ) : (
                <Card sx={{ maxWidth: 345, mt: 4, mx: 'auto' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" gutterBottom>
                            SESO em Concursos
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            Faça login com sua conta do Google para escolher um plano de assinatura.
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={signInWithGoogle}
                            sx={{ mt: 2 }}
                        >
                            Entrar com o Google
                        </Button>
                    </CardContent>
                </Card>
            )}

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Pagamento Confirmado</DialogTitle>
                <DialogContent>
                    <Typography variant="h6">PARABÉNS! SUA ASSINATURA FOI REALIZADA!</Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>VOCÊ JÁ PODE RESOLVER QUESTÕES ILIMITADAS</Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>VOCÊ SERÁ ENCAMINHADO PARA A PÁGINA DE QUESTÕES EM 7 SEGUNDOS</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => navigate('/')}>Fechar</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default TestePix;
