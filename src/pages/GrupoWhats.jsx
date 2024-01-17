import React, { useState, useEffect } from "react";
import FiltroMulti from "../FiltroMulti.jsx";
import { CaretRight, ChatCenteredText, ChartPie } from "@phosphor-icons/react";
import "./MeuPerfil.css";
import Chart from "react-google-charts";
import PieChart from "../PieChart.jsx";
import {  Link } from 'react-router-dom';
import MenuMui from '../MenuMui.jsx';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh'; // Use o ícone apropriado
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import grupowhats from "../img/grupo-seso.png";
import { Button } from '@mui/material';
import AutoGraphOutlinedIcon from '@mui/icons-material/AutoGraphOutlined';
import Container from '@mui/material/Container';
import { initializeApp } from "firebase/app";
import {
  getDocs,
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";




function MeuPerfil() {
 
  return (

    <Container className="ContainerTotal">

<Box sx={{ padding: "1em", display: "flex", flexDirection: "column", alignItems: "center" }}>
       
        <Typography sx={{color: "white", fontWeight: "bold", textAlign: "center", fontFamily: "Poppins", padding: "1em" }}>
            FAÇA PARTE DO NOSSO GRUPO DE ESTUDOS PARA CONCURSEIROS DE SERVIÇO SOCIAL
        </Typography>
        <Typography sx={{color: "white", fontWeight: "normal", textAlign: "center", fontFamily: "Poppins", paddingHorizontal: "3em", paddingBottom: "2em", fontSize: "0.800em" }}>
            Nele você terá acesso a questões comentadas diariamente, dicas de estudos e divulgação de concursos abertos para assistentes sociais
        </Typography>
        <img
        src={grupowhats}
        alt="Descrição da imagem"
        width="50%"
        height="50%"
        style={{ margin: "auto", display: "block" }} // Adicione este estilo para centralizar a imagem
      />
       
       
       <Button
          variant="contained"
          color="primary"
          component="a"
          href="https://chat.whatsapp.com/E4ANUZMGtFIKajR7qqzBxI"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginTop: "1em", justifyContent: "center" }}
        >
          Toque aqui para entrar no Grupo
        </Button>
        
    </Box>
    </Container>

  );

}

export default MeuPerfil;
