import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import StarIcon from '@mui/icons-material/StarBorder';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';


function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const tiers = [
    {
        title: 'Gratuito',
        price: '0',
        description: [

            'Até 15 questões /dia',
            'Questões Discursivas Bloqueadas',
            'Comentários Limitados',
            'Gráficos de Desempenho Limitados',
        ],
        buttonText: 'Assinante',
        buttonVariant: 'outlined',
    },
    {
        title: 'Semestral',
        subheader: 'Mais popular',
        price: '60',
        description: [
            'Equivalente a R$ 10,00/mês',
            'Questões ilimitadas',
            'Questões Discursivas Liberadas',
            'Comentários ilimitados',
            'Gráficos de Desempenho',

        ],
        buttonText: 'Assinar Agora',
        buttonVariant: 'contained',
    },
    {
        title: 'Anual',
        subheader: 'Maior Desconto',
        price: '110',
        description: [
            'Equivalente a R$ 9,00/mês',
            'Questões ilimitadas',
            'Questões Discursivas Liberadas',
            'Comentários ilimitados',
            'Gráficos de Desempenho',

        ],
        buttonText: 'Assinar Agora',
        buttonVariant: 'outlined',
    },
];


// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Pricing() {
    return (
        <ThemeProvider theme={defaultTheme} >
            <Container sx={{
    background: 'radial-gradient(circle, #203f41, #203f41, #203f41, #0d1616 )', padding: '20px'
    // Outros estilos que você deseja aplicar ao fundo da tela
  }}>
            <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none', } }} />
            <CssBaseline />
            <AppBar
                position="static"
                color="default"
                elevation={0}
                sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
            >

            </AppBar>

            <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 4, pb: 5, color: 'white' }}>
                <Typography sx={{ color: 'white'}}
                    component="h1"
                    variant="h3"
                    align="center"
                    color="text.primary"
                    gutterBottom
                >
                    Assinatura por PIX
                </Typography>
                <Typography variant="h6" align="center" color="text.secondary" component="p" sx={{ color: 'white'}}>
                    Assinando por PIX você ganha desconto e praticidade na sua assinatura. Confira abaixo os nossos planos:
                </Typography>
            </Container>
            {/* End hero unit */}
            <Container maxWidth="md" component="main" >
                <Grid container spacing={5} alignItems="flex-end">
                    {tiers.map((tier) => (
                        // Enterprise card is full width at sm breakpoint
                        <Grid
                            item
                            key={tier.title}
                            xs={25}
                            sm={tier.title === 'Enterprise' ? 20 : 8}
                            md={4}
                        >
                            <Card sx={{

                                // Outros estilos que você deseja aplicar
                            }}>
                                <CardHeader
                                    title={tier.title}
                                    subheader={tier.subheader}
                                    titleTypographyProps={{ align: 'center' }}
                                    action={tier.title === 'Pro' ? <StarIcon /> : null}
                                    subheaderTypographyProps={{
                                        align: 'center',
                                    }}
                                    sx={{
                                        backgroundColor: (theme) =>
                                            theme.palette.mode === 'light'
                                                ? theme.palette.grey[200]
                                                : theme.palette.grey[700],
                                    }}
                                />
                                <CardContent>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'baseline',
                                            mb: 2,
                                        }}
                                    >
                                        <Typography component="h2" variant="h5" color="text.primary">
                                            R$ {tier.price}
                                        </Typography>
                                        <Typography variant="h7" color="text.secondary"> /{tier.title === 'Anual' ? 'a cada 12 meses' : 'a cada 6 meses'}
                                        </Typography>
                                    </Box>
                                    <ul>
                                        {tier.description.map((line, index) => (
                                            <Typography
                                                component="li"
                                                variant="subtitle1"
                                                align="center"
                                                key={index}
                                            >
                                                {line}
                                            </Typography>
                                        ))}
                                    </ul> 
                                </CardContent> 
                                <CardActions>
    <Button fullWidth variant={tier.buttonVariant}>
        <a href={tier.title === 'Semestral' ? 'https://api.whatsapp.com/send?phone=5574981265381&text=Oi.%20Quero%20assinar%20o%20plano%20SEMESTRAL%20SESO%20em%20Concursos' : 'https://api.whatsapp.com/send?phone=5574981265381&text=Oi.%20Quero%20assinar%20o%20plano%20ANUAL%20SESO%20em%20Concursos'} target="_blank" style={{ textDecoration: 'none', color: 'inherit' }}>
            {tier.buttonText}
        </a>
    </Button>
</CardActions>

                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
            </Container>
        </ThemeProvider>
    );
}