import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Button, Typography, CircularProgress, Container, Grid, Paper } from '@mui/material';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_REACT_APP_API_KEY,
  authDomain: import.meta.env.VITE_REACT_APP_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_REACT_APP_PROJECT_ID,
};

const paperStyle = {
  padding: '20px',
  width: '400px',
  margin: '20px auto',
  textAlign: 'center',
};

const buttonStyle = {
  marginTop: '20px',
};

function PixFeito() {
  const firebaseApp = initializeApp(firebaseConfig);
  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);
  const [user, setUser] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
      } else {
        console.error('Usuário não autenticado. Redirecionar para a página de login.');
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth]);

  const atualizarInformacoesDeAcesso = async (userRef, amountPaid) => {
    // Implemente a lógica de atualização das informações de acesso aqui
  };

  const generateRandomPayment = async () => {
    try {
      setLoading(true);

      const randomToken = Math.random().toString(36).substring(2);
      const randomAmountPaid = Math.floor(Math.random() * 1000) + 1;
      const paymentInfo = {
        paymentTokenId: randomToken,
        amountPaid: randomAmountPaid,
      };
      const userRef = doc(db, 'users', user.uid);

      await updateDoc(userRef, {
        paymentInfo: paymentInfo,
      });

      setPaymentInfo(paymentInfo);
      await atualizarInformacoesDeAcesso(userRef, randomAmountPaid);
      window.location.href = "/"; // Substitua "/seu-link-aqui" pelo link desejado
    } catch (error) {
      console.error('Erro ao gerar informações de pagamento aleatoriamente:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} style={paperStyle}>
            <Typography variant="h4">Pix Realizado!</Typography>
            {paymentInfo ? (
              <div>
                <Typography variant="body1">Token de pagamento: {paymentInfo.paymentTokenId}</Typography>
                <Typography variant="body1">Valor pago: {paymentInfo.amountPaid}</Typography>
              </div>
            ) : (
              <Typography variant="body1">As informações de pagamento estão sendo atualizadas...</Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={generateRandomPayment}
              disabled={loading}
              style={buttonStyle}
            >
              Toque aqui para Ativar sua Assinatura
            </Button>
            {loading && <CircularProgress style={{ marginTop: '20px' }} />}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default PixFeito;
