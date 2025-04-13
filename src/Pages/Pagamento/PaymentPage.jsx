import React, { useState, useEffect } from 'react';
import {
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import { getAuth } from 'firebase/auth';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { motion } from 'framer-motion';
import { styled } from '@mui/system';

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
  position: 'relative',
  overflow: 'hidden',
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

const FAQAccordion = styled(Accordion)(({ theme }) => ({
  background: '#2f5659',
  color: 'white',
  borderRadius: '15px',
  marginBottom: theme.spacing(2),
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  '&:before': { display: 'none' },
}));

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

  const handleCheckout = async (priceId, amount) => {
    if (!user) return;
    const stripe = await stripePromise;
    try {
      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        customerEmail: user.email,
        successUrl: `https://sesoemconcursos.com.br/SuccessPage?amount=${amount}&token=${generateUniqueToken()}`,
      });
      if (error) {
        console.error('Erro ao redirecionar para o checkout:', error);
      }
    } catch (err) {
      console.error('Erro ao iniciar o checkout:', err);
    }
  };

  const generateUniqueToken = () => {
    const timestamp = Date.now();
    return timestamp.toString(16);
  };

  const plans = [
    {
      title: 'Plano Mensal',
      price: 'R$ 21,99/mês',
      priceId: 'price_1QUw9kB3raGqSSUVVmfMnKSw',
      amount: 1,
      features: [
        { text: 'Resolução de Questões Ilimitadas', available: true },
        { text: 'Comentários de professores', available: true },
        { text: 'Questões Discursivas Liberadas', available: true },
        { text: 'Acesso ao gráfico de Desempenho Ilimitado', available: true },
        { text: 'Participar do Ranking de Desempenho do Site', available: true },
        { text: 'Maior custo a longo prazo', available: false },
      ],
      recommended: false,
    },
    {
      title: 'Plano Semestral',
      price: 'R$ 60,00/a cada 6 meses',
      priceId: 'price_1NwtihB3raGqSSUVxHmuE62X',
      amount: 2,
      features: [
        { text: 'Resolução de Questões Ilimitadas', available: true },
        { text: 'Comentários de professores', available: true },
        { text: 'Questões Discursivas Liberadas', available: true },
        { text: 'Acesso ao gráfico de Desempenho Ilimitado', available: true },
        { text: 'Participar do Ranking de Desempenho do Site', available: true },
        { text: 'Economia de 54% em relação ao mensal', available: true },
      ],
      recommended: false,
    },
    {
      title: 'Plano Anual',
      price: 'R$ 120,00/a cada 12 meses',
      priceId: 'price_1NlMulB3raGqSSUVr41T8yfL',
      amount: 3,
      features: [
        { text: 'Resolução de Questões Ilimitadas', available: true },
        { text: 'Comentários de professores', available: true },
        { text: 'Questões Discursivas Liberadas', available: true },
        { text: 'Acesso ao gráfico de Desempenho Ilimitado', available: true },
        { text: 'Participar do Ranking de Desempenho do Site', available: true },
        { text: 'Maior economia: 54% de desconto', available: true },
      ],
      recommended: true,
    },
  ];

  const faqs = [
    {
      question: 'Posso cancelar minha assinatura a qualquer momento?',
      answer:
        'Sim, você pode cancelar sua assinatura quando quiser diretamente na sua conta. Não há taxas de cancelamento, e você continuará com acesso até o fim do período pago.',
    },
    {
      question: 'Serei cobrado todos os meses?',
      answer:
        'Sim, a cobrança é automática, mas você pode cancelar sua assinatura quando quiser diretamente na sua conta ou através do nosso suporte WhatsApp: (74) 98126-5381. Não há taxas de cancelamento, e você continuará com acesso até o fim do período pago.',
    },
    {
      question: 'Quais formas de pagamento são aceitas?',
      answer:
        'Aceitamos cartões de crédito (Visa, MasterCard, entre outros) via Stripe, garantindo total segurança nas transações.',
    },
    {
      question: 'O que acontece se eu não renovar meu plano?',
      answer:
        'Se você não renovar, sua conta voltará ao modo gratuito, com acesso limitado às funcionalidades. Você não perderá seus dados salvos.',
    },
    {
      question: 'Terei suporte humanizado?',
      answer:
        'Sim, temos um assistente social à sua disposição no WhatsApp para tirar suas dúvidas sobre os recursos do site.',
    },
    {
      question: 'Posso mudar de plano depois de assinar?',
      answer:
        'Sim, você pode atualizar para um plano superior ou inferior a qualquer momento. A alteração será refletida no próximo ciclo de cobrança.',
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
              Escolha o Plano Ideal para Você
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'white',
                fontSize: { xs: '1.1rem', md: '1.4rem' },
                fontWeight: 400,
              }}
            >
              Desbloqueie todo o potencial do nosso site com acesso ilimitado!
            </Typography>
          </Box>
        </motion.div>

        {/* Planos */}
        <Grid container spacing={5} justifyContent="center">
          {plans.map((plan, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <PlanCard elevation={3} recommended={plan.recommended}>
                  {plan.recommended && <Badge>Melhor Escolha</Badge>}
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
                        {feature.available ? (
                          <CheckIcon
                            sx={{ mr: 1.5, color: 'white', fontSize: '1.6rem' }}
                          />
                        ) : (
                          <ClearIcon
                            sx={{ mr: 1.5, color: '#ff0000', fontSize: '1.6rem' }}
                          />
                        )}
                        <Typography
                          variant="body1"
                          sx={{ fontSize: { xs: '1rem', md: '1.15rem' } }}
                        >
                          {feature.text}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <StyledButton
                    fullWidth
                    onClick={() => handleCheckout(plan.priceId, plan.amount)}
                    aria-label={`Assinar ${plan.title}`}
                  >
                    Assinar Agora
                  </StyledButton>
                </PlanCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Box sx={{ mt: 12, textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{
                color: '#182828',
                mb: 3,
                fontSize: { xs: '2rem', md: '2.8rem' },
              }}
            >
              Perguntas Frequentes
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#182828',
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                mb: 5,
                fontWeight: 400,
              }}
            >
              Tire suas dúvidas sobre nossos planos de assinatura
            </Typography>
            <Box sx={{ maxWidth: '900px', mx: 'auto' }}>
              {faqs.map((faq, index) => (
                <FAQAccordion key={index}>
                  <AccordionSummary
                    expandIcon={
                      <ExpandMoreIcon sx={{ color: 'white', fontSize: '2rem' }} />
                    }
                    aria-controls={`faq-content-${index}`}
                    id={`faq-header-${index}`}
                  >
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: '1.1rem', md: '1.3rem' },
                      }}
                    >
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: { xs: '1rem', md: '1.1rem' },
                        fontWeight: 400,
                      }}
                    >
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </FAQAccordion>
              ))}
            </Box>
          </Box>
        </motion.div>
      </Container>
    </ThemeProvider>
  );
};

export default Pagamento;