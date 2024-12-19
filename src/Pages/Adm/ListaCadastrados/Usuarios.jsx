import React, { useEffect, useState } from 'react';
import { Container, Grid, Modal, Card, CardContent, Box, Typography, TextField, Button, Select, MenuItem, Checkbox, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material'; import { getDocs, collection, getFirestore, doc, updateDoc } from "firebase/firestore";
import { auth } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import { deleteDoc } from 'firebase/firestore';

import { Timestamp } from 'firebase/firestore';


function Usuarios() {
    const db = getFirestore();
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
    const [filterType, setFilterType] = useState("");
    const [whatsappFilter, setWhatsappFilter] = useState(false);
    const [whatsappActiveCount, setWhatsappActiveCount] = useState(0);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const [openEditModal, setOpenEditModal] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const [updatedName, setUpdatedName] = useState("");
    const [updatedEmail, setUpdatedEmail] = useState("");
    const [updatedWhatsapp, setUpdatedWhatsapp] = useState("");
    const [updatedExpirationDate, setUpdatedExpirationDate] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                if (currentUser.email !== 'leonardoalmeida10515@gmail.com') {
                    navigate('/');
                } else {
                    setUser(currentUser);
                    fetchUsers();
                }
            } else {
                navigate('/login');
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
        const fetchUsers = async () => {
            setLoading(true);
            const usersSnapshot = await getDocs(usersCollectionRef);
            const usersList = usersSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setUsers(usersList);

            const initialPaymentTypes = {};
            const initialAmountPaids = {};

            let displayNameTotal = 0;
            let paymentInfoTotal = 0;
            let whatsappTotal = 0;

            usersList.forEach((user) => {
                initialPaymentTypes[user.id] = user.paymentInfo ? "map" : "null";
                initialAmountPaids[user.id] = user.paymentInfo ? user.paymentInfo.amountPaid : "";

                if (user.displayName) {
                    displayNameTotal++;
                }
                if (user.paymentInfo) {
                    paymentInfoTotal++;
                }
                if (user.whatsapp) {
                    whatsappTotal++;
                }
            });

            setPaymentTypes(initialPaymentTypes);
            setAmountPaids(initialAmountPaids);
            setDisplayNameCount(displayNameTotal);
            setPaymentInfoCount(paymentInfoTotal);
            setWhatsappActiveCount(whatsappTotal);

            setLoading(false);
        };

        fetchUsers();
    }, []);


    useEffect(() => {
        const filtered = users
            .filter((user) =>
                user.displayName?.toLowerCase().includes(finalSearchTerm.toLowerCase()) &&
                user.email?.toLowerCase().includes(emailSearchTerm.toLowerCase()) &&
                (filterType === "" || (filterType === "map" && user.paymentInfo) || (filterType === "null" && !user.paymentInfo)) &&
                (!whatsappFilter || user.whatsapp)
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

    const handleDeleteUser = async (userId) => {
        try {
            const userDocRef = doc(db, "users", userId);
            await deleteDoc(userDocRef);
            setUsers(users.filter((user) => user.id !== userId));
        } catch (error) {
            console.error("Error deleting user: ", error);
        }
    };

    const formatTimestamp = (timestamp) => {
        if (timestamp && timestamp.seconds) {
            const date = new Date(timestamp.seconds * 1000);

            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZoneName: 'short',
                timeZone: 'America/Sao_Paulo',
            };

            return new Intl.DateTimeFormat('pt-BR', options).format(date);
        }
        return "Não disponível";
    };

    const handleEditUser = (user) => {
        setUserToEdit(user);
        setUpdatedName(user.displayName || "");
        setUpdatedEmail(user.email || "");
        setUpdatedWhatsapp(user.whatsapp || "");


        if (user.expirationDate) {
            const formattedDate = formatTimestamp(user.expirationDate);
            setUpdatedExpirationDate(formattedDate);
        } else {
            setUpdatedExpirationDate("");
        }

        setOpenEditModal(true);
    };


    const handleSaveChanges = async () => {
        const userDocRef = doc(db, "users", userToEdit.id);

        const expirationDate = updatedExpirationDate ? new Date(updatedExpirationDate) : null;

        if (expirationDate && !isNaN(expirationDate)) {
            await updateDoc(userDocRef, {
                displayName: updatedName,
                email: updatedEmail,
                whatsapp: updatedWhatsapp,
                expirationDate: Timestamp.fromDate(expirationDate),
            });
        } else {

            console.log("Data de expiração inválida.");
        }


        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === userToEdit.id
                    ? {
                        ...user,
                        displayName: updatedName,
                        email: updatedEmail,
                        whatsapp: updatedWhatsapp,
                        expirationDate: expirationDate ? Timestamp.fromDate(expirationDate) : null, // Guardando no formato Timestamp
                    }
                    : user
            )
        );


        setOpenEditModal(false);
    };



    const formatDate = (timestamp) => {
        if (timestamp && timestamp.seconds) {
            const date = new Date(timestamp.seconds * 1000);

            const options = {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: 'America/Sao_Paulo',
                timeZoneName: 'short',
            };

            return new Intl.DateTimeFormat('pt-BR', options).format(date);
        }
        return "Não disponível";
    };


    return (
        <Container maxWidth="lg" sx={{ marginTop: 4 }}>
            <Grid container spacing={4} justifyContent="center" sx={{ marginBottom: '2em' }}>
                <Grid item xs={12} sm={4}>
                    <Card sx={{ backgroundColor: '#66CDAA', color: 'white', minHeight: '100px' }}>
                        <CardContent>
                            <Typography variant="h6" align="center">Usuários Encontrados: {displayNameCount}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card sx={{ backgroundColor: '#32CD32', color: 'white', minHeight: '100px', }}>
                        <CardContent>
                            <Typography variant="h6" align="center">Total de Assinantes: {paymentInfoCount}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card sx={{ backgroundColor: '#9ACD32', color: 'white', minHeight: '100px' }}>
                        <CardContent>
                            <Typography variant="h6" align="center">Total de usuários com WhatsApp ativo: {whatsappActiveCount}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>


            <Grid container spacing={4} justifyContent="center">
                <Grid item xs={12} sm={5} md={4}>
                    <TextField
                        label="Pesquisar por nome"
                        variant="outlined"
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Grid>

                <Grid item xs={12} sm={5} md={4}>
                    <TextField
                        label="Pesquisar por email"
                        variant="outlined"
                        fullWidth
                        value={emailSearchTerm}
                        onChange={(e) => setEmailSearchTerm(e.target.value)}
                    />
                </Grid>
            </Grid>


            <Grid container justifyContent="center" sx={{ marginTop: '2em' }}>
                <Button onClick={handleSearch} variant="contained" color="primary">
                    Pesquisar
                </Button>
            </Grid>
            <Grid container spacing={2} justifyContent="center" sx={{ marginTop: '2em' }}>
                <Grid item xs={12} sm={5} md={4}>
                    <Select
                        value={filterType}
                        onChange={handleFilterChange}
                        fullWidth
                        displayEmpty
                        inputProps={{ 'aria-label': 'Filtro' }}
                    >
                        <MenuItem value="">Todos</MenuItem>
                        <MenuItem value="map">Assinantes</MenuItem>
                        <MenuItem value="null">Não Assinantes</MenuItem>
                    </Select>
                </Grid>

                <Grid item xs={12} sm={5} md={4}>
                    <FormControlLabel
                        control={<Checkbox checked={whatsappFilter} onChange={(e) => setWhatsappFilter(e.target.checked)} />}
                        label="WhatsApp Ativo"
                    />
                </Grid>
            </Grid>


            <TableContainer component={Paper} sx={{ marginTop: '2em' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>WhatsApp</TableCell>
                            <TableCell>Data de Expiração</TableCell>
                            <TableCell>Tipo de Pagamento</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.slice(0, visibleUsers).map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.displayName || "Nome não disponível"}</TableCell>
                                <TableCell>{user.email || "Email não disponível"}</TableCell>
                                <TableCell>{user.whatsapp || "WhatsApp não disponível"}</TableCell>
                                <TableCell>{formatDate(user.expirationDate)}</TableCell>
                                <TableCell>
                                    {user.paymentInfo ? (
                                        <>
                                            {user.paymentInfo.type} - {user.paymentInfo.amountPaid}
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
                                                    fullWidth
                                                    sx={{ marginTop: 2 }}
                                                />
                                            )}
                                        </>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Button variant="outlined" color="primary" size="small" onClick={() => handleEditUser(user)}>
                                        Editar
                                    </Button>
                                    <Button variant="outlined" color="error" size="small" sx={{ marginLeft: 1 }} onClick={() => handleDeleteUser(user.id)}>
                                        Excluir
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {loading && <Grid container justifyContent="center" sx={{ marginTop: 2 }}><CircularProgress /></Grid>}

            <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
                <Box sx={{ width: 400, padding: 3, backgroundColor: 'white', margin: 'auto', marginTop: '10%' }}>
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>Editar Usuário</Typography>
                    <TextField
                        label="Nome"
                        variant="outlined"
                        fullWidth
                        value={updatedName}
                        onChange={(e) => setUpdatedName(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        value={updatedEmail}
                        onChange={(e) => setUpdatedEmail(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        label="WhatsApp"
                        variant="outlined"
                        fullWidth
                        value={updatedWhatsapp}
                        onChange={(e) => setUpdatedWhatsapp(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />
                    {/* <TextField
                        label="Data de Expiração"
                        type="date"
                        variant="outlined"
                        fullWidth
                        value={updatedExpirationDate}
                        onChange={(e) => setUpdatedExpirationDate(e.target.value)}
                        sx={{ marginBottom: 2 }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    /> */}
                    <TextField
                        label="Data de Expiração"
                        type="date"
                        variant="outlined"
                        fullWidth
                        value={updatedExpirationDate}
                        onChange={(e) => setUpdatedExpirationDate(e.target.value)}
                        sx={{ marginBottom: 2 }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                    <Button
                        variant="contained"
                        fullWidth
                        color="primary"
                        onClick={handleSaveChanges}
                    >
                        Salvar Alterações
                    </Button>
                </Box>
            </Modal>

            {filteredUsers.length > visibleUsers && !loading && (
                <Grid container justifyContent="center" sx={{ marginTop: 3 }}>
                    <Button onClick={loadMoreUsers} variant="outlined" color="primary">
                        Carregar mais
                    </Button>
                </Grid>
            )}
        </Container>
    )
}

export default Usuarios;