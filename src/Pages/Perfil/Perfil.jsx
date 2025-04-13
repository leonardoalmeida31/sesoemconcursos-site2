import React, { useEffect, useState } from 'react';
import { useUser } from '../../Context/UserContext';
import { format } from 'date-fns';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth, updateProfile } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Grid,
    Chip,
    IconButton,
    Divider,
    Avatar,
    TextField,
    Button,
    Alert,
    CircularProgress,
    styled,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SettingsIcon from '@mui/icons-material/Settings';
import HeaderMain from "../../components/Header/HeaderMain";

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: '20px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
    },
    [theme.breakpoints.down('sm')]: {
        borderRadius: '16px',
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, #205354 30%, #3A7C7D 90%)',
    color: '#FFFFFF',
    padding: '10px 20px',
    borderRadius: '10px',
    textTransform: 'none',
    fontWeight: 600,
    fontFamily: '"Inter", sans-serif',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
        background: 'linear-gradient(45deg, #3A7C7D 30%, #205354 90%)',
        boxShadow: '0 4px 15px rgba(32, 83, 84, 0.4)',
        transform: 'scale(1.05)',
    },
    '&:disabled': {
        background: '#B0BEC5',
        color: '#FFFFFF',
    },
    [theme.breakpoints.down('sm')]: {
        padding: '8px 16px',
        fontSize: '0.9rem',
    },
}));

const StyledOutlineButton = styled(Button)(({ theme }) => ({
    border: '2px solid #205354',
    color: '#205354',
    padding: '8px 18px',
    borderRadius: '10px',
    textTransform: 'none',
    fontWeight: 600,
    fontFamily: '"Inter", sans-serif',
    transition: 'all 0.3s ease',
    '&:hover': {
        background: '#E6F4F1',
        borderColor: '#3A7C7D',
        color: '#3A7C7D',
        transform: 'scale(1.05)',
    },
    [theme.breakpoints.down('sm')]: {
        padding: '6px 14px',
        fontSize: '0.9rem',
    },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        background: '#F5F7FA',
        fontFamily: '"Inter", sans-serif',
        '& fieldset': {
            borderColor: '#E0E7FF',
        },
        '&:hover fieldset': {
            borderColor: '#205354',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#205354',
            boxShadow: '0 0 8px rgba(32, 83, 84, 0.2)',
        },
    },
    '& .MuiInputLabel-root': {
        color: '#5A6A6A',
        fontFamily: '"Inter", sans-serif',
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: '#205354',
    },
    [theme.breakpoints.down('sm')]: {
        '& .MuiInputBase-input': {
            fontSize: '0.85rem',
        },
        '& .MuiInputLabel-root': {
            fontSize: '0.85rem',
        },
    },
}));

const StyledAlert = styled(Alert)(({ theme }) => ({
    borderRadius: '12px',
    background: 'linear-gradient(45deg, #E6F4F1 30%, #F5F7FA 90%)',
    color: '#205354',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    fontFamily: '"Inter", sans-serif',
    padding: '12px 20px',
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.8rem',
        padding: '10px 16px',
    },
}));

const avatarVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
        scale: 1,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
};

