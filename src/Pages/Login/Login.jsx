import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { auth, db } from '../../firebase';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import imagemSvg from "../../assets/img/img-login-1.svg";
import '../../App.css';
import Depoimentos from '../../components/Depoimentos/Depoimentos';
import { useNavigate } from 'react-router-dom';
import FacebookPixel from '../FacePixel/FacePixel.jsx';

function Login() {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const navigate = useNavigate();

  // Função para verificar e atualizar a expiração da assinatura
  // const updatePaymentInfoExpiration = async (uid) => {
  //   try {
  //     const userRef = doc(db, "users", uid);
  //     const userDoc = await getDoc(userRef);

  //     if (userDoc.exists()) {
  //       const userData = userDoc.data();
  //       const expirationDate = userData.paymentInfo?.expirationDate;

  //       if (expirationDate) {
  //         const currentDate = new Date();
  //         const expiration = new Date(expirationDate);

  //         if (expiration < currentDate) {
  //           await updateDoc(userRef, { paymentInfo: null });
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Erro ao verificar ou atualizar a expiração da assinatura:", error);
  //   }
  // };

  const updatePaymentInfoExpiration = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const expirationDate = userData.expirationDate;
        const currentDate = new Date();
  
        if (expirationDate) {
          const expiration = new Date(expirationDate);
  
          if (expiration < currentDate) {
            // Assinante: Expiração atingida, remove expirationDate
            await updateDoc(userRef, { expirationDate: null });
          }
        } else {
          // Não assinante: Define nova expiração de 24 horas
          const defaultExpirationDate = new Date();
          defaultExpirationDate.setHours(defaultExpirationDate.getHours() + 24);
  
          await updateDoc(userRef, { expirationDate: defaultExpirationDate.toISOString() });
        }
      }
    } catch (error) {
      console.error("Erro ao verificar ou atualizar a data de expiração:", error);
    }
  };
  

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const uid = user.uid;
      const email = user.email;
      const displayName = user.displayName;
      setDisplayName(displayName);

      const userRef = doc(db, "users", uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          email,
          paymentInfo: null,
          desempenhoPorDisciplina: {},
          displayName,
        });
      } else {
        await updateDoc(userRef, { displayName });
      }

      setUser(user);
      localStorage.setItem('user', JSON.stringify({
        uid,
        email,
        displayName,
      }));
      navigate('/');

      await updatePaymentInfoExpiration(uid);

    } catch (error) {
      console.error("Erro ao fazer login com o Google:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setDisplayName(user.displayName || '');
        localStorage.setItem('user', JSON.stringify(user));

        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { displayName: user.displayName });

        await updatePaymentInfoExpiration(user.uid);
      } else {
        setUser(null);
        setDisplayName('');
        localStorage.removeItem('user');
      }
    });

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    return () => unsubscribe();
  }, []);

  return (
    <Box className="login">
      <p>SESO em Concursos</p>
      <img
        src={imagemSvg}
        alt="Descrição da imagem"
        width="30%"
        height="30%"
      />
      <p>
        Faça login com sua conta do Google para responder questões
        diariamente.
      </p>
      <button onClick={signInWithGoogle} className="login-button">
        Entrar com o Google
      </button>

      <Depoimentos />
    </Box>
  );
}

export default Login;
