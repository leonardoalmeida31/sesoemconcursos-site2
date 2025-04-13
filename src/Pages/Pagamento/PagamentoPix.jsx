import React, { useState, useEffect } from 'react';
import {
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import axios from 'axios';
import VerifiedTwoToneIcon from '@mui/icons-material/VerifiedTwoTone';
import { doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { styled } from '@mui/system';
import { db } from '../../firebase';

// Tema personalizado com Poppins
const theme = createTheme({
  typography: {
    fontFamily: '"Poppins", sans-serif',
    h2: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 700,
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontWeight: 500,
      lineHeight: 1.6,
    },
    body2: {
      fontWeight: 400,
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      fontSize: '1.1rem',
    },
  },
});

// Estilos personalizados
const PlanCard = styled(Paper)(({ theme, recommended }) => ({
  padding: theme.spacing(5),
  borderRadius: '25px',
  background: '#2f5659',
  color: 'white',
  position: 'relative',
  border: recommended ? '2px solid #ffca28' : '2px solid transparent',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  transform: recommended ? 'scale(1.05)' : 'scale(1)',
  boxShadow: recommended
    ? '0 10px 30px rgba(0, 0, 0, 0.4)'
    : '0 6px 18px rgba(0, 0, 0, 0.3)',
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
  },
  animation: recommended ? 'pulse 2s infinite' : 'none',
  '@keyframes pulse': {
    '0%': { transform: 'scale(1.05)' },
    '50%': { transform: 'scale(1.08)' },
    '100%': { transform: 'scale(1.05)' },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #1e3a8a 30%, #3b82f6 90%)',
  color: 'white',
  padding: theme.spacing(1.5, 5),
  borderRadius: '12px',
  textTransform: 'none',
  transition: 'transform 0.2s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #1e40af 30%, #60a5fa 90%)',
    transform: 'translateY(-3px)',
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'rgba(255, 255, 255, 0.2)',
      transition: 'left 0.3s ease',
      left: '100%',
    },
  },
}));

const Badge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '-20px',
  right: '20px',
  background: '#ffca28',
  color: '#182828',
  padding: theme.spacing(0.8, 2.5),
  borderRadius: '25px',
  fontWeight: 600,
  fontSize: '1rem',
  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.3)',
}));

const QrCodeBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '15px',
  background: '#f5f5f5',
  textAlign: 'center',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
}));

