import { Grid, Avatar, Button, Typography } from "@mui/material";
function AnuncioCard() {
    return (


        <Grid item xs={12}  >
            <Grid item xs={12} sm={12} sx={{ display: { xs: 'flex', xl: 'none' }, justifyContent: 'center' }}>
                <Avatar
                    alt="Avatar for XS"
                    src="https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/ANUNCIOS-CURSOS-FOTOS-SITE%2Fcurso%20c%C3%B3digo%20de%20%C3%A9tica%20600x600%20(3).png?alt=media&token=981da548-4efe-473e-a61e-99d957996088"
                    sx={{
                        width: '100%',
                        height: '100%',
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'scale(1.1)',
                        },
                        paddingTop: '1em',
                        paddingBottom: '1em',
                        borderRadius: 0,
                    }}
                />

            </Grid>
            <Grid item xs={12} xl={12} sx={{ display: { xs: 'none', xl: 'flex' }, justifyContent: 'left' }}>

                <Avatar
                    alt="Avatar for XL"
                    src="https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/ANUNCIOS-CURSOS-FOTOS-SITE%2Fcurso%20c%C3%B3digo%20de%20%C3%A9tica%20600x600%20(3).png?alt=media&token=981da548-4efe-473e-a61e-99d957996088"
                    sx={{
                        width: '18em',
                        height: '100%',
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'scale(1.1)',
                        },
                        paddingTop: '1em',
                        borderRadius: 0,
                    }}
                />



            </Grid>
            <Grid sx={{ marginTop: '1em' }}>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{
                        backgroundColor: '#2D6A4F',
                        padding: { sm: '1.5em 3em', xs: '0.5em 2em' },
                        borderRadius: '60px',
                        width: '100%',
                        '&:hover': {
                            backgroundColor: '#1B4D3E',
                        },
                    }}
                    href="/CursoCEP"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Typography sx={{ fontSize: { sm: '1em', xs: '1em' }, fontWeight: '600' }}>
                        QUERO CONHECER
                    </Typography>
                </Button>

            </Grid>

        </Grid>

    )
}

export default AnuncioCard;