const Perfil = () => {
    const { user, displayName, desempenhoPorDisciplina, paymentInfo } = useUser();
    const [expirationDate, setExpirationDate] = useState(null);
    const [whatsapp, setWhatsapp] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editedName, setEditedName] = useState(displayName || '');
    const [editedWhatsapp, setEditedWhatsapp] = useState('');
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ open: false, severity: 'success', message: '' });

    useEffect(() => {
        const fetchUserData = async () => {
            if (user?.uid) {
                try {
                    const userRef = doc(db, 'users', user.uid);
                    const docSnap = await getDoc(userRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        if (data.expirationDate) {
                            setExpirationDate(data.expirationDate.toDate ? data.expirationDate.toDate() : data.expirationDate);
                        }
                        if (data.whatsapp) {
                            setWhatsapp(data.whatsapp);
                            setEditedWhatsapp(data.whatsapp);
                        }
                    }
                } catch (error) {
                    console.error('Erro ao buscar dados do usuário:', error);
                    setAlert({ open: true, severity: 'error', message: 'Erro ao carregar dados.' });
                }
            }
        };

        fetchUserData();
    }, [user]);

    useEffect(() => {
        setEditedName(displayName || '');
    }, [displayName]);

    const handleEditToggle = () => {
        setEditMode(!editMode);
        setEditedName(displayName || '');
        setEditedWhatsapp(whatsapp || '');
    };

    const handleSave = async () => {
        if (!user?.uid) return;

        setLoading(true);
        try {
            const auth = getAuth();
            const userRef = doc(db, 'users', user.uid);

            await updateProfile(auth.currentUser, {
                displayName: editedName.trim(),
            });

            await updateDoc(userRef, {
                displayName: editedName.trim(),
                whatsapp: editedWhatsapp.trim(),
            });

            setWhatsapp(editedWhatsapp.trim());
            setEditMode(false);
            setAlert({ open: true, severity: 'success', message: 'Dados atualizados com sucesso! Atualize a página.' });
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            setAlert({ open: true, severity: 'error', message: 'Erro ao salvar dados.' });
        } finally {
            setLoading(false);
        }
    };

    const handleAlertClose = () => {
        setAlert({ ...alert, open: false });
    };

    const performanceEntries = desempenhoPorDisciplina
        ? Object.entries(desempenhoPorDisciplina)
        : [];

    return (
        <Box >
            <Box sx={{marginBottom: '1em'}}>
            <HeaderMain  />
            </Box>
          

            <Container
                maxWidth="md"
                sx={{
                    py: { xs: 3, md: 6 },
                    minHeight: '100vh',
                    background: 'linear-gradient(180deg, #3A7C7D 0%, #205354 50%, #1A4344 100%)',
                    fontFamily: '"Inter", sans-serif',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1), transparent 70%)',
                        zIndex: 0,
                    },
                }}
            >


                <AnimatePresence>
                    {alert.open && (
                        <motion.div
                            initial={{ opacity: 0, y: -30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.4, ease: 'easeInOut' }}
                            style={{ position: 'relative', zIndex: 2 }}
                        >
                            <StyledAlert
                                severity={alert.severity}
                                onClose={handleAlertClose}
                            >
                                {alert.message}
                            </StyledAlert>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{ position: 'relative', zIndex: 2 }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 3, md: 6 } }}>
                        <IconButton
                            component={Link}
                            to="/"
                            sx={{
                                color: '#F5F7FA',
                                background: 'rgba(255, 255, 255, 0.1)',
                                '&:hover': {
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    transform: 'scale(1.1)',
                                },
                                transition: 'all 0.3s ease',
                            }}
                        >
                            <BsArrowLeft size={26} />
                        </IconButton>
                        <Typography
                            variant="h4"
                            component="h1"
                            sx={{
                                ml: 2,
                                fontFamily: '"Poppins", sans-serif',
                                fontWeight: 700,
                                color: '#F5F7FA',
                                fontSize: { xs: '1.8rem', md: '3rem' },
                                textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                            }}
                        >
                            Perfil do Usuário
                        </Typography>
                    </Box>
                </motion.div>

                <Grid container spacing={{ xs: 2, md: 4 }} sx={{ position: 'relative', zIndex: 2 }}>
                    {/* Informações Pessoais */}
                    <Grid item xs={12}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <StyledCard>
                                <CardContent sx={{ p: { xs: 2, md: 5 } }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                        <Typography
                                            variant="h6"
                                            component="h2"
                                            sx={{
                                                fontFamily: '"Poppins", sans-serif',
                                                fontWeight: 600,
                                                color: '#1A2525',
                                                fontSize: { xs: '1.2rem', md: '1.8rem' },
                                            }}
                                        >
                                            Informações Pessoais
                                        </Typography>
                                        <IconButton
                                            onClick={handleEditToggle}
                                            sx={{
                                                color: '#205354',
                                                background: 'rgba(32, 83, 84, 0.1)',
                                                '&:hover': {
                                                    background: 'rgba(32, 83, 84, 0.2)',
                                                    transform: 'rotate(90deg)',
                                                },
                                                transition: 'all 0.3s ease',
                                            }}
                                        >
                                            {editMode ? <CancelIcon /> : <EditIcon />}
                                        </IconButton>
                                    </Box>
                                    <Divider sx={{ mb: 3, background: 'linear-gradient(to right, transparent, #205354, transparent)' }} />
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <motion.div variants={avatarVariants} initial="initial" animate="animate">
                                            <Avatar
                                                src={user?.photoURL || ''}
                                                alt={displayName || 'Usuário'}
                                                sx={{
                                                    width: { xs: 60, md: 90 },
                                                    height: { xs: 60, md: 90 },
                                                    mr: { xs: 2, md: 3 },
                                                    border: '3px solid #205354',
                                                    boxShadow: '0 0 15px rgba(32, 83, 84, 0.3)',
                                                    transition: 'box-shadow 0.3s ease',
                                                }}
                                            />
                                        </motion.div>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                color: '#5A6A6A',
                                                fontFamily: '"Inter", sans-serif',
                                                fontSize: { xs: '0.85rem', md: '1.1rem' },
                                            }}
                                        >
                                            Foto do Perfil
                                        </Typography>
                                    </Box>
                                    <AnimatePresence mode="wait">
                                        {editMode ? (
                                            <motion.div
                                                key="edit"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ duration: 0.4 }}
                                            >
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                    <StyledTextField
                                                        label="Nome"
                                                        value={editedName}
                                                        onChange={(e) => setEditedName(e.target.value)}
                                                        fullWidth
                                                        variant="outlined"
                                                        InputProps={{
                                                            startAdornment: (
                                                                <PersonIcon sx={{ color: '#205354', mr: 1 }} />
                                                            ),
                                                        }}
                                                    />
                                                    <StyledTextField
                                                        label="WhatsApp"
                                                        value={editedWhatsapp}
                                                        onChange={(e) => setEditedWhatsapp(e.target.value)}
                                                        fullWidth
                                                        variant="outlined"
                                                        InputProps={{
                                                            startAdornment: (
                                                                <PhoneIcon sx={{ color: '#205354', mr: 1 }} />
                                                            ),
                                                        }}
                                                    />
                                                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                                        <StyledButton
                                                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                                            onClick={handleSave}
                                                            disabled={loading}
                                                        >
                                                            Salvar
                                                        </StyledButton>
                                                        <StyledOutlineButton
                                                            startIcon={<CancelIcon />}
                                                            onClick={handleEditToggle}
                                                            disabled={loading}
                                                        >
                                                            Cancelar
                                                        </StyledOutlineButton>
                                                    </Box>
                                                </Box>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="view"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.4 }}
                                            >
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: { xs: 80, md: 120 } }}>
                                                            <PersonIcon sx={{ color: '#205354', mr: 1, fontSize: { xs: '1.1rem', md: '1.5rem' } }} />
                                                            <Typography
                                                                variant="body1"
                                                                sx={{
                                                                    fontWeight: 500,
                                                                    color: '#5A6A6A',
                                                                    fontSize: { xs: '0.85rem', md: '1.1rem' },
                                                                }}
                                                            >
                                                                Nome:
                                                            </Typography>
                                                        </Box>
                                                        <Typography
                                                            variant="body1"
                                                            sx={{
                                                                color: '#1A2525',
                                                                fontSize: { xs: '0.85rem', md: '1.1rem' },
                                                                wordBreak: 'break-word',
                                                                flex: 1,
                                                            }}
                                                        >
                                                            {displayName || 'N/A'}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: { xs: 80, md: 120 } }}>
                                                            <EmailIcon sx={{ color: '#205354', mr: 1, fontSize: { xs: '1.1rem', md: '1.5rem' } }} />
                                                            <Typography
                                                                variant="body1"
                                                                sx={{
                                                                    fontWeight: 500,
                                                                    color: '#5A6A6A',
                                                                    fontSize: { xs: '0.85rem', md: '1.1rem' },
                                                                }}
                                                            >
                                                                Email:
                                                            </Typography>
                                                        </Box>
                                                        <Typography
                                                            variant="body1"
                                                            sx={{
                                                                color: '#1A2525',
                                                                fontSize: { xs: '0.85rem', md: '1.1rem' },
                                                                wordBreak: 'break-word',
                                                                flex: 1,
                                                            }}
                                                        >
                                                            {user?.email || 'N/A'}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: { xs: 80, md: 120 } }}>
                                                            <PhoneIcon sx={{ color: '#205354', mr: 1, fontSize: { xs: '1.1rem', md: '1.5rem' } }} />
                                                            <Typography
                                                                variant="body1"
                                                                sx={{
                                                                    fontWeight: 500,
                                                                    color: '#5A6A6A',
                                                                    fontSize: { xs: '0.85rem', md: '1.1rem' },
                                                                }}
                                                            >
                                                                WhatsApp:
                                                            </Typography>
                                                        </Box>
                                                        <Typography
                                                            variant="body1"
                                                            sx={{
                                                                color: '#1A2525',
                                                                fontSize: { xs: '0.85rem', md: '1.1rem' },
                                                                wordBreak: 'break-word',
                                                                flex: 1,
                                                            }}
                                                        >
                                                            {whatsapp || 'Não Disponível'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </CardContent>
                            </StyledCard>
                        </motion.div>
                    </Grid>

                    {/* Status da Assinatura */}
                    <Grid item xs={12}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <StyledCard>
                                <CardContent sx={{ p: { xs: 2, md: 5 } }}>
                                    <Typography
                                        variant="h6"
                                        component="h2"
                                        sx={{
                                            fontFamily: '"Poppins", sans-serif',
                                            fontWeight: 600,
                                            color: '#1A2525',
                                            mb: 3,
                                            fontSize: { xs: '1.2rem', md: '1.8rem' },
                                        }}
                                    >
                                        Status da Assinatura
                                    </Typography>
                                    <Divider sx={{ mb: 3, background: 'linear-gradient(to right, transparent, #205354, transparent)' }} />
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    minWidth: { xs: 80, md: 120 },
                                                    fontWeight: 500,
                                                    color: '#5A6A6A',
                                                    fontSize: { xs: '0.85rem', md: '1.1rem' },
                                                }}
                                            >
                                                Assinante:
                                            </Typography>
                                            <Chip
                                                label={paymentInfo ? 'Sim' : 'Não'}
                                                color={paymentInfo ? 'success' : 'error'}
                                                size="small"
                                                sx={{
                                                    fontWeight: 600,
                                                    backgroundColor: paymentInfo ? '#D4EDDA' : '#F8D7DA',
                                                    color: paymentInfo ? '#155724' : '#721C24',
                                                    fontFamily: '"Inter", sans-serif',
                                                }}
                                            />
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    minWidth: { xs: 80, md: 120 },
                                                    fontWeight: 500,
                                                    color: '#5A6A6A',
                                                    fontSize: { xs: '0.85rem', md: '1.1rem' },
                                                }}
                                            >
                                                Data de Expiração:
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    color: '#1A2525',
                                                    fontSize: { xs: '0.85rem', md: '1.1rem' },
                                                    wordBreak: 'break-word',
                                                    flex: 1,
                                                }}
                                            >
                                                {paymentInfo && expirationDate
                                                    ? format(expirationDate, 'dd/MM/yyyy HH:mm:ss')
                                                    : 'Nenhuma data disponível'}
                                            </Typography>
                                        </Box>
                                        {paymentInfo && (
                                            <Box sx={{ mt: 2 }}>
                                                <StyledOutlineButton
                                                    startIcon={<SettingsIcon />}
                                                    href="https://billing.stripe.com/p/login/eVa4iT7sY1RB8laeUU"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Gerenciar/Cancelar Assinatura (Cartão de Crédito)
                                                </StyledOutlineButton>
                                            </Box>
                                        )}
                                    </Box>
                                </CardContent>
                            </StyledCard>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Perfil;