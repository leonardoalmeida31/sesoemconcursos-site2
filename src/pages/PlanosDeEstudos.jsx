import React, { useState, useEffect } from "react";
import FiltroD from "../FiltroD.jsx";
import { CaretRight, ChatCenteredText, ChartPie } from "@phosphor-icons/react";
import "../App.css";
import Chart from "react-google-charts";
import PieChart from "../PieChart.jsx";
import imagemSvg from "../img/img-login-1.svg";
import { Link } from "react-router-dom";
import MenuMui from "../MenuMui.jsx";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import { IoMdCut } from "react-icons/io";
import Select from "@mui/material/Select";
import ContentCutRoundedIcon from '@mui/icons-material/ContentCutRounded';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LanguageIcon from '@mui/icons-material/Language';
import CheckIcon from '@mui/icons-material/Check';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import AutoGraphOutlinedIcon from "@mui/icons-material/AutoGraphOutlined";
import Container from "@mui/material/Container";
import LockIcon from '@mui/icons-material/Lock';
import Cronometro from './Cronometro.jsx';
import {
    Modal,
    Button,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
    ListItem,
    List,
    ListItemText, ListItemIcon
} from "@mui/material";
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import PollOutlinedIcon from '@mui/icons-material/PollOutlined';
import { TextField, TextareaAutosize } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import IconButton from "@mui/material/IconButton";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { ShoppingCart } from "@mui/icons-material";
import AdbIcon from "@mui/icons-material/Adb";
import { useMediaQuery } from '@mui/material';
import { initializeApp } from "firebase/app";
import {
    getDocs,
    getFirestore,
    collection,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    addDoc,
    onSnapshot,
    serverTimestamp,
    query,
    where, limit
} from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import "firebase/database";
import { useParams } from "react-router-dom";


const pages = ["Questões"];
const settings = ["Perfil"];

const pageLinks = {
    Questões: "/",
};
const settingsLinks = {
    Perfil: "/MeuDesempenho",
};

function PlanosDeEstudos() {

    const isMobile = useMediaQuery('(max-width: 600px)');

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

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


    const products = [
        {
            name: "Plano de Estudos IBAM",
            description: "Description of Product 1",
        },
        {
            name: "Product 2",
            description: "Description of Product 2",
        },
        {
            name: "Product 3",
            description: "Description of Product 3",
        },
        // Add more products as needed
    ];
    return (
        <div className="Home">

            <AppBar
                sx={{ backgroundColor: "#1c5253", marginBottom: "1em" }}
                position="static"
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 5,
                                display: { xs: "none", md: "flex" },
                                fontFamily: "monospace",
                                fontWeight: 600,
                                letterSpacing: ".1rem",
                                color: "inherit",
                                textDecoration: "none",
                            }}
                        >
                            SESO em Concursos
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                            <IconButton
                                size="large"
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
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "left",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "left",
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: "block", md: "none" },
                                }}
                            >
                                {pages.map((page) => (
                                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                                        <Typography textAlign="center">{page}</Typography>
                                    </MenuItem>
                                ))}
                                <MenuItem>
                                    <Link to="/MeuPerfil" style={{ textDecoration: "none" }}>
                                        <Typography sx={{ color: "black" }}>
                                            Meu Desempenho
                                        </Typography>
                                    </Link>
                                </MenuItem>
                                <MenuItem>
                                    <Link
                                        to="/RankingDesempenho"
                                        style={{ textDecoration: "none" }}
                                    >
                                        <Typography sx={{ color: "black" }}>Ranking</Typography>
                                    </Link>
                                </MenuItem>
                                <MenuItem>
                                    <Typography
                                        onClick={() => openModal()}
                                        sx={{ color: "black" }}
                                    >
                                        Assinar com cartão
                                    </Typography>
                                </MenuItem>
                                <MenuItem>
                                    <Link
                                        to="/AssinaturaPix"
                                        style={{ textDecoration: "none" }}
                                    >
                                        <Typography sx={{ color: "black" }}>
                                            Assinar com Pix
                                        </Typography>
                                    </Link>
                                </MenuItem>
                            </Menu>
                        </Box>

                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: { xs: "flex", md: "none" },
                                flexGrow: 1,
                                fontFamily: "monospace",
                                fontWeight: 500,
                                letterSpacing: ".1rem",
                                color: "inherit",
                                textDecoration: "none",
                            }}
                        >
                            SESO em Concursos
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                            {pages.map((page) => (
                                <Link
                                    key={page}
                                    to={pageLinks[page]}
                                    style={{ textDecoration: "none" }}
                                >
                                    <Button sx={{ my: 2, color: "white", display: "block" }}>
                                        {page}
                                    </Button>
                                </Link>
                            ))}

                            <MenuItem>
                                <Link to="/MeuPerfil" style={{ textDecoration: "none" }}>
                                    <Button sx={{ color: "white" }}>Meu Desempenho</Button>
                                </Link>
                            </MenuItem>
                            <MenuItem>
                                <Link
                                    to="/RankingDesempenho"
                                    style={{ textDecoration: "none" }}
                                >
                                    <Button sx={{ color: "white" }}>Ranking</Button>
                                </Link>
                            </MenuItem>
                            <MenuItem>
                                <Button onClick={() => openModal()} sx={{ color: "white" }}>
                                    Assinar com cartão
                                </Button>
                            </MenuItem>
                            <MenuItem>
                                <Link to="/AssinaturaPix" style={{ textDecoration: "none" }}>
                                    <Button sx={{ color: "white" }}>Assinar com Pix</Button>
                                </Link>
                            </MenuItem>
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
                                {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center">{setting}</Typography>
                                    </MenuItem>
                                ))}

                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Container>
                <Box sx={{ display: "flex", }}>
                    <Box sx={{ margin: "0.5em", padding: "1em", border: "1px solid black", borderRadius: "5px", width: "100%", alignItems: 'center', }}>
                        <Typography sx={{ fontSize: "1.5em", fontFamily: "Poppins", textAlign: "center", fontWeight: "600", paddingBottom: "0.5em" }}>
                            Plano de Estudos IBAM
                        </Typography>
                        <Typography sx={{ fontSize: "1em", fontFamily: "Poppins", paddingBottom: "0.5em" }}>
                            Este plano é ideal para você que está estudando para prefeituras. Somos os únicos a ter um plano da IBAM para Assistentes Sociais
                        </Typography>
                        <Typography sx={{ fontSize: "0.875em", fontFamily: "Poppins", paddingBottom: "0.5em" }}>
                            O que vem nele?<br />
                            <CheckIcon /> Análise de Serviço Social<br />
                            <CheckIcon /> Análise de Português<br />
                            <CheckIcon /> Análise de raciocínio lógico e Matemática<br />
                            <CheckIcon /> Vídeos de como usar a planilha de Estudos<br />
                            <CheckIcon /> Bônus: Vídeo de como estudar Redações para concursos
                        </Typography>
                        <Typography sx={{ fontSize: "1em", fontFamily: "Poppins", fontWeight: "600", paddingBottom: "0.5em" }}>
                            Apenas: R$ 49,99
                        </Typography>
                        <Button sx={{ fontFamily: "Poppins", justifyContent: "center" }}>
                            COMPRAR AGORA
                        </Button>


                    </Box>

                    <Box sx={{ margin: "0.5em", padding: "1em", border: "1px solid black", borderRadius: "5px", width: "100%" }}>
                        <Typography sx={{ fontSize: "1.2em", fontFamily: "Poppins", textAlign: "center", fontWeight: "600", paddingBottom: "1em" }}>Plano de Estudos AVANÇA SP</Typography>
                        <Typography>Descrição</Typography>
                        <Typography>Valor</Typography>
                        <Button>COMPRAR</Button>
                        <Typography>O que vem nele?</Typography>
                    </Box>




                </Box>
                <Box sx={{ margin: "0.5em", padding: "1em", border: "1px solid black", borderRadius: "5px" }}>
                    <Typography sx={{ fontSize: "1.2em", fontFamily: "Poppins" }}>Plano de Estudos IBAM</Typography>
                    <Typography>Descrição</Typography>
                    <Typography>Valor</Typography>
                    <Button>COMPRAR</Button>
                    <Typography>O que vem nele?</Typography>
                </Box>
            </Container>


            <Container className="fundo-Home">


                <Box className="Rodapé">
                    <Box className="Box-Rodapé2"></Box>

                    <Box className="Box-Rodapé1">
                        <p className="Texto-Rodapé1">© 2023 - SESO em Concursos</p>
                    </Box>
                </Box>

            </Container>
        </div>
    );
}

export default PlanosDeEstudos;

