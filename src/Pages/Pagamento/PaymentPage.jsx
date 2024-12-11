import React, { useState, useEffect } from 'react';
import { Button, Container, Grid, Paper, Typography } from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import { getAuth } from "firebase/auth";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

const Pagamento = () => {
  const stripePublicKey = import.meta.env.VITE_REACT_APP_STRIPE_PUBLIC_KEY;
  const stripePromise = loadStripe(stripePublicKey);
  const [user, setUser] = useState(null);


  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      setUser(currentUser);
    }
  }, []);


  const handleCheckout = async () => {
    if (!user) return;
    const stripe = await stripePromise;

    try {
      const { error } = await stripe.redirectToCheckout({
        lineItems: [
          {
            price: "price_1QUw9kB3raGqSSUVVmfMnKSw",
            quantity: 1,
          },
        ],
        mode: "payment",
        customerEmail: user.email,
        successUrl: `https://sesoemconcursos.com.br/SuccessPage?amount=1&token=${generateUniqueToken()}`,
      });

      if (error) {
        console.error("Erro ao redirecionar para o checkout:", error);
      }
    } catch (err) {
      console.error("Erro ao iniciar o checkout:", err);
    }
  };

  const handleCheckoutS = async () => {
    if (!user) return;
    const stripe = await stripePromise;

    try {
      const { error } = await stripe.redirectToCheckout({
        lineItems: [
          {
            price: "price_1QUwEOB3raGqSSUVFHfBnRTA",
            quantity: 1,
          },
        ],
        mode: "payment",
        customerEmail: user.email,
        successUrl: `https://sesoemconcursos.com.br/SuccessPage?amount=2&token=${generateUniqueToken()}`,
      });

      if (error) {
        console.error("Erro ao redirecionar para o checkout:", error);
      }
    } catch (err) {
      console.error("Erro ao iniciar o checkout:", err);
    }
  };
  const handleCheckoutA = async () => {
    if (!user) return;
    const stripe = await stripePromise;

    try {
      const { error } = await stripe.redirectToCheckout({
        lineItems: [
          {
            price: "price_1QUwFYB3raGqSSUVH0WObPIS",
            quantity: 1,
          },
        ],
        mode: "payment",
        customerEmail: user.email,
        successUrl: `https://sesoemconcursos.com.br/SuccessPage?amount=3&token=${generateUniqueToken()}`,
      });

      if (error) {
        console.error("Erro ao redirecionar para o checkout:", error);
      }
    } catch (err) {
      console.error("Erro ao iniciar o checkout:", err);
    }
  };


  const generateUniqueToken = () => {
    const timestamp = Date.now();
    const uniqueToken = timestamp.toString(16);
    return uniqueToken;
  };



  return (
    <Container maxWidth="xl" sx={{ padding: '1em', backgroundColor: '#EEF2F2', borderRadius: '15px' }}>
      <Grid item xs={12} sm={12} sx={{ textAlign: 'center', padding: '1em', backgroundColor: '#182828', borderRadius: '7px' }}>
        <Typography sx={{ color: 'white', fontSize: '2em', fontWeight: '600' }}>
          ASSINATURA COM CARTÃO DE CRÉDITO
        </Typography>
        <Typography sx={{ color: 'white', fontSize: '1em', fontWeight: '400' }}>
          Confira abaixo os nossos planos:
        </Typography>
      </Grid>
      <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
        <Grid item xs={12} sm={5} sx={{}}>
          <Paper elevation={3} sx={{ padding: 4, borderRadius: '15px', background: '#2f5659', marginBottom: '20px' }}>
            <Typography sx={{ color: 'white', fontSize: '2.5em', fontWeight: '600', textAlign: 'center' }}>
              Plano Mensal
            </Typography>
            <Typography sx={{ color: 'white', fontSize: '1.8em', textAlign: 'center', fontWeight: '600' }}>
              R$ 21,99/mes
            </Typography>
            <Typography sx={{ color: 'white', margin: '0 auto'}}>
              <p style={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}>
                <CheckIcon style={{ color: 'white', marginRight: '8px' }} />
                Resolução de Questões Ilimitadas
              </p>
              <p style={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}>
                <CheckIcon style={{ color: 'white', marginRight: '8px' }} />
                Comentários de professores
              </p>
              <p style={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}>
                <CheckIcon style={{ color: 'white', marginRight: '8px' }} />
                Questões Discursivas Liberadas
              </p>
              <p style={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}>
                <CheckIcon style={{ color: 'white', marginRight: '8px' }} />
                Acesso ao gráfico de Desempenho Ilimitado
              </p>
              <p style={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}>
                <CheckIcon style={{ color: 'white', marginRight: '8px' }} />
                Participar do Ranking de Desempenho do Site
              </p>
              <p style={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}>
                <ClearIcon style={{ color: '#ff0000', marginRight: '8px' }} />
                Maior custo a longo prazo
              </p>
            </Typography>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => handleCheckout()}
              sx={{ mt: 2 }}
            >
              Pagar com Cartão
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={5} sx={{}}>
          <Paper elevation={3} sx={{ padding: 4, borderRadius: '15px', background: '#2f5659', marginBottom: '20px' }}>
            <Typography sx={{ color: 'white', fontSize: '2.5em', fontWeight: '600', textAlign: 'center' }}>
              Plano Semestral
            </Typography>
            <Typography sx={{ color: 'white', fontSize: '1.8em', textAlign: 'center', fontWeight: '600' }}>
            R$ 60,00/a cada 6 meses
            </Typography>
            <Typography sx={{ color: 'white', margin: '0 auto'}}>
              <p style={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}>
                <CheckIcon style={{ color: 'white', marginRight: '8px' }} />
                Resolução de Questões Ilimitadas
              </p>
              <p style={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}>
                <CheckIcon style={{ color: 'white', marginRight: '8px' }} />
                Comentários de professores
              </p>
              <p style={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}>
                <CheckIcon style={{ color: 'white', marginRight: '8px' }} />
                Questões Discursivas Liberadas
              </p>
              <p style={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}>
                <CheckIcon style={{ color: 'white', marginRight: '8px' }} />
                Acesso ao gráfico de Desempenho Ilimitado
              </p>
              <p style={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}>
                <CheckIcon style={{ color: 'white', marginRight: '8px' }} />
                Participar do Ranking de Desempenho do Site
              </p>
              <p style={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}>
                <CheckIcon style={{ color: 'white', marginRight: '8px' }} />
                Maior custo a longo prazo
              </p>
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => handleCheckoutS()}
              sx={{ mt: 2 }}
            >
              Pagar com Cartão
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={5} sx={{}}>
          <Paper elevation={3} sx={{ padding: 4, borderRadius: '15px', background: '#2f5659', marginBottom: '20px' }}>
            <Typography sx={{ color: 'white', fontSize: '2.5em', fontWeight: '600', textAlign: 'center' }}>
              Plano Anual
            </Typography>
            <Typography sx={{ color: 'white', fontSize: '1.8em', textAlign: 'center', fontWeight: '600' }}>
            R$ 120,00/a cada 12 meses
            </Typography>
            <Typography sx={{ color: 'white', margin: '0 auto'}}>
              <p style={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}>
                <CheckIcon style={{ color: 'white', marginRight: '8px' }} />
                Resolução de Questões Ilimitadas
              </p>
              <p style={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}>
                <CheckIcon style={{ color: 'white', marginRight: '8px' }} />
                Comentários de professores
              </p>
              <p style={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}>
                <CheckIcon style={{ color: 'white', marginRight: '8px' }} />
                Questões Discursivas Liberadas
              </p>
              <p style={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}>
                <CheckIcon style={{ color: 'white', marginRight: '8px' }} />
                Acesso ao gráfico de Desempenho Ilimitado
              </p>
              <p style={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}>
                <CheckIcon style={{ color: 'white', marginRight: '8px' }} />
                Participar do Ranking de Desempenho do Site
              </p>
              <p style={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}>
                <CheckIcon style={{ color: 'white', marginRight: '8px' }} />
                Maior desconto
              </p>
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => handleCheckoutA()}
              sx={{ mt: 2 }}
            >
              Pagar com Cartão
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};


export default Pagamento;






