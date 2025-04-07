import { useState, useEffect } from 'react';
import { Box, Button, Typography, Container, Fade } from '@mui/material';
import { auth, db } from '../../firebase';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import imagemSvg from "../../assets/img/img-login-1.svg";
import '../../App.css';
import Depoimentos from '../../components/Depoimentos/Depoimentos';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setDisplayName(user.displayName);
        await createOrUpdateUser(user);
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const createOrUpdateUser = async (user) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      await updateDoc(userRef, { lastLogin: Timestamp.now() });
    } else {
      await setDoc(userRef, {
        name: user.displayName,
        email: user.email,
        createdAt: Timestamp.now(),
        lastLogin: Timestamp.now(),
      });
    }
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Erro no login:", error);
    }
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(145deg, #1A3C3D 0%, #2E7D7F 50%, #4A9A9C 100%)',
        minHeight: '100vh',
        py: 4,
        position: 'relative',
        overflow: 'hidden',
        '&:before': {  // Adiciona um efeito sutil de partículas
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          zIndex: 0,
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '90vh',
          gap: 6,
          px: { xs: 2, md: 4 },
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Seção da Imagem */}
        <Fade in timeout={1200}>
          <Box
            sx={{
              flex: { xs: 1, md: 1.2 },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: { xs: 4, md: 0 },
              position: 'relative',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                width: '120%',
                height: '120%',
                background: 'radial-gradient(circle, rgba(46,125,127,0.2) 0%, transparent 70%)',
                filter: 'blur(20px)',
              }}
            />
            <img
              src={imagemSvg}
              alt="Login Illustration"
              style={{
                width: '100%',
                maxWidth: { xs: '280px', md: '520px' },
                height: 'auto',
                borderRadius: '20px',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.03)',
                },
                position: 'relative',
                zIndex: 1,
              }}
            />
          </Box>
        </Fade>

        {/* Seção de Login */}
        <Fade in timeout={1800}>
          <Box
            sx={{
              flex: 1,
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              p: { xs: 3, md: 6 },
              borderRadius: '24px',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
              maxWidth: { xs: '100%', sm: '450px', md: '600px' },
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Typography
              variant="h3"
              fontWeight="700"
              sx={{
                background: 'linear-gradient(45deg, #2E7D7F, #4A9A9C)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              Bem-vindo(a)!
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              mb={5}
              sx={{
                fontSize: { xs: '1rem', md: '1.2rem' },
                lineHeight: 1.6,
                maxWidth: '400px',
                mx: 'auto',
              }}
            >
              Faça login com sua conta Google e comece sua jornada rumo à aprovação.
            </Typography>
            <Button
              onClick={handleLogin}
              variant="contained"
              size="large"
              startIcon={<img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: 24 }} />}
              sx={{
                background: 'linear-gradient(45deg, #4285F4 30%, #357ABD 90%)',
                color: 'white',
                py: 1.8,
                px: 6,
                borderRadius: '50px',
                fontWeight: '600',
                fontSize: { xs: '1rem', md: '1.2rem' },
                textTransform: 'none',
                boxShadow: '0 4px 15px rgba(66, 133, 244, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(45deg, #357ABD 30%, #2A62A0 90%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(66, 133, 244, 0.4)',
                },
              }}
            >
              Entrar com Google
            </Button>
          </Box>
        </Fade>
      </Container>

      {/* Componente de Depoimentos */}
      <Box sx={{ mt: 8, px: 2 }}>
        <Depoimentos />
      </Box>
    </Box>
  );
}

export default Login;