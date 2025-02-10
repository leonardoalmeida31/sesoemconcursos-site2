import React, { useEffect } from 'react';
import { Container, Typography, Button, Box, Grid, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText, Divider, Avatar } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import UpdateIcon from '@mui/icons-material/Update';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LiveTvRoundedIcon from '@mui/icons-material/LiveTvRounded';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FaceIcon from '@mui/icons-material/Face';
import Face2Icon from '@mui/icons-material/Face2';
import Face3Icon from '@mui/icons-material/Face3';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Importa os estilos do carousel
import { Carousel } from 'react-responsive-carousel';
import './CursoCEP.css'

import { ThemeProvider, createTheme } from '@mui/material/styles';


const CursoIdosa = () => {
    const theme = createTheme({
        typography: {
            fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
            backgroundColor: '#5FA4F5'
        },
    });


    useEffect(() => {
        const importHotmart = () => {
            const script = document.createElement('script');
            script.src = 'https://static.hotmart.com/checkout/widget.min.js';
            document.head.appendChild(script);

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = 'https://static.hotmart.com/css/hotmart-fb.min.css';
            document.head.appendChild(link);
        };

        importHotmart();
    }, []);

    const handleButtonClick = (e) => {
        e.preventDefault();
        window.location.href = "https://pay.hotmart.com/F98058723D?checkoutMode=10";
    };

    const courseModules = [
        {
            title: 'Módulo 1: TUDO QUE VOCÊ PRECISA SABER PARA GABARITAR',
            classes: [
                { title: 'AULA E PDF EXCLUSIVO PARA GABARITAR O CONTEÚDO', duration: '29 min' },
    
            ],
        },
        {
            title: 'Módulo 2: QUESTÕES COMENTADAS DE 2025',
            classes: [
                { title: 'AULA 1: LIVE DE QUESTÕES COMENTADAS', duration: '50 min' },


        
            ],
        },
        {
            title: 'Módulo 3: AULA COM QUESTÕES DE 2024',
            classes: [
                { title: 'AULA 1: AULA COM QUESTÕES DE 2024', duration: '28 min' },

            ],
        },
        {
            title: 'Módulo 4: AULA COM QUESTÕES DE 2023',
            classes: [
                { title: 'AULA 1: AULA COM QUESTÕES DE 2023', duration: '22 min' },

            ],
        },
        {
            title: 'Módulo 5: AULA COM QUESTÕES DE 2022',
            classes: [
                { title: 'AULA 1:  - AULA COM QUESTÕES DE 2022', duration: '15 min' },

            ],
        },
     
    ];

    const pergFrequentes = [
        {
            title: 'Como receberei acesso ao curso?',
            classes: [
                { title: 'O envio do acesso à plataforma é feito por e-mail, automaticamente, após a confirmação do pagamento pela plataforma. Para as compras efetuadas via PIX, cartão de crédito, a liberação é imediata. Já para as compras feitas por boleto bancário, o prazo de liberação do acesso pode ser de 24 a 72 horas úteis, em virtude da compensação bancária.', },

            ],
        },
        {
            title: 'Por quanto tempo terei acesso?',
            classes: [
                { title: 'O Acesso será vitalício com direito a receber atualizações e novas aulas de questões comentadas até Dezembro de 2025' },

            ],
        },
        {
            title: 'Posso estudar pelo celular?',
            classes: [
                { title: 'Sim, você pode estudar por QUALQUER dispositivo móvel, computador, celular, tablet, notebook, e etc', },

            ],
        },
        {
            title: 'Quais as formas de pagamento?',
            classes: [
                { title: 'PIX, ou cartão de crédito (podendo ser parcelado).' },


            ],
        },
        {
            title: 'Os materiais possuem garantia?',
            classes: [
                { title: 'Sim! Todos os matérias possuem garantia de 7 dias corridos após a compra. Porém, após esse prazo, a solicitação de cancelamento da compra não será aceita. Para cancelamentos, enviar solicitação através de e-mail.', },

            ],
        },
        {
            title: 'Para qual tipo de concurso esse curso serve?',
            classes: [
                { title: 'Ele é desenvolvido para todos os concursos de serviço social, pois abordamos concursos de todas as instituições com cargos de assistente social realizados nos últimos 3 anos. Assim cobre todos os tipos de dificuldade: Desde prefeituras a Senado Federal, bem como emrpesas estaduais e institutos federais e universidades', },

            ],
        },
        {
            title: 'Para qual tipo de banca esse curso serve?',
            classes: [
                { title: 'É aplicável a qualquer banca de concurso, pois desenvolvemos um método de abordagem que rastreia todos os padrões das bancas e desvendamos eles no curso.', },
                { title: 'São abordadas dezenas e dezenas de bancas de todo o Brasil, fazendo com que fique o mais completo possível.', },

            ],
        },

    ];

    const link = "https://wa.me/5574981265381?text=OL%C3%81%2C%20EU%20QUERO%20MAIS%20INFORMA%C3%87%C3%95ES%20SOBRE%20O%20CURSO%20DO%20C%C3%93DIGO%20DE%20%C3%89TICA"; // Substitua pelo seu link desejado

    const link2 = "https://pay.hotmart.com/F98058723D?checkoutMode=10"; // Substitua pelo seu link desejado



    return (
        <ThemeProvider theme={theme} >
            <Container maxWidth='x1' sx={{ backgroundColor: '#3A4D44' }}>
                <Grid maxWidth='x1'>
                    <Grid container spacing={2} alignItems="center" justifyContent="center">
                        {/* Header */}
                        <Grid item xs={12}>

                            <Grid item xs={12} sm={12} sx={{ display: { xs: 'flex', xl: 'none' }, justifyContent: 'center' }}>

                                <Avatar
                                    alt="Avatar for XS"
                                    src="https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/imagens%2FCAPAS%20DE%20CURSOS%20600X600%20(V%C3%ADdeo%20para%20dispositivos%20m%C3%B3veis).png?alt=media&token=b738a03e-7152-476f-b882-79dcb0a4ca21"
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

                            {/* Avatar para tamanho xl */}
                            <Grid item xs={12} xl={12} sx={{ display: { xs: 'none', xl: 'flex' }, justifyContent: 'center' }}>

                                <Avatar
                                    alt="Avatar for XL"
                                    src="https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/imagens%2FCAPAS%20DE%20CURSOS%20600X600%20(V%C3%ADdeo%20para%20dispositivos%20m%C3%B3veis).png?alt=media&token=b738a03e-7152-476f-b882-79dcb0a4ca21"
                                    sx={{
                                        width: 500,
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
                            <Box textAlign="center" sx={{ padding: { sm: '40px 20px', xs: '0px' } }}>
                                <Typography
                                    sx={{ color: 'white', fontSize: { xs: '1.2em', sm: '2.7em', }, fontWeight: '600', }}
                                >
                                    CURSO COMPLETO DE QUESTÕES COMENTADAS DE ESTUDO SOCIAL, RELATÓRIO SOCIAL, PERÍCIA SOCIAL, LAUDO SOCIAL E PARECER SOCIAL PARA CONCURSOS DE SERVIÇO SOCIAL
                                </Typography>
                                <Typography sx={{ color: 'white', fontSize: { xs: '1em', sm: '2em', }, fontWeight: '600', marginTop: '1em' }}>
                                    O ÚNICO CURSO COM AULAS QUE COBRE TODO O CONTEÚDO DESSAS TEMÁTICAS
                                </Typography>
                            </Box>


                        </Grid>

                        {/* Course Details */}
                        <Grid item xs={12}>
                            <Box sx={{ padding: { sm: '40px 20px', xs: '0px' }, backgroundColor: '#F37022', borderRadius: '8px' }}>
                                <Typography sx={{ color: 'white', fontSize: { xs: '1.2em', sm: '2.8em', }, textAlign: 'center', fontWeight: '600', padding: { sm: '40px 20px', xs: '0.8em' } }}>
                                    NUNCA MAIS ERRE QUESTÕES DOS INSTRUMENTOS TÉCNICOS DO ASSISTENTE SOCIAL
                                </Typography>
                                <Typography sx={{ fontSize: { xs: '0.9em', sm: '1.2em', }, textAlign: { xs: 'center', sm: 'justify', }, fontWeight: '500', padding: { sm: '40px 20px', xs: '0.8em' } }}>
                                    Faça agora mesmo o ÚNICO CURSO DE ESTUDO SOCIAL, RELATÓRIO SOCIAL, PERÍCIA SOCIAL, LAUDO SOCIAL E PARECER SOCIAL focado em concursos de serviço social produzido Fevereiro de 2025 com as questões mais recentes do ano, bem como com centenas de questões comentadas de 2022 a 2024 e saia na frente dos seus concorrentes.
                                </Typography>
                                <Typography variant="body1">

                                </Typography>
                            </Box>
                        </Grid>

                      {/*  <Grid container direction="column" alignItems="center" spacing={2}>
                            <Grid item>
                                <Typography
                                    sx={{
                                        color: "white",
                                        fontSize: { xs: "1.2em", sm: "2.8em" },
                                        textAlign: "center",
                                        fontWeight: "600",
                                        padding: { sm: "40px 20px", xs: "0.8em" },
                                    }}
                                >
                                    ASSISTA A UMA AULA DO CURSO:
                                </Typography>
                            </Grid>

                            <Grid item sx={{ width: "100%", maxWidth: "800px", padding: 2 }}>
                                <div
                                    style={{
                                        position: "relative",
                                        width: "100%",
                                        paddingBottom: "56.25%", // Proporção 16:9
                                        height: 0,
                                        overflow: "hidden",
                                    }}
                                >
                                    <iframe
                                        src="https://www.youtube.com/embed/PmQTckao8LY?si=nQEZw3ZCzWunSuVP"
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "100%",
                                        }}
                                    ></iframe>
                                </div>
                            </Grid>
                        </Grid>

                        */}

                        {/* PARA QUEM */}
                        <Grid item xs={12}  >
                            <Box sx={{ padding: '40px 20px', backgroundColor: '#f9f9f9', borderRadius: '8px', }}>
                                <Typography sx={{ fontSize: '2em', textAlign: 'center', fontWeight: '600', paddingBottom: '1em', }}>
                                    PARA QUEM É ESTE CURSO?
                                </Typography>
                                <Grid container spacing={3} justifyContent="center">
                                    <Grid item xs={12} md={4}>
                                        <Box textAlign="center">
                                            <FaceIcon sx={{ fontSize: 50, color: '#4CAF50' }} />
                                            <Typography variant="h6" gutterBottom>
                                                PARA CONCURSEIROS DE SERVIÇO SOCIAL
                                            </Typography>
                                            <Typography variant="body1">
                                                O Curso é ideal para você assistente social que precisa revisar inteiramente este conteúdo para concursos com aulas comentadas e objetivas
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Box textAlign="center">
                                            <Face2Icon sx={{ fontSize: 50, color: '#4CAF50' }} />
                                            <Typography variant="h6" gutterBottom>
                                                PARA INICIANTES EM CONCURSOS
                                            </Typography>
                                            <Typography variant="body1">
                                                o Curso vai te ensinar do básico ao avançado a como responder questões de concursos desses instrumentos e nunca mais errar mesmo que você esteja começando sua preparação para concursos hoje
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Box textAlign="center">
                                            <Face3Icon sx={{ fontSize: 50, color: '#4CAF50' }} />
                                            <Typography variant="h6" gutterBottom>
                                                PARA QUEM JÁ TEM EXPERIÊNCIA EM CONCURSOS DE SERVIÇO SOCIAL
                                            </Typography>
                                            <Typography variant="body1">
                                                Mesmo que você tenha experiência com concursos sempre vai precisar revisar esses instrumentos que são os que mais caem em concursos de serviço Social.
                                            </Typography>
                                        </Box>
                                    </Grid>


                                </Grid>
                            </Box>
                        </Grid>

                        {/* Vantagens */}
                        <Grid item xs={12}  >
                            <Box sx={{ padding: '40px 20px', backgroundColor: '#f9f9f9', borderRadius: '8px', }}>
                                <Typography sx={{ fontSize: '2em', textAlign: 'center', fontWeight: '600', paddingBottom: '1em', }}>
                                    VANTAGENS DE FAZER ESTE CURSO
                                </Typography>
                                <Grid container spacing={3} justifyContent="center">
                                    <Grid item xs={12} md={4}>
                                        <Box textAlign="center">
                                            <CheckCircleIcon sx={{ fontSize: 50, color: '#4CAF50' }} />
                                            <Typography variant="h6" gutterBottom>
                                                Completo
                                            </Typography>
                                            <Typography variant="body1">
                                                O Curso aborda todos os conceitos desses instrumentos e faz comentários para você nunca mais errar neles.
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Box textAlign="center">
                                            <LiveTvRoundedIcon sx={{ fontSize: 50, color: '#4CAF50' }} />
                                            <Typography variant="h6" gutterBottom>
                                                Assistindo
                                            </Typography>
                                            <Typography variant="body1">
                                                Você aprende em vídeo aulas com um professor assistente social com experiência em concursos.
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Box textAlign="center">
                                            <MenuBookIcon sx={{ fontSize: 50, color: '#4CAF50' }} />
                                            <Typography variant="h6" gutterBottom>
                                                Questões
                                            </Typography>
                                            <Typography variant="body1">
                                                Você aprende com o melhor método de estudos: Resolvendo questões com um professor a sua disposição.
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Box textAlign="center">
                                            <AccessTimeIcon sx={{ fontSize: 50, color: '#4CAF50' }} />
                                            <Typography variant="h6" gutterBottom>
                                                Atualizado
                                            </Typography>
                                            <Typography variant="body1">
                                                Atualizações frequentes até o final de 2025 com as questões mais recentes.
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Box textAlign="center">
                                            <UpdateIcon sx={{ fontSize: 50, color: '#4CAF50' }} />
                                            <Typography variant="h6" gutterBottom>
                                                Acesso Vitalício
                                            </Typography>
                                            <Typography variant="body1">
                                                Tenha acesso ao curso para sempre, incluindo todas as atualizações futuras.
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Box textAlign="center">
                                            <VerifiedUserIcon sx={{ fontSize: 50, color: '#4CAF50' }} />
                                            <Typography variant="h6" gutterBottom>
                                                Certificado
                                            </Typography>
                                            <Typography variant="body1">
                                                Receba um certificado de conclusão ao terminar o curso.
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>

                        {/* Módulos do Curso */}
                        <Grid item xs={12}>
                            <Box sx={{ padding: { sm: '40px 20px', xs: '0px' }, backgroundColor: '#4A4F3A', borderRadius: '8px', textAlign: 'center' }}>
                                <Typography sx={{ fontSize: { xs: '1.2em', sm: '2em', }, textAlign: 'center', fontWeight: '600', paddingBottom: '1em', color: 'white' }}>
                                    MÓDULOS DO CURSO
                                </Typography>
                                <Grid container item xs={12} sx={{ display: 'flex', justifyContent: 'center', padding: '1em', marginBottom: '2em', flexDirection: { xs: 'column', md: 'row' } }}>
                                    <Grid container item xs={12} md={4} sx={{ backgroundColor: '#F37022', borderRadius: '8px', marginBottom: { xs: '2em', md: '0' }, marginRight: { md: '2em' }, }}>
                                        <Box sx={{ textAlign: 'center', padding: { sm: '2em', xs: '0px' }, }}>
                                            <LiveTvRoundedIcon sx={{ fontSize: 50, color: 'black' }} />
                                            <Typography sx={{ color: 'white', fontSize: { xs: '1.2em', sm: '1.8em', }, alignItems: 'center', textAlign: 'center' }}>
                                               AULAS TODOS OS MESES
                                            </Typography>
                                            <Typography sx={{ color: 'black', fontSize: { xs: '0.9em', sm: '1em', }, paddingTop: '1em', textAlign: 'center' }}>
                                                AULAS COM DURAÇÃO MÉDIA DE 25 MIN
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid container item xs={12} md={4} sx={{ backgroundColor: '#F37022', borderRadius: '8px', marginBottom: { xs: '2em', md: '0' }, padding: '1em' }}>
                                        <Box sx={{ textAlign: 'center', padding: { sm: '2em', xs: '0px' }, }}>
                                            <MenuBookIcon sx={{ fontSize: 50, color: 'black', textAlign: 'center' }} />
                                            <Typography sx={{ color: 'white', fontSize: { xs: '1.2em', sm: '1.8em', }, alignItems: 'center', textAlign: 'center' }}>
                                                + 200 QUESTÕES COMENTADAS
                                            </Typography>
                                            <Typography sx={{ color: 'black', fontSize: { xs: '0.9em', sm: '1em', }, paddingTop: '1em', textAlign: 'center' }}>
                                                APRENDA SEMPRE COM QUESTÕES ATUALIZADAS
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid container item xs={12} md={4} sx={{ backgroundColor: '#F37022', borderRadius: '8px', marginLeft: { md: '2em' }, padding: '1em' }}>
                                        <Box sx={{ textAlign: 'center', padding: { sm: '2em', xs: '0px' }, }}>
                                            <UpdateIcon sx={{ fontSize: 50, color: 'black', textAlign: 'center' }} />
                                            <Typography sx={{ color: 'white', fontSize: { xs: '1.2em', sm: '1.8em', }, alignItems: 'center', textAlign: 'center' }}>
                                                + GRAVAÇÕES ATÉ DEZEMBRO DE 2025
                                            </Typography>
                                            <Typography sx={{ color: 'black', fontSize: { xs: '0.9em', sm: '1em', }, paddingTop: '1em', textAlign: 'center' }}>
                                                NOVAS AULAS SERÃO POSTADAS MENSALMENTE
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                                {courseModules.map((module, index) => (
                                    <Accordion key={index} sx={{ backgroundColor: '#F37022', }}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography variant="h6">{module.title}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails sx={{ backgroundColor: 'yourDetailsColor' }}>
                                            <List>
                                                {module.classes.map((classe, idx) => (
                                                    <div key={idx}>
                                                        <ListItem>
                                                            <ListItemText
                                                                primary={classe.title}
                                                                sx={{ flex: '1 1 0%' }}
                                                            />
                                                            <Typography variant="body2" color="textSecondary">
                                                                {classe.duration}
                                                            </Typography>
                                                        </ListItem>
                                                        {idx < module.classes.length - 1 && <Divider />}
                                                    </div>
                                                ))}
                                            </List>
                                        </AccordionDetails>
                                    </Accordion>

                                ))}
                            </Box>
                        </Grid>

                        {/* Depoimentos */}
                        <Grid item xs={12} >
                            <Box sx={{ padding: '40px 20px', backgroundColor: '#4A4F3A', borderRadius: '8px' }}>
                                <Typography sx={{ fontSize: '2em', textAlign: 'center', fontWeight: '600', paddingBottom: '1em', color: 'white' }}>
                                    CONFIRA OS DEPOIMENTOS DOS ALUNOS
                                </Typography>
                                <Carousel
                                    showThumbs={false}
                                    showStatus={false}
                                    infiniteLoop
                                    autoPlay
                                    interval={6000}
                                    stopOnHover
                                    swipeable
                                >
                                    {/* Adicione aqui as imagens dos depoimentos */}
                                    <div>
                                        <img className="carousel-image" src="https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/DEPOIMENTOS%2FJENNIFER-DEPOIMENTO.png?alt=media&token=f86a8751-b112-445b-a71a-1b508a0ae480" alt="Depoimento 1" />

                                    </div>
                                    <div>
                                        <img className="carousel-image" src="https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/DEPOIMENTOS%2FGISELE-DEPO.jpeg?alt=media&token=afc56a3e-ca75-45e6-a9a5-3cbf90b39959" alt="Depoimento 2" />

                                    </div>
                                    <div>
                                        <img className="carousel-image" src="https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/DEPOIMENTOS%2Fmarcele.png?alt=media&token=a01a7ebc-8ea6-4e72-b1d6-a3c2a6ead6e8" alt="Depoimento 3" />

                                    </div>
                                    <div>
                                        <img className="carousel-image" src="https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/DEPOIMENTOS%2Fhelena.png?alt=media&token=4bbb8bb3-e62a-490c-b554-e46a97c22bb8" alt="Depoimento 4" />

                                    </div>
                                    <div>
                                        <img className="carousel-image" src="https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/DEPOIMENTOS%2Fkenia.png?alt=media&token=e8e0fcac-c6b5-49db-b5ff-d91b4f1e6de6" alt="Depoimento 5" />

                                    </div>
                                    <div>
                                        <img className="carousel-image" src="https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/DEPOIMENTOS%2Frosemerio.png?alt=media&token=140ad9fa-1c75-43ce-901e-3bff400dfea9" alt="Depoimento 6" />

                                    </div>
                                </Carousel>
                            </Box>
                        </Grid>

                        <Grid container maxWidth="x1" sx={{
                            padding: { sm: '40px 20px', xs: '0px' },
                            backgroundColor: '#F37022',
                            display: 'flex',
                            flexDirection: { xs: 'column', xl: 'row' },
                            borderRadius: '12px',

                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                            justifyContent: 'right',
                            marginTop: { sm: '2em', xs: '0.6em' },
                            marginBottom: { sm: '2em', xs: '0.6em' },
                            marginLeft: { sm: '0em', xs: '1em' },
                        }}>
                            {/* Seção do Avatar */}
                            <Grid item xs={12} xl={5} sx={{ display: 'flex', justifyContent: 'center', padding: '1em' }}>
                                <Grid item xs={12}>
                                    {/* Avatar para tamanho xs */}
                                    <Grid item xs={12} sm={12} sx={{ display: { xs: 'flex', xl: 'none' }, justifyContent: 'center' }}>

                                        <Avatar
                                            alt="Avatar for XS"
                                            src="https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/imagens%2FCAPAS%20DE%20CURSOS%20600X600%20(V%C3%ADdeo%20para%20dispositivos%20m%C3%B3veis).png?alt=media&token=b738a03e-7152-476f-b882-79dcb0a4ca21"
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

                                    {/* Avatar para tamanho xl */}
                                    <Grid item xs={12} xl={12} sx={{ display: { xs: 'none', xl: 'flex' }, justifyContent: 'center', alignItems: 'center' }}>

                                        <Avatar
                                            alt="Avatar for XL"
                                            src="https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/imagens%2FCAPAS%20DE%20CURSOS%20600X600%20(V%C3%ADdeo%20para%20dispositivos%20m%C3%B3veis).png?alt=media&token=b738a03e-7152-476f-b882-79dcb0a4ca21"
                                            sx={{
                                                width: 500,
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
                                </Grid>
                            </Grid>

                            {/* Seção do Preço */}
                            <Grid item xs={12} xl={7} sx={{ display: 'flex', justifyContent: 'center', padding: '1em' }}>
                                <Box sx={{ textAlign: 'center', padding: { sm: '3em 1em', xs: '0em' } }}>
                                    <Typography
                                        sx={{
                                            fontSize: { sm: '2.5em', xs: '1.1em' },
                                            textAlign: 'center',
                                            fontWeight: 'bold',
                                            paddingTop: { xs: '2em', sm: '0em' },
                                            color: 'white',
                                        }}
                                    >
                                        COMPRE AGORA MESMO ANTES QUE ACABE ESTE DESCONTO!!!
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color: 'black',
                                            fontSize: { sm: '2em', xs: '1em' },
                                            fontWeight: '500',
                                        }}
                                    >
                                        por apenas 7x de
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color: '#1B4D3E',
                                            fontSize: { sm: '5.5em', xs: '3em' },
                                            fontWeight: '700',
                                        }}
                                    >
                                        R$ 7,99
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color: 'black',
                                            fontSize: { sm: '2em', xs: '1em' },
                                            marginBottom: '1em',
                                            fontWeight: '500',
                                        }}
                                    >
                                        ou à vista por R$ 49,99<br></br>

                                    </Typography>

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
                                        onClick={handleButtonClick}
                                    >
                                        <Typography sx={{ fontSize: { sm: '1.6em', xs: '1.1em' }, fontWeight: '600' }}>
                                            COMPRAR COM DESCONTO AGORA
                                        </Typography>
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>


                        {/* perguntas */}
                        <Grid item xs={12}>
                            <Box sx={{ padding: '40px 20px', backgroundColor: '#4A4F3A', borderRadius: '8px', }}>
                                <Typography sx={{ fontSize: '2em', textAlign: 'center', fontWeight: '600', paddingBottom: '1em', color: 'white' }}>
                                    PERGUNTAS FREQUENTES
                                </Typography>

                                {pergFrequentes.map((module, index) => (
                                    <Accordion key={index} sx={{ backgroundColor: '#F37022', }}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography variant="h6">{module.title}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails sx={{ backgroundColor: 'white' }}>
                                            <List>
                                                {module.classes.map((classe, idx) => (
                                                    <div key={idx}>
                                                        <ListItem>
                                                            <ListItemText
                                                                primary={classe.title}
                                                                sx={{ flex: '1 1 0%' }}
                                                            />
                                                            <Typography variant="body2" color="textSecondary">
                                                                {classe.duration}
                                                            </Typography>
                                                        </ListItem>
                                                        {idx < module.classes.length - 1 && <Divider />}
                                                    </div>
                                                ))}
                                            </List>
                                        </AccordionDetails>
                                    </Accordion>



                                ))}

                                <Grid Container item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'center', padding: '1em', marginTop: '2em' }}>
                                    <Grid Container item xs={12} md={6} sx={{ backgroundColor: '#F37022', borderRadius: '8px', marginRight: '2em', alignItems: 'center' }}>
                                        <Box sx={{ textAlign: 'center', padding: '2em 0em' }}>

                                            <Typography sx={{ color: 'white', fontSize: '1.8em', alignItems: 'center', textAlign: 'center', marginBottom: '1em' }}>
                                                TEM MAIS DÚVIDAS?
                                            </Typography>

                                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                                                <a href={link} target="_blank" rel="noopener noreferrer">
                                                    <Avatar
                                                        alt="Avatar for XS"
                                                        src="https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/ANUNCIOS-CURSOS-FOTOS-SITE%2Fwhatsapp-4451-svg.webp?alt=media&token=dc61ed6c-2b45-49f4-8233-55340deb2b9a"
                                                        sx={{
                                                            width: 70,   // Faz com que o avatar ocupe 100% da largura do grid
                                                            height: 70,     // Altura fixa do avatar
                                                            transition: 'transform 0.3s ease-in-out', // Transição suave para o efeito
                                                            '&:hover': {
                                                                transform: 'scale(1.1)', // Aumenta o tamanho do avatar ao passar o mouse
                                                            },
                                                            padding: '1em',
                                                            backgroundColor: '#364840',


                                                        }}
                                                    />
                                                </a>
                                            </Grid>
                                            <Typography sx={{ fontSize: '1.2em', fontWeight: '500', paddingTop: '1em', color: 'white' }} >
                                                TOQUE E FALE COM O DESENVOLVEDOR DO CURSO AGORA MESMO!</Typography>


                                        </Box>
                                    </Grid>

                                </Grid>
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid
                                container
                                spacing={2}
                                sx={{
                                    padding: '40px 20px',
                                    backgroundColor: '#f9f9f9',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <Grid item xs="auto">
                                    <Avatar
                                        alt="Autor"
                                        src="https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/imagens%2FLEO-PERFIL-23.jpg?alt=media&token=7a13a98d-8929-410a-95af-d574b8d27bf3" // Insira a URL da foto do autor aqui
                                        sx={{ width: { sm: '200px', height: '200px', xs: '200px', }, marginRight: '20px' }}
                                    />
                                </Grid>
                                <Grid item xs>
                                    <Typography sx={{ fontSize: '2em', fontWeight: '600', paddingBottom: '1em' }}>
                                        SOBRE O AUTOR
                                    </Typography>
                                    <Typography sx={{ fontSize: '1em', lineHeight: '1.5em' }}>
                                        LEONARDO ALMEIDA, é Assistente Social e Desenvolvedor da plataforma SESO em Concursos, a qual é a única plataforma de questões de concursos no Brasil ESPECIALIZADA em Serviço Social para Assistentes Sociais que estudam para concursos.
                                    </Typography>
                                    <Typography sx={{ fontSize: '1em', lineHeight: '1.5em', paddingTop: '0.6em' }}>
                                        Especialista em estudos para concursos e processos seletivos municipais de assistentes sociais, conta com diversas aprovações e sucessos em concursos no estado ao qual reside: Bahia, sendo aprovado em 1º lugar no concursos e seletivos Municipais de Piritiba - BA e Capela do Alto Alegre - BA, também ficando em 2º lugar em Andorinha - BA e em 3º na prova objetiva de Filadélfia - BA, todos estes concursos realizados entre o período de 2023 a 2024.
                                    </Typography>
                                    <Typography sx={{ fontSize: '1em', lineHeight: '1.5em', paddingTop: '0.6em' }}>
                                        Com vocação para o ensino, dedica-se atualmente a compartilhar seus métodos de estudo para concursos, visando ajudar outros profissionais que enfrentaram dificuldades na preparação, para que não precisem passar pelos mesmos desafios e possam avançar com um método eficaz, testado por quem realmente vivenciou a vida de concurseiro e trabalhador ao mesmo tempo.
                                    </Typography>
                                    <Typography sx={{ fontSize: '1em', lineHeight: '1.5em', paddingTop: '0.6em' }}>
                                        Atualmente, também atua como Assistente Social na Secretaria de Saúde de Andorinha – BA.
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Seção de Compra */}
                        <Grid item xs={12}>
                            <Box textAlign="center" sx={{ padding: '40px 20px' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"

                                    sx={{
                                        backgroundColor: '#F37022',
                                        padding: { sm: '1.5em 3em', xs: '0.5em 2em' },

                                        borderRadius: '60px',
                                        width: '100%',
                                        '&:hover': {
                                            backgroundColor: '#1B4D3E',
                                        },
                                    }}
                                    onClick={handleButtonClick}
                                >
                                    <Typography sx={{ fontSize: { sm: '1.6em', xs: '1.1em' }, fontWeight: '600', }}>
                                        COMPRAR COM DESCONTO AGORA
                                    </Typography>

                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider>
    );

};


export default CursoIdosa;