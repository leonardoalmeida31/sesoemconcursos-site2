import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Button, Typography, Container, Grid, Paper, CircularProgress, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { db, auth } from "../../firebase";


const paperStyle = {
  padding: '20px',
  width: '400px',
  margin: '20px auto',
  textAlign: 'center',
};

function SuccessPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const amount = parseInt(urlParams.get('amount'), 10); // Converte para número inteiro

        if (token && !isNaN(amount)) {
          try {
            const paymentInfo = {
              amountPaid: amount,
              token: token
            };

            const userRef = doc(db, 'users', user.uid);

            // Atualiza as informações de pagamento no Firestore
            await updateDoc(userRef, { paymentInfo: paymentInfo });
            setPaymentInfo(paymentInfo);

            // Define a duração do acesso com base no valor de amount
            const accessDurationDays = getAccessDuration(amount);
            await atualizarInformacoesDeAcesso(userRef, accessDurationDays);
          } catch (error) {
            console.error('Erro ao processar informações de pagamento:', error);
            setError('Erro ao processar informações de pagamento.');
          }
        } else {
          setError('Parâmetros de token ou valor de pagamento ausentes ou inválidos na URL.');
        }
      } else {
        navigate('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db, navigate]);

  const getAccessDuration = (amount) => {
    switch (amount) {
      case 1:
        return 30; 
      case 2:
        return 180; 
      case 3:
        return 365; 
      default:
        return 0; 
    }
  };

  const atualizarInformacoesDeAcesso = async (userRef, accessDurationDays) => {
    try {
      const currentDate = new Date();
      const expirationDate = new Date(currentDate);
      expirationDate.setDate(currentDate.getDate() + accessDurationDays);

      await updateDoc(userRef, { expirationDate: expirationDate });
      console.log(`Acesso concedido por ${accessDurationDays} dias.`);
    } catch (error) {
      console.error('Erro ao atualizar informações de acesso:', error);
      setError('Erro ao atualizar informações de acesso.');
    }
  };


  return (
    <Container>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} style={paperStyle}>
            {loading ? (
              <CircularProgress />
            ) : error ? (
              <Typography variant="body1" color="error">{error}</Typography>
            ) : (
              <>
                <Typography variant="h6">Assinatura realizada com sucesso!</Typography>
                <Typography variant="body1">Informações de pagamento:</Typography>
                {paymentInfo ? (
                  <div>
                    <Typography variant="body1">Token de pagamento: {paymentInfo.paymentTokenId}</Typography>
                  </div>
                ) : (
                  <Typography variant="body1">As informações de pagamento estão sendo atualizadas...</Typography>
                )}

                <Link href="/">Toque aqui para continuar respondendo questões</Link>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default SuccessPage;