/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { AppBar, Container, Toolbar, Typography, Box, IconButton, Menu, MenuItem, Button, Avatar,Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import { useUser } from '../../Context/UserContext';
import { db } from '../../firebase';
import { getAuth } from "firebase/auth";

function HeaderMain({ pages = []}) {
    const [open, setOpen] = useState(false);
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
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const defaultPages = [
        { name: 'Aulas', path: '/Aulas' },
        { name: 'Discursivas', path: '/Discursivas' },
        { name: 'Mentorias', path: '/Mentorias' },
        { name: 'Meu Desempenho', path: '/MeuPerfil' },
        { name: 'Ranking', path: '/RankingDesempenho' },
        { name: 'Assinar com Cartão', path: '/Assinatura' },
        { name: 'Assinar com Pix', path: '/AssinarPIX' },
    ];

    const pagesToDisplay = pages.length > 0 ? pages : defaultPages;

    return (
        <AppBar sx={{ backgroundColor: "#1c5253", marginBottom: "1em" }} position="static">
        <Container maxWidth="xl">
            <Toolbar disableGutters>
                <Typography
                    noWrap
                    component={Link}
                    to="/"
                    sx={{
                        mr: 1,
                        display: { xs: "none", md: "flex" },
                        fontFamily: "Poppins",
                        fontWeight: 500,
                        letterSpacing: "-0.01rem",
                        color: "inherit",
                        textDecoration: "none",
                    }}
                >
                    SESO em Concursos
                </Typography>

                <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                    <IconButton
                        size="medium"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleOpenNavMenu}
                        color="inherit"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorElNav}
                        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                        keepMounted
                        transformOrigin={{ vertical: "top", horizontal: "left" }}
                        open={Boolean(anchorElNav)}
                        onClose={handleCloseNavMenu}
                        sx={{ display: { xs: "block", md: "none" } }}
                    >
                        {pagesToDisplay.map((page) => (
                            <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                                <Link to={page.path} style={{ textDecoration: "none", fontFamily: "Poppins" }}>
                                    <Typography textAlign="center" sx={{ color: "black" }}>
                                        {page.name}
                                    </Typography>
                                </Link>
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>

                <Typography
                    noWrap
                    component={Link}
                    to="/"
                    sx={{
                        mr: 3,
                        display: { xs: "flex", md: "none" },
                        flexGrow: 1,
                        fontFamily: "Poppins",
                        fontWeight: 500,
                        letterSpacing: ".1rem",
                        color: "inherit",
                        textDecoration: "none",
                    }}
                >
                    SESO em Concursos
                </Typography>

                <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                    {pagesToDisplay.map((page) => (
                        <MenuItem key={page.name}>
                            <Link to={page.path} style={{ textDecoration: "none" }}>
                                <Button sx={{ color: "white", fontSize: '0.800em', marginRight: "-.7em" }}>
                                    {page.name}
                                </Button>
                            </Link>
                        </MenuItem>
                    ))}
                </Box>

                <Box sx={{ flexGrow: 0 }}>
                    <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            <Avatar alt="Remy Sharp" />
                        </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{ mt: "45px" }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        <MenuItem>
                            <Link
                                to="/Perfil"
                           
                                style={{ textDecoration: "none", color: "black" }}
                            >
                                Perfil
                            </Link>
                        </MenuItem>
                        <MenuItem>
                            <a
                                href="https://api.whatsapp.com/send?phone=5574981265381"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: "none", color: "black" }}
                            >
                                Suporte WhatsApp
                            </a>
                        </MenuItem>
                        <MenuItem>
                            <Typography onClick={signOut} sx={{ color: "black" }}>
                                Sair/Trocar Conta
                            </Typography>
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </Container>
    </AppBar>
    )
}

export default HeaderMain;