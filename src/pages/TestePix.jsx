import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Typography, Paper, Card, CardContent, Container, Grid } from '@mui/material';
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, updateDoc, serverTimestamp } from "firebase/firestore";

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

    const createPixPayment = async (amount) => {
        try {
            const response = await axios.post('https://api-seso-em-dados.vercel.app/create_pix_payment', {
                transaction_amount: amount, // Valor do pagamento em reais
                description: `Compra de teste de ${amount} reais`,
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
                // Atualize a informação de pagamento no Firestore
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

    const signInWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                // The signed-in user info.
                const user = result.user;
                console.log(user);
                setUser(user);
            })
            .catch((error) => {
                console.error('Erro ao fazer login com Google:', error);
            });
    };

    return (
        <Container maxWidth="sm">
            {user ? (
                <Grid elevation={3} sx={{ padding: 4, mt: 4, textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h5" gutterBottom>
                        Pagamento Pix
                    </Typography>
                 
                    <Button variant="contained" color="primary" onClick={() => createPixPayment(1.00)}>
                        Criar Pagamento Pix de R$ 1,00
                    </Button>
                    {qrCode1 && (
                        <Grid mt={2}>
                            <Typography variant="body1">QR Code de R$ 1,00:</Typography>
                            <Grid component="img" src={`data:image/png;base64,${qrCodeBase641}`} alt="QR Code R$ 1,00" sx={{ width: '200px', height: '200px' }} />
                        </Grid>
                    )}
                    {paymentStatus1 && <Typography variant="body1">{paymentStatus1}</Typography>}


                    <Button variant="contained" color="secondary" onClick={() => createPixPayment(2.00)} sx={{ mt: 4 }}>
                        Criar Pagamento Pix de R$ 2,00
                    </Button>
                    {qrCode2 && (
                        <Grid mt={2}>
                            <Typography variant="body1">QR Code de R$ 2,00:</Typography>
                            <Grid component="img" src={`data:image/png;base64,${qrCodeBase642}`} alt="QR Code R$ 2,00" sx={{ width: '200px', height: '200px' }} />
                        </Grid>
                    )}
                    {paymentStatus2 && <Typography variant="body1">{paymentStatus2}</Typography>}
        
                </Grid>
            ) : (
                <Card sx={{ maxWidth: 345, mt: 4, mx: 'auto' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" gutterBottom>
                            SESO em Concursos
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            Faça login com sua conta do Google para responder questões diariamente.
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
        </Container>
    );
};

export default TestePix;