const PagamentoPix = () => {
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
      const response = await axios.post(
        'https://api-seso-em-dados.vercel.app/create_pix_payment',
        {
          transaction_amount: amount,
          description: `Assinatura do plano ${planName} no SESO em Concursos - R$ ${amount}`,
          payer: { email: user.email },
        }
      );

      if (amount === 60.0) {
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
      if (amount === 60.0) {
        setPaymentStatus1('Erro ao criar pagamento.');
      } else {
        setPaymentStatus2('Erro ao criar pagamento.');
      }
    }
  };

  const checkPaymentStatus = async (paymentId, setPaymentStatus, updateAmount) => {
    if (!paymentId) return;
    try {
      const response = await axios.get(
        `https://api-seso-em-dados.vercel.app/check_payment_status?payment_id=${paymentId}`
      );
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
      const expirationDays = amount === 60.0 ? 180 : 365;
      vencimentoPix.setDate(vencimentoPix.getDate() + expirationDays);

      const formattedDate = vencimentoPix.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
      const formattedTime = vencimentoPix.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'America/Sao_Paulo',
      });

      const formattedExpirationDate = `${formattedDate} às ${formattedTime} UTC-3`;

      const token = generateToken();

      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        paymentInfo: {
          amountPaid: amount,
          token: token,
        },
        vencimentoPix: formattedExpirationDate,
        expirationDate: vencimentoPix.toISOString(),
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
      checkPaymentStatus(paymentId1, setPaymentStatus1, 60.0);
    }, 5000);

    const intervalId2 = setInterval(() => {
      checkPaymentStatus(paymentId2, setPaymentStatus2, 110.0);
    }, 5000);

    return () => {
      clearInterval(intervalId1);
      clearInterval(intervalId2);
    };
  }, [paymentId1, paymentId2]);

  useEffect(() => {
    if (openDialog) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [openDialog, navigate]);

  const plans = [
    {
      title: 'Plano Semestral',
      price: 'R$ 60,00',
      amount: 60.0,
      badge: 'Mais Popular',
      recommended: false,
      features: [
        'Estude com Questões Ilimitadas',
        'Mais de 4 mil questões comentadas por Assistentes Sociais',
        'Centenas de Questões Discursivas/Dissertativas',
        'Acompanhe seu desempenho com Ciência de Dados',
        'Filtros Personalizados para o seu Concurso',
        'Uma aula de Mentoria Liberada',
        'Analise suas estatísticas de desempenho',
        'Assinatura Válida por 06 meses',
        'Suporte no WhatsApp com Assistente Social para tirar dúvidas',
      ],
      qrCode: qrCode1,
      qrCodeBase64: qrCodeBase641,
      paymentStatus: paymentStatus1,
      setPaymentStatus: setPaymentStatus1,
      paymentId: paymentId1,
      planName: 'Semestral SESO em Concursos',
    },
    {
      title: 'Plano Anual',
      price: 'R$ 110,00',
      amount: 110.0,
      badge: 'Maior Desconto',
      recommended: true,
      features: [
        'Estude com Questões Ilimitadas',
        'Mais de 4 mil questões comentadas por Assistentes Sociais',
        'Centenas de Questões Discursivas/Dissertativas',
        'Acompanhe seu desempenho com Ciência de Dados',
        'Filtros Personalizados para o seu Concurso',
        'Duas aulas de Mentoria Liberada',
        'Analise suas estatísticas de desempenho',
        'Assinatura Válida por 12 meses',
        'Suporte no WhatsApp com Assistente Social para tirar dúvidas',
      ],
      qrCode: qrCode2,
      qrCodeBase64: qrCodeBase642,
      paymentStatus: paymentStatus2,
      setPaymentStatus: setPaymentStatus2,
      paymentId: paymentId2,
      planName: 'Anual SESO em Concursos',
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth="lg"
        sx={{
          py: 10,
          background: 'linear-gradient(180deg, #EEF2F2 0%, #c7ced5 100%)',
          borderRadius: '30px',
          minHeight: '100vh',
        }}
      >
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box
            sx={{
              textAlign: 'center',
              mb: 8,
              background: '#182828',
              borderRadius: '20px',
              p: 5,
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
            }}
          >
            <Typography
              variant="h2"
              sx={{
                color: 'white',
                mb: 2,
                fontSize: { xs: '2.2rem', md: '3.5rem' },
              }}
            >
              Assinatura via Pix
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'white',
                fontSize: { xs: '1.1rem', md: '1.4rem' },
                fontWeight: 400,
              }}
            >
              Ganhe descontos exclusivos e praticidade ao assinar com Pix!
            </Typography>
          </Box>
        </motion.div>

        {/* Planos */}
        <Grid container spacing={5} justifyContent="center">
          {plans.map((plan, index) => (
            <Grid item xs={12} sm={6} md={5.5} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <PlanCard elevation={3} recommended={plan.recommended}>
                  {plan.badge && <Badge>{plan.badge}</Badge>}
                  <Typography
                    variant="h4"
                    sx={{
                      textAlign: 'center',
                      mb: 2,
                      fontSize: { xs: '2rem', md: '2.4rem' },
                    }}
                  >
                    {plan.title}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      textAlign: 'center',
                      mb: 4,
                      fontSize: { xs: '1.5rem', md: '1.9rem' },
                    }}
                  >
                    {plan.price}
                  </Typography>
                  <Box sx={{ mb: 5 }}>
                    {plan.features.map((feature, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 2,
                        }}
                      >
                        <VerifiedTwoToneIcon
                          sx={{ mr: 1.5, color: '#1AAE6D', fontSize: '1.6rem' }}
                        />
                        <Typography
                          variant="body1"
                          sx={{ fontSize: { xs: '1rem', md: '1.15rem' } }}
                        >
                          {feature}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <StyledButton
                    fullWidth
                    onClick={() => createPixPayment(plan.amount, plan.planName)}
                    aria-label={`Assinar ${plan.title}`}
                  >
                    Assinar {plan.title}
                  </StyledButton>
                  {plan.qrCode && (
                    <Box mt={4}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: { xs: '1rem', md: '1.2rem' },
                          textAlign: 'center',
                          mb: 2,
                          fontWeight: 600,
                        }}
                      >
                        Escaneie o QR Code para pagar
                      </Typography>
                      <QrCodeBox>
                        <Box
                          component="img"
                          src={`data:image/png;base64,${plan.qrCodeBase64}`}
                          alt={`QR Code ${plan.title}`}
                          sx={{ width: '250px', height: '250px', mb: 2 }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: { xs: '0.9rem', md: '1rem' },
                            mb: 2,
                            color: '#182828',
                          }}
                        >
                          Ou copie o código abaixo:
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: { xs: '0.85rem', md: '0.9rem' },
                            color: '#182828',
                            wordBreak: 'break-all',
                            mb: 2,
                          }}
                        >
                          {plan.qrCode}
                        </Typography>
                        <StyledButton
                          variant="contained"
                          onClick={() => navigator.clipboard.writeText(plan.qrCode)}
                        >
                          Copiar Código
                        </StyledButton>
                      </QrCodeBox>
                    </Box>
                  )}
                  {plan.paymentStatus && (
                    <Typography
                      variant="body1"
                      sx={{
                        textAlign: 'center',
                        mt: 2,
                        fontSize: { xs: '1rem', md: '1.1rem' },
                        color: plan.paymentStatus.includes('confirmado')
                          ? '#1AAE6D'
                          : 'white',
                      }}
                    >
                      {plan.paymentStatus}
                    </Typography>
                  )}
                </PlanCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Dialog de Confirmação */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle sx={{ fontFamily: '"Poppins", sans-serif', fontWeight: 600 }}>
            Pagamento Confirmado!
          </DialogTitle>
          <DialogContent>
            <Typography
              sx={{ fontFamily: '"Poppins", sans-serif', fontWeight: 400 }}
            >
              Seu pagamento foi processado com sucesso. Você será redirecionado em breve.
            </Typography>
          </DialogContent>
          <DialogActions>
            <StyledButton onClick={() => navigate('/')}>Ir para o Início</StyledButton>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
};

export default PagamentoPix;