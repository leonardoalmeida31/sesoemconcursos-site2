import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { getDocs, collection, getFirestore } from "firebase/firestore";
import { auth } from "../../../firebase";
import { useNavigate } from "react-router-dom";

function ContadorAssinatura() {
  const db = getFirestore();
  const usersCollectionRef = collection(db, "users");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [visibleUsers, setVisibleUsers] = useState(30);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [emailSearchTerm, setEmailSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [whatsappFilter, setWhatsappFilter] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        if (currentUser.email !== "leonardoalmeida10515@gmail.com") {
          navigate("/");
        } else {
          setUser(currentUser);
          fetchUsers();
        }
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    const usersSnapshot = await getDocs(usersCollectionRef);
    const usersList = usersSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setUsers(usersList);
    setLoading(false);
  };

  useEffect(() => {
    const filtered = users
      .filter((user) => user.paymentInfo) 
      .filter(
        (user) =>
          user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) &&
          user.email?.toLowerCase().includes(emailSearchTerm.toLowerCase()) &&
          (filterType === "" ||
            (filterType === "map" && user.paymentInfo) ||
            (filterType === "null" && !user.paymentInfo)) &&
          (!whatsappFilter || user.whatsapp)
      )
      .sort((a, b) => a.displayName.localeCompare(b.displayName));

    setFilteredUsers(filtered);
  }, [searchTerm, emailSearchTerm, users, filterType, whatsappFilter]);

  const calculateDaysRemaining = (expirationDate) => {
    if (!expirationDate || !expirationDate.seconds) return 0;
    const expiration = new Date(expirationDate.seconds * 1000);
    const today = new Date();
    const diffTime = expiration - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  };

  const getStatusColor = (daysRemaining) => {
    if (daysRemaining > 30) return "green"; 
    if (daysRemaining <= 30 && daysRemaining > 7) return "yellow"; 
    return "red"; 
  };

  const formatDate = (timestamp) => {
    if (timestamp && timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleDateString();
    }
    return "Não disponível";
  };

  return (
    <Container>
      <h1>Gerenciar Usuários</h1>
      <div style={{ marginBottom: "20px" }}>
        <TextField
          label="Buscar Nome"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <TextField
          label="Buscar Email"
          value={emailSearchTerm}
          onChange={(e) => setEmailSearchTerm(e.target.value)}
          style={{ marginRight: "10px" }}
        />
       
        <Button variant="contained" onClick={() => setWhatsappFilter(!whatsappFilter)}>
          {whatsappFilter ? "Mostrar Todos" : "Filtrar WhatsApp"}
        </Button>
      </div>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Data de Expiração</TableCell>
                <TableCell>Faltam</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.slice(0, visibleUsers).map((user) => {
                const daysRemaining = calculateDaysRemaining(user.expirationDate);
                const statusColor = getStatusColor(daysRemaining);

                return (
                  <TableRow key={user.id}>
                    <TableCell>{user.displayName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{formatDate(user.expirationDate)}</TableCell>
                    <TableCell style={{ color: statusColor }}>
                      {daysRemaining} dias
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {filteredUsers.length > visibleUsers && (
        <Button
          variant="contained"
          style={{ marginTop: "20px" }}
          onClick={() => setVisibleUsers((prevVisible) => prevVisible + 30)}
        >
          Carregar Mais
        </Button>
      )}
    </Container>
  );
}

export default ContadorAssinatura;
