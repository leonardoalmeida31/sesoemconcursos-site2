import { Box, Container, Grid, useMediaQuery, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Questao from "../../components/Questões/Questoes";
import AnuncioCard from "../../components/Anuncios/AnuncioCard";
import { useState } from "react";

function Home() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


    return (
        <Box>
            <Header />
            <Container maxWidth="xl" sx={{ padding: isMobile ? '1em' : '2em' }} className="fundo-home">
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
                <AnuncioCard />
            </Grid>

            <Box className="Rodapé" sx={{ marginTop: '2em' }}>
                <Footer />
            </Box>
        </Box>
    );
}

export default Home;
