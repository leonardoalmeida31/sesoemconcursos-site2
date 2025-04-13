import { Box, Container, Grid, useMediaQuery, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Questao from "../../components/Questões/Questoes";
import AnuncioCursos from "../../components/Anuncios/AnuncioCursos";
import { useState } from "react";

function Home() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


    return (
        <Box>
            <Header />
            <Container maxWidth="xl" sx={{ padding: isMobile ? '0.5em' : '0em' }}  className="fundo-Home" >
                <Questao />
            </Container>
            <Grid
                item
                xs={12}
                xl={6}
                sx={{
                    display: 'flex',
                    justifyContent: isMobile ? 'center' : 'left',
                    padding: isMobile ? '1em' : '2em'
                }}
            >
            
            </Grid>
            <AnuncioCursos />
            <Box className="Rodapé" sx={{ marginTop: '-0.4em' }}>
                <Footer />
            </Box>
        </Box>
    );
}

export default Home;
