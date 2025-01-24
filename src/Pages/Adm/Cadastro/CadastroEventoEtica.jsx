import React, { useState } from 'react';
import { Button, Container, TextField, Grid, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { getDatabase, ref, push } from "firebase/database"; 
import { app } from "../../../firebase";  

function CadastroEventoEtica() {
    const db = getDatabase(app);  

    const [novoMembro, setNovoMembro] = useState({
        nome: '',
        whatsapp1: '',
        email: '',
    });

    const [dialogOpen, setDialogOpen] = useState(false);

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        setNovoMembro(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleAddMembro = () => {
        const membrosRef = ref(db, 'EventoIdosa');
        push(membrosRef, novoMembro);
        setNovoMembro({
            nome: '',
            whatsapp1: '',
            email: '',
        });
        setDialogOpen(true);
        
        setTimeout(() => {
            window.location.href = 'https://chat.whatsapp.com/BpollfetNOs02qHrMp9hRy';
        }, 3000); 
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    return (
        <Container id="content-to-print" maxWidth="xl" sx={{ backgroundColor: '#EEF2F2', borderRadius: '15px', marginTop: '1.2em', padding: '1em', height: '100%' }}>
            {/* Adicionando a imagem responsiva */}
            <Grid container justifyContent="center" alignItems="center">
                <img 
                    src="https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/ANUNCIOS-CURSOS-FOTOS-SITE%2FCAPAS%20DE%20CURSOS%20600X600%20png2.png?alt=media&token=782e7ec0-4520-457c-a88a-70262622ac42" 
                    alt="Banner do Evento"
                    style={{ width: '50%', height: '50%', borderRadius: '15px', marginBottom: '1em' }}
                />
            </Grid>
            
            <Grid container justifyContent="center" alignItems="center" direction="column" style={{ marginBottom: '0em', }}>
                <Grid item>
                    <Typography sx={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: '1em', textAlign: 'center', }}>
                        PREENCHA OS CAMPOS ABAIXO PARA SE INSCREVER NO EVENTO ONLINE E GRATUITO GABARITANDOO ESTATUTO DA PESSOA IDOSA
                    </Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ fontFamily: 'Poppins', paddingTop: '1em' }}>
                {[
                    { label: 'Nome', name: 'nome' },
                    { label: 'WhatsAppp', name: 'whatsapp1' },
                    { label: 'Email', name: 'email' },
                ].map(({ label, name, type }) => (
                    <Grid item xs={12} sm={6} md={3} key={name}>
                        <TextField
                            label={label}
                            name={name}
                            value={novoMembro[name]}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                    </Grid>
                ))}
                <Grid sx={{ fontFamily: 'Poppins', margin: '1em', justifyContent: 'center', display: 'flex' }} item xs={12}>
                    <Button sx={{ fontFamily: 'Poppins', fontSize: '1em', justifyContent: 'center', padding: '1em 3em', }} variant="contained" color="primary" onClick={handleAddMembro}>
                        ENTRAR NO GRUPO
                    </Button>
                </Grid>
            </Grid>

            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>Cadastro Realizado</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        REDIRECIONANDO PARA O GRUPO DO WHATSAPP
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default CadastroEventoEtica;
