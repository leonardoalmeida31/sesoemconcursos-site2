import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  updateDoc,
  getDoc,
} from 'firebase/firestore';
import {
  getAuth,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_REACT_APP_API_KEY,
  authDomain: import.meta.env.VITE_REACT_APP_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_REACT_APP_PROJECT_ID,
};

function SuccessPage() {
  const firebaseApp = initializeApp(firebaseConfig);
  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);
  const [user, setUser] = useState(null); // Estado para armazenar informações do usuário
  const [paymentInfo, setPaymentInfo] = useState(null); // Estado para armazenar informações de pagamento

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // O usuário está autenticado
        setUser(user);

        // Extrair os parâmetros da URL
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

            // Atualize as informações de pagamento no documento do usuário
            await updateDoc(userRef, {
              paymentInfo: paymentInfo,
            });

            // Atualize o estado com as informações de pagamento
            setPaymentInfo(paymentInfo);

            // Atualize as informações de acesso
            await atualizarInformacoesDeAcesso(userRef, amountPaid);
          } catch (error) {
            console.error('Erro ao adicionar informações de pagamento:', error);
          }
        } else {
          console.error('Informações de token e valor de pagamento não encontradas na URL.');
        }
      } else {
        // O usuário não está autenticado, você pode redirecionar para a página de login aqui
        console.error('Usuário não autenticado. Redirecionar para a página de login.');
      }
    });

    return () => {
      // Cancelar a inscrição do observador ao desmontar o componente
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

      // Atualize o campo 'expirationDate' no documento do usuário
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
    <div>
      <h1>Pagamento realizado com sucesso!</h1>
      <p>Informações de pagamento:</p>
      {paymentInfo ? (
        <div>
          <p>Token de pagamento: {paymentInfo.paymentTokenId}</p>
          <p>Valor pago: {paymentInfo.amountPaid}</p>
        </div>
      ) : (
        <p>As informações de pagamento estão sendo atualizadas...</p>
      )}
      <a href="/">Voltar à Página Inicial</a>
    </div>
  );
}

export default SuccessPage;
