import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Container from "@mui/material/Container";
import { Typography } from '@mui/material';

const Depoimentos = () => {

    const testimonials = [
        {
            id: 1,
            name: 'Leonardo Almeida',
            aprovado: '1º lugar na Prefeitura de Capela do Alto Alegre - BA',
            text: 'A única plataforma de questões de concursos especializada em Serviço Social',
        },
        {
            id: 2,
            name: 'Nilia Magalhães',
            text: 'Questões atualizadas e comentadas todos os dias',
        },
        {
            id: 3,
            name: 'Carlos',
            text: 'Filtros de questões personalizados para o seu concurso',
        },
        {
            id: 4,
            name: 'Carlos',
            text: 'Gráficos de Desempenho que mostram o avanço do seu aprendizado e norteiam seu foco de estudos',
        },
        {
            id: 5,
            name: 'Carlos',
            text: 'Aqui você, Assistente Social, encontra o caminho da aprovação!',
        },
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 700,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
    };

    const testimonialContainerStyle = {
        padding: '16px',
        border: '1px solid #007bff',
    };

    const testimonialTituloStyle = {
        fontWeight: 'bold',
        padding: '1em'
    };

    const testimonialTextStyle = {
        fontStyle: 'italic',
        padding: '0.500em'
    };
    const containerStyle = {
        padding: '2em',
    };

    return (
        <Container style={containerStyle}>
            <Typography style={testimonialTituloStyle}>Depoimentos dos Assinantes:</Typography>
            <Slider {...settings}>
                {testimonials.map((testimonial) => (
                    <Container key={testimonial.id} style={testimonialContainerStyle}>


                        <Typography style={testimonialTextStyle}>{testimonial.text}</Typography>
                    </Container>
                ))}
            </Slider>
        </Container>
    );
};

export default Depoimentos;