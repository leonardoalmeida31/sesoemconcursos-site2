import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDocs, getFirestore, collection } from "firebase/firestore";
import { Typography, List, ListItem, ListItemText, Container } from "@mui/material";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_REACT_APP_API_KEY,
  authDomain: import.meta.env.VITE_REACT_APP_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_REACT_APP_PROJECT_ID,
};

function Usuarios() {
  const firebaseApp = initializeApp(firebaseConfig);
  const db = getFirestore(firebaseApp);
  const usersCollectionRef = collection(db, "users");
  const [users, setUsers] = useState([]);
  const [displayNameCount, setDisplayNameCount] = useState(0);
  const [paymentInfoCount, setPaymentInfoCount] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersSnapshot = await getDocs(usersCollectionRef);
      const usersList = usersSnapshot.docs.map((doc) => doc.data());
      setUsers(usersList);

      // Contar o número de displayName e paymentInfo
      let displayNameTotal = 0;
      let paymentInfoTotal = 0;
      usersList.forEach((user) => {
        if (user.displayName) {
          displayNameTotal++;
        }
        if (user.paymentInfo) {
          paymentInfoTotal++;
        }
      });
      setDisplayNameCount(displayNameTotal);
      setPaymentInfoCount(paymentInfoTotal);
    };

    fetchUsers();
  }, []);

  return (
    <Container>
      <Typography variant="h6">Usuários Encontrados: {displayNameCount}</Typography>
      <Typography variant="h6">Total de Assinantes: {paymentInfoCount}</Typography>

      <List>
        {users.map((user, index) => (
          <ListItem key={index}>
            <ListItemText primary={user.displayName || "Nome não disponível"} />
            {user.paymentInfo ? (
              <ListItemText primary="Payment Info:" secondary={
                <List>
                  {Object.entries(user.paymentInfo).map(([key, value]) => (
                    <ListItem key={key}>
                      <ListItemText primary={`${key}: ${value}`} />
                    </ListItem>
                  ))}
                </List>
              } />
            ) : (
              <ListItemText primary="Não Assinante." />
            )}
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default Usuarios;
