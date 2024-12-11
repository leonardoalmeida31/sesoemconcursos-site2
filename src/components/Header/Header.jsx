import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Anuncios from "../Anuncios/AnuncioCursos";
import {
    Dialog,
    DialogTitle,
    DialogContentText,
    DialogContent,
    TextField,
    DialogActions,
    AppBar,
    Container,
    Toolbar,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Tooltip,
    Avatar,
    Button
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useUser } from '../../Context/UserContext';
import { db } from '../../firebase';
import { getAuth } from "firebase/auth";
import HeaderMain from "./HeaderMain";

function Header() {
    const [open, setOpen] = useState(false);
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const { user, setUser } = useUser();

    useEffect(() => {
        const checkWhatsappNumber = async () => {
            if (user) {
                try {
                    const userRef = doc(db, 'users', user.uid);
                    const userDoc = await getDoc(userRef);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        if (!userData.whatsapp) {
                            setOpen(true);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };

        checkWhatsappNumber();
    }, [user]);

    const handleSaveWhatsappNumber = async () => {
        if (user) {
            try {
                const userRef = doc(db, 'users', user.uid);
                await updateDoc(userRef, { whatsapp: whatsappNumber });
                setOpen(false);
            } catch (error) {
                console.error("Error updating WhatsApp number:", error);
            }
        }
    };


    return (
        <Box>
            <Anuncios />
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Adicionar Número do WhatsApp</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Por favor, adicione seu número de WhatsApp para atualizar o seu cadastro.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="whatsapp"
                        label="Digite o seu Número do WhatsApp"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSaveWhatsappNumber}>Salvar</Button>
                </DialogActions>
            </Dialog>

            <HeaderMain />
        </Box>
    );
}

export default Header;
