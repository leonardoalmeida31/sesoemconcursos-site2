import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  updateDoc,
} from 'firebase/firestore';
import {
  getAuth,
} from 'firebase/auth';
import { Button, Typography, Container, Grid, Paper, CircularProgress, Link } from '@mui/material';

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

function SuccessPage() {
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

        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const amountPaid = parseFloat(urlParams.get('amount'));

        if (token && !isNaN(amountPaid)) {
          try {
            const paymentInfo = {
              paymentTokenId: token,
              amountPaid: amountPaid,
            };

            const userRef = doc(db, 'users', user.uid);

            await updateDoc(userRef, {
              paymentInfo: paymentInfo,
            });

            setPaymentInfo(paymentInfo);
            await atualizarInformacoesDeAcesso(userRef, amountPaid);
          } catch (error) {
            console.error('Erro ao adicionar informações de pagamento:', error);
          }
        } else {
          console.error('Informações de token e valor de pagamento não encontradas na URL.');
        }
      } else {
        console.error('Usuário não autenticado. Redirecionar para a página de login.');
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth, db]);

  const atualizarInformacoesDeAcesso = async (userRef, amountPaid) => {
    try {
      const currentDate = new Date();
      let expirationDate = new Date(currentDate);
      let accessDurationDays = 0;

      if (amountPaid === 1) {
        accessDurationDays = 30;
      } else if (amountPaid === 6500) {
        accessDurationDays = 180;
      } else if (amountPaid === 12000) {
        accessDurationDays = 365;
      }

      expirationDate.setDate(currentDate.getDate() + accessDurationDays);

      await updateDoc(userRef, {
        expirationDate: expirationDate,
      });

      console.log(
        `Acesso concedido por ${accessDurationDays} dias a partir de ${currentDate.toISOString()}`
      );
    } catch (error) {
      console.error('Erro ao atualizar informações de acesso:', error);
    }
  };

  return (
    <Container>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} style={paperStyle}>
            <Typography variant="h6">Assinatura realizada com sucesso!</Typography>
            <Typography variant="body1">Informações de pagamento:</Typography>
            {paymentInfo ? (
              <div>
                <Typography variant="body1">Token de pagamento: {paymentInfo.paymentTokenId}</Typography>
                <Typography variant="body1">Valor pago: {paymentInfo.amountPaid}</Typography>
              </div>
            ) : (
              <Typography variant="body1">As informações de pagamento estão sendo atualizadas...</Typography>
            )}
            <Link href="/">Toque aqui para continuar respondendo questões</Link>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default SuccessPage;
