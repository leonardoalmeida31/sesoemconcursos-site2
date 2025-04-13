/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Avatar,
  Tooltip,
  styled,
} from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useUser } from '../../Context/UserContext';
import { getAuth } from 'firebase/auth';
import { motion } from 'framer-motion';

// Estilos personalizados
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(90deg, #1c5253 0%, #2f5659 100%)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  padding: theme.spacing(1, 0),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  fontFamily: '"Poppins", sans-serif',
  fontWeight: 600,
  fontSize: '1rem',
  color: '#ffffff',
  textTransform: 'none',
  padding: theme.spacing(1, 2),
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: 'transparent',
    color: '#FB4C0D',
  },
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '0%',
    height: '2px',
    backgroundColor: '#FB4C0D',
    transition: 'width 0.3s ease',
  },
  '&:hover:after': {
    width: '100%',
  },
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
    minWidth: '200px',
  },
  '& .MuiMenuItem-root': {
    fontFamily: '"Poppins", sans-serif',
    fontWeight: 500,
    fontSize: '1rem',
    color: '#182828',
    padding: theme.spacing(1.5, 3),
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: '#f5f5f5',
      color: '#FB4C0D',
    },
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  border: '2px solid #FB4C0D',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

function HeaderMain({ pages = [] }) {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { user, setUser } = useUser();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const signOut = async () => {
    try {
      const auth = getAuth();
      await auth.signOut();
      setUser(null);
      handleCloseUserMenu();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const defaultPages = [
    { name: 'Questões', path: '/' },
    { name: 'Assinar', path: '/Assinatura' },
    { name: 'Discursivas', path: '/Discursivas' },
    { name: 'Mentorias', path: '/Mentorias' },
    { name: 'Meu Desempenho', path: '/MeuPerfil' },
    { name: 'Ranking', path: '/RankingDesempenho' },
  ];

  // Remove duplicatas (ex.: 'Assinar' aparece duas vezes)
  const pagesToDisplay = pages.length > 0 ? pages : Array.from(
    new Map(defaultPages.map((page) => [page.name, page])).values()
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 1 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <StyledAppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            {/* Logo Desktop */}
            <Typography
              noWrap
              component={Link}
              to="/"
              sx={{
                display: { xs: 'none', md: 'flex' },
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 700,
                fontSize: '1.4rem',
                color: '#ffffff',
                textDecoration: 'none',
                letterSpacing: '-0.02rem',
                '&:hover': {
                  color: '#FB4C0D',
                },
              }}
            >
              SESO em Concursos
            </Typography>

            {/* Menu Mobile */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                sx={{
                  color: '#ffffff',
                  '&:hover': { color: '#FB4C0D' },
                }}
              >
                <MenuIcon fontSize="large" />
              </IconButton>
              <StyledMenu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: 'block', md: 'none' } }}
              >
                {pagesToDisplay.map((page) => (
                  <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                    <Link
                      to={page.path}
                      style={{
                        textDecoration: 'none',
                        color: '#182828',
                        width: '100%',
                      }}
                    >
                      <Typography>{page.name}</Typography>
                    </Link>
                  </MenuItem>
                ))}
              </StyledMenu>
            </Box>

            {/* Logo Mobile */}
            <Typography
              noWrap
              component={Link}
              to="/"
              sx={{
                display: { xs: 'flex', md: 'none' },
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 700,
                fontSize: '1.2rem',
                color: '#ffffff',
                textDecoration: 'none',
                flexGrow: 1,
                textAlign: 'center',
                '&:hover': {
                  color: '#FB4C0D',
                },
              }}
            >
              SESO em Concursos
            </Typography>

            {/* Menu Desktop */}
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'center',
                gap: 2,
              }}
            >
              {pagesToDisplay.map((page) => (
                <StyledButton
                  key={page.name}
                  component={Link}
                  to={page.path}
                  onClick={handleCloseNavMenu}
                >
                  {page.name}
                </StyledButton>
              ))}
            </Box>

            {/* Menu do Usuário */}
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Configurações da conta">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <StyledAvatar alt={user?.displayName || 'Usuário'} src={user?.photoURL} />
                </IconButton>
              </Tooltip>
              <StyledMenu
                sx={{ mt: '50px' }}
                id="menu-user"
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleCloseUserMenu}>
                  <PersonIcon sx={{ mr: 1, color: '#182828' }} />
                  <Link
                    to="/Perfil"
                    style={{ textDecoration: 'none', color: '#182828' }}
                  >
                    Perfil
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleCloseUserMenu}>
                  <WhatsAppIcon sx={{ mr: 1, color: '#182828' }} />
                  <a
                    href="https://api.whatsapp.com/send?phone=5574981265381"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', color: '#182828' }}
                  >
                    Suporte WhatsApp
                  </a>
                </MenuItem>
                <MenuItem onClick={signOut}>
                  <ExitToAppIcon sx={{ mr: 1, color: '#182828' }} />
                  <Typography>Sair/Trocar Conta</Typography>
                </MenuItem>
              </StyledMenu>
            </Box>
          </Toolbar>
        </Container>
      </StyledAppBar>
    </motion.div>
  );
}

export default HeaderMain;