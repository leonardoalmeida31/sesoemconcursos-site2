import React, { useState, useEffect } from 'react';
import { Container, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_REACT_APP_API_KEY,
    authDomain: import.meta.env.VITE_REACT_APP_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_REACT_APP_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const TestePix = () => {
    const [user, setUser] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [whatsAppNumber, setWhatsAppNumber] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUser(currentUser);

            // Verificar se o número de WhatsApp já está registrado
            const checkWhatsAppNumber = async () => {
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (!userDoc.exists() || !userDoc.data().whatsAppNumber) {
                    // Iniciar timer de 5 segundos para abrir o dialog
                    setTimeout(() => {
                        setOpenDialog(true);
                    }, 5000);
                }
            };

            checkWhatsAppNumber();
        }
    }, []);

    const handleSaveWhatsAppNumber = async () => {
        if (user && whatsAppNumber) {
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, { whatsAppNumber });
            setOpenDialog(false);
        }
    };

    useEffect(() => {
        if (openDialog) {
            const timer = setTimeout(() => {
                navigate('/'); // Redirecionar para a página principal
            }, 10000); // 10 segundos

            return () => clearTimeout(timer);
        }
    }, [openDialog, navigate]);

    return (
        <Container maxWidth="xl" sx={{ backgroundColor: 'transparent', padding: '1em', borderRadius: '15px', height: '100%' }}>
            <Dialog open={openDialog}>
                <DialogTitle>Insira seu número de WhatsApp para receber novas aulas e questões comentadas, bem como suporte personalizado para tirar dúvidas.</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Digite seu Número de WhatsApp"
                        type="tel"
                        fullWidth
                        value={whatsAppNumber}
                        onChange={(e) => setWhatsAppNumber(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSaveWhatsAppNumber} color="primary">
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default TestePix;
