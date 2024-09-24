import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress } from '@mui/material';
import { initializeApp, getApps, getApp } from 'firebase/app';

// Configuração do Firebase
const firebaseConfig = {
    apiKey: import.meta.env.VITE_REACT_APP_API_KEY,
    authDomain: import.meta.env.VITE_REACT_APP_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_REACT_APP_DATABASE_URL,
    projectId: import.meta.env.VITE_REACT_APP_PROJECT_ID,
};

// Inicializa o Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const database = getDatabase(app);

function MembrosCadastrados() {
    const [membros, setMembros] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const membrosRef = ref(database, 'EventoEticaConatos');
        onValue(membrosRef, (snapshot) => {
            const data = snapshot.val();
            const membrosArray = data ? Object.keys(data).map((key) => ({ id: key, ...data[key] })) : [];
            setMembros(membrosArray);
            setLoading(false);
        });
    }, []);

    return (
        <Container sx={{ marginTop: '2em' }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontFamily: 'Poppins', fontWeight: 600 }}>
                Lista de Contatos Cadastrados no Evento do Código de Ética
            </Typography>
            {loading ? (
                <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Nome</strong></TableCell>
                                <TableCell><strong>WhatsApp</strong></TableCell>
                                <TableCell><strong>Email</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {membros.map((membro) => (
                                <TableRow key={membro.id}>
                                    <TableCell>{membro.nome}</TableCell>
                                    <TableCell>{membro.whatsapp1}</TableCell>
                                    <TableCell>{membro.email}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
}

export default MembrosCadastrados;
