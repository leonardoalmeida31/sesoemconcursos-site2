import { Box, Typography, Link, Grid, Container } from "@mui/material";

function Footer() {
    return (
        <Box
            sx={{
              
                color: "white",
                padding: "20px 0",
                fontFamily: 'Poppins'
            }}
        >
            <Container maxWidth="xl" sx={{  }}>
                <Grid container spacing={4}>
                    {/* Coluna 1 */}
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            SESO em Concursos
                        </Typography>
                        <Link
                            href="/"
                            underline="none"
                            color="inherit"
                        >
                            SESOEMCONCURSOS.COM.BR
                        </Link>
                        <br />
                        <Link
                            href="https://api.whatsapp.com/send?phone=5574981265381"
                            underline="none"
                            color="inherit"
                            target="_blank"
                        >
                            Atendimento ao Cliente
                        </Link>
                        <br />
                        <Link
                            href="https://chat.whatsapp.com/JXLDCsz8ruK6tCxgvLb8Ar"
                            underline="none"
                            color="inherit"
                            target="_blank"
                        >
                            Grupo no WhatsApp
                        </Link>
                        <br />
                        <Link
                            href="https://www.youtube.com/watch?v=2evADTh1FAY&t=1s"
                            underline="none"
                            color="inherit"
                            target="_blank"
                        >
                            Como usar o SESO em Concursos
                        </Link>
                    </Grid>

                    {/* Coluna 2 */}
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            Recursos
                        </Typography>
                        <Link
                            href="/MeuPerfil"
                            underline="none"
                            color="inherit"
                        >
                            Meu Desempenho
                        </Link>
                        <br />
                        <Link
                            href="/"
                            underline="none"
                            color="inherit"
                        >
                            Questões
                        </Link>
                        <br />
                        <Link
                            href="/RankingDesempenho"
                            underline="none"
                            color="inherit"
                        >
                            Ranking de Desempenho
                        </Link>
                        <br />
                      
                    </Grid>

                    {/* Coluna 3 */}
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            Conexões
                        </Typography>
                        <Link
                            href="https://www.instagram.com/sesoemconcursos/"
                            underline="none"
                            color="inherit"
                            target="_blank"
                        >
                            Instagram
                        </Link>
                        <br />
                        <Link
                            href="/Aulas"
                            underline="none"
                            color="inherit"
                        >
                            Aulas
                        </Link>
                        <br />
                        <Link
                            href="/EstatisticaSite"
                            underline="none"
                            color="inherit"
                        >
                            Estatísticas do Site
                        </Link>
                        <br />
                        <Link
                            href="https://www.youtube.com/watch?v=2evADTh1FAY&t=1s"
                            underline="none"
                            color="inherit"
                            target="_blank"
                        >
                            Como usar o SESO em Concursos
                        </Link>
                    </Grid>
                </Grid>

                {/* Rodapé inferior */}
                <Box
                    sx={{
                        textAlign: "center",
                        marginTop: "20px",
                        borderTop: "1px solid #111",
                        paddingTop: "10px",
                    }}
                >
                    <Typography variant="body2">
                        © 2023 - 2025 - SESO em Concursos. Todos os direitos reservados.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

export default Footer;
