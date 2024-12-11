import React, { useState, useEffect } from "react";
import {
    Container,
    Typography,
    TableContainer,
    Table,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    CircularProgress,
    Paper,
    Grid
} from "@mui/material";
import { getDatabase, ref, onValue } from "firebase/database";
import { app } from "../../../firebase";
import { Link } from "react-router-dom";

function CadastroEventoEtica() {
    const [membros, setMembros] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const db = getDatabase(app);
        const membrosRef = ref(db, 'EventoEticaConatos');

        onValue(membrosRef, (snapshot) => {
            const data = snapshot.val();
            const membrosArray = data ? Object.keys(data).map((key) => ({ id: key, ...data[key] })) : [];
            setMembros(membrosArray);
            setLoading(false);
        });
    }, []);

    return (
        <Container sx={{ marginTop: '2em', padding: '2em', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <Typography
                component={Link}
                to="/adm"
                variant="h4"
                gutterBottom
                sx={{ textAlign: 'center', fontFamily: 'Poppins', fontWeight: 600, color: '#333', marginBottom: '2em', textDecoration: 'none' }}
            >
                Lista de Contatos Cadastrados no Evento do Código de Ética
            </Typography>
            {loading ? (
                <CircularProgress sx={{ display: 'block', margin: 'auto', color: '#1c5253;' }} />
            ) : (
                <Grid container justifyContent="center">
                    <Grid item xs={12} md={10} lg={10}>
                        <TableContainer component={Paper} sx={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '8px', marginTop: '27px' }}>
                            <Table>
                                <TableHead sx={{ backgroundColor: '#1c5253;' }}>
                                    <TableRow>
                                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Nome</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>WhatsApp</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Email</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {membros.map((membro) => (
                                        <TableRow key={membro.id} hover>
                                            <TableCell sx={{ fontSize: '1em', padding: '1em' }}>{membro.nome}</TableCell>
                                            <TableCell sx={{ fontSize: '1em', padding: '1em' }}>{membro.whatsapp1}</TableCell>
                                            <TableCell sx={{ fontSize: '1em', padding: '1em' }}>{membro.email}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            )}
        </Container>
    );
}

export default CadastroEventoEtica;
