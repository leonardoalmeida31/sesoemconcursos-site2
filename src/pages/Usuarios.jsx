import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDocs, getFirestore, collection, updateDoc, doc } from "firebase/firestore";
import { Typography, List, ListItem, ListItemText, Container, Select, MenuItem, TextField, Button, CircularProgress, Grid, Checkbox, FormControlLabel } from "@mui/material";

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
  const [paymentTypes, setPaymentTypes] = useState({});
  const [amountPaids, setAmountPaids] = useState({});
  const [visibleUsers, setVisibleUsers] = useState(30);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [emailSearchTerm, setEmailSearchTerm] = useState("");
  const [finalSearchTerm, setFinalSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filterType, setFilterType] = useState(""); // Novo estado para o filtro de tipo de pagamento
  const [whatsappFilter, setWhatsappFilter] = useState(false); // Novo estado para o filtro de WhatsApp
  const [whatsappActiveCount, setWhatsappActiveCount] = useState(0); // Novo estado


  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const usersSnapshot = await getDocs(usersCollectionRef);
      const usersList = usersSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setUsers(usersList);
  
      const initialPaymentTypes = {};
      const initialAmountPaids = {};
  
      let displayNameTotal = 0;
      let paymentInfoTotal = 0;
      let whatsappTotal = 0; // Inicializa o contador de WhatsApp
  
      usersList.forEach((user) => {
        initialPaymentTypes[user.id] = user.paymentInfo ? "map" : "null";
        initialAmountPaids[user.id] = user.paymentInfo ? user.paymentInfo.amountPaid : "";
  
        if (user.displayName) {
          displayNameTotal++;
        }
        if (user.paymentInfo) {
          paymentInfoTotal++;
        }
        if (user.whatsapp) { // Incrementa se o usuário tiver WhatsApp ativo
          whatsappTotal++;
        }
      });
  
      setPaymentTypes(initialPaymentTypes);
      setAmountPaids(initialAmountPaids);
      setDisplayNameCount(displayNameTotal);
      setPaymentInfoCount(paymentInfoTotal);
      setWhatsappActiveCount(whatsappTotal); // Atualiza o estado de WhatsApp ativo
  
      setLoading(false);
    };
  
    fetchUsers();
  }, []);
  

  useEffect(() => {
    // Filtra e ordena a lista de usuários sempre que searchTerm, emailSearchTerm, whatsappFilter ou filterType muda
    const filtered = users
      .filter((user) =>
        user.displayName?.toLowerCase().includes(finalSearchTerm.toLowerCase()) &&
        user.email?.toLowerCase().includes(emailSearchTerm.toLowerCase()) &&
        (filterType === "" || (filterType === "map" && user.paymentInfo) || (filterType === "null" && !user.paymentInfo)) &&
        (!whatsappFilter || user.whatsapp) // Adiciona filtro para WhatsApp
      )
      .sort((a, b) => a.displayName.localeCompare(b.displayName));

    setFilteredUsers(filtered);
  }, [finalSearchTerm, emailSearchTerm, users, filterType, whatsappFilter]);

  const handlePaymentInfoChange = async (userId, paymentType, amount) => {
    const userDocRef = doc(db, "users", userId);
    const newPaymentInfo = paymentType === "null" ? null : { amountPaid: amount };
    await updateDoc(userDocRef, { paymentInfo: newPaymentInfo });
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, paymentInfo: newPaymentInfo } : user
      )
    );
  };

  const handlePaymentTypeChange = (userId, newPaymentType) => {
    setPaymentTypes((prev) => ({ ...prev, [userId]: newPaymentType }));
    if (newPaymentType === "null") {
      handlePaymentInfoChange(userId, "null", null);
    }
  };

  const handleAmountPaidChange = (userId, newAmount) => {
    setAmountPaids((prev) => ({ ...prev, [userId]: newAmount }));
    handlePaymentInfoChange(userId, "map", newAmount);
  };

  const loadMoreUsers = async () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleUsers((prevVisible) => prevVisible + 100);
      setLoading(false);
    }, 1000);
  };

  const handleSearch = () => {
    setFinalSearchTerm(searchTerm);
  };

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
  };

  // Função para formatar o timestamp do Firestore
  const formatDate = (timestamp) => {
    if (timestamp && timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleDateString(); // Ajuste o formato conforme necessário
    }
    return "Não disponível";
  };

  return (
    <Container>
      <Typography variant="h6">Usuários Encontrados: {displayNameCount}</Typography>
      <Typography variant="h6">Total de Assinantes: {paymentInfoCount}</Typography>
      <Typography variant="h6">Total de usuários com WhatsApp ativo: {whatsappActiveCount}</Typography>


      <Grid container spacing={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1em' }}>
        <Grid container spacing={2} item xs={12} sm={10} md={6} lg={10} xl={4} sx={{ alignItems: 'center', justifyContent: 'center' }}>
          <TextField
            label="Pesquisar por nome"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>

        <Grid container spacing={2} item xs={12} sm={10} md={6} lg={10} xl={4} sx={{ alignItems: 'center', marginLeft: '1em' }}>
          <TextField
            label="Pesquisar por email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={emailSearchTerm}
            onChange={(e) => setEmailSearchTerm(e.target.value)}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} item xs={12} sm={6} md={4} lg={6} xl={5} sx={{ alignItems: 'center', marginBottom: '1em' }}>
        <Button onClick={handleSearch} variant="contained" color="primary">
          Pesquisar
        </Button>
      </Grid>

      <Grid item xs={12} sm={6} sx={{ alignItems: 'center', marginTop: '1em' }}>
        <Select
          value={filterType}
          onChange={handleFilterChange}
          displayEmpty
          fullWidth
          margin="normal"
          inputProps={{ 'aria-label': 'Filtro' }}
          sx={{ alignItems: 'center' }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="map">Assinantes</MenuItem>
          <MenuItem value="null">Não Assinantes</MenuItem>
        </Select>
      </Grid>

      <Grid item xs={12} sm={6} sx={{ alignItems: 'center', marginTop: '1em' }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={whatsappFilter}
              onChange={(e) => setWhatsappFilter(e.target.checked)}
            />
          }
          label="WhatsApp Ativo"
        />
      </Grid>

      <List>
        {filteredUsers.slice(0, visibleUsers).map((user) => (
          <ListItem key={user.id}>
            <ListItemText
              primary={user.displayName || "Nome não disponível"}
              secondary={
                <>
                  <Typography variant="body2">
                    Email: {user.email || "Email não disponível"}
                  </Typography>
                  <Typography variant="body2">
                    WhatsApp: {user.whatsapp || "WhatsApp não disponível"}
                  </Typography>
                  <Typography variant="body2">
                    Data de Expiração: {formatDate(user.expirationDate)}
                  </Typography>
                  <Typography variant="body2">
                    Data Manual: {formatDate(user.vencimento)}
                  </Typography>
                  <Typography variant="body2">
                    Data Expiração MP: {formatDate(user.vencimentoPix)}
                  </Typography>
                  {user.paymentInfo ? (
                    <>
                      <Typography variant="body2">
                        Tipo de Pagamento: {user.paymentInfo.type}
                      </Typography>
                      <Typography variant="body2">
                        Valor Pago: {user.paymentInfo.amountPaid}
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Select
                        value={paymentTypes[user.id] || ""}
                        onChange={(e) => handlePaymentTypeChange(user.id, e.target.value)}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Tipo de Pagamento' }}
                      >
                        <MenuItem value="">Selecionar tipo de pagamento</MenuItem>
                        <MenuItem value="map">Assinante</MenuItem>
                        <MenuItem value="null">Não Assinante</MenuItem>
                      </Select>
                      {paymentTypes[user.id] === "map" && (
                        <TextField
                          label="Valor Pago"
                          variant="outlined"
                          value={amountPaids[user.id] || ""}
                          onChange={(e) => handleAmountPaidChange(user.id, e.target.value)}
                        />
                      )}
                    </>
                  )}
                </>
              }
            />
          </ListItem>
        ))}
      </List>

      {loading && <CircularProgress />}

      {filteredUsers.length > visibleUsers && !loading && (
        <Button onClick={loadMoreUsers} variant="outlined" sx={{ marginTop: '1em' }}>
          Carregar mais
        </Button>
      )}
    </Container>
  );
}

export default Usuarios;
