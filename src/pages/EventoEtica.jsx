import React, { useState, useEffect } from 'react';
import { Button, Container, TextField, Grid, MenuItem, Avatar, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Checkbox, FormControlLabel } from '@mui/material';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, push } from 'firebase/database';

import WhatsApp from '@mui/icons-material/WhatsApp.js';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_REACT_APP_API_KEY,
    authDomain: import.meta.env.VITE_REACT_APP_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_REACT_APP_DATABASE_URL,
    projectId: import.meta.env.VITE_REACT_APP_PROJECT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const database = getDatabase(app);

function CadastrarMembros() {
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
        const membrosRef = ref(database, 'EventoEticaConatos');
        push(membrosRef, novoMembro);
        setNovoMembro({
            nome: '',
            whatsapp1: '',
            email: '',
        });
        setDialogOpen(true);
        
        // Adicionar um pequeno atraso antes de redirecionar
        setTimeout(() => {
            window.location.href = 'https://chat.whatsapp.com/EoUW2CXCQ6J4ttrdGrWR8R';
        }, 3000); // Redireciona após 3 segundos
    };
    

   

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };
    return (
        <Container id="content-to-print" maxWidth="xl" sx={{ backgroundColor: '#EEF2F2', borderRadius: '15px', marginTop: '1.2em', padding: '1em' , height: '100%'}}>

            <Grid container justifyContent="center" alignItems="center" direction="column" style={{ marginBottom: '0em',  }}>
                
                <Grid item>
                    <Typography sx={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: '1em', textAlign: 'center',}}>
                        PREENCHA OS CAMPOS ABAIXO PARA SE INSCREVER NO EVENTO ONLINE E GRATUITO GABARITANDO O CÓDIGO DE ÉTICA
                    </Typography>
                    <Typography sx={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: '1.8em', textAlign: 'center', padding: '0em' }}>
                       
                    </Typography>
                </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ fontFamily: 'Poppins',  paddingTop: '1em' }}>
                {[
                    { label: 'Nome', name: 'nome',  },
                    { label: 'WhatsAppp', name: 'whatsapp1' },
                    { label: 'Email', name: 'email' },

                    
                  
                ].map(({ label, name, type }) => (
                    <Grid item xs={12} sm={6} md={3} key={name}>
                        {type === 'date' ? (
                            <TextField
                                type="date"
                                label={label}
                                name={name}
                                value={novoMembro[name]}
                                onChange={handleInputChange}
                                fullWidth
                                required // Torna o campo obrigatório
                                InputLabelProps={{ shrink: true }}
                            />
                                             
                        ) : (
                            <TextField
                                label={label}
                                name={name}
                                value={novoMembro[name]}
                                onChange={handleInputChange}
                                fullWidth
                                required
                            />
                        )}
                    </Grid>
                ))}
                <Grid sx={{fontFamily: 'Poppins', margin: '1em', justifyContent: 'center', display: 'flex'}} item xs={12}>
                    <Button sx={{fontFamily: 'Poppins', fontSize: '1em', justifyContent: 'center', padding: '1em 3em',}} variant="contained" color="primary" onClick={handleAddMembro}>
                        INSCREVER-SE
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

export default CadastrarMembros;
