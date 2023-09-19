import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { Modal, Button, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';

const Depoimentos = () => {
  // Dados fictícios de depoimentos
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

  // Configurações do slider
  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // Habilita o autoplay
    autoplaySpeed: 4000, // Define a velocidade do autoplay em milissegundos (5 segundos no exemplo)
  };

  const testimonialContainerStyle = {
    padding: '16px', // Adicione espaçamento personalizado conforme necessário
    border: '1px solid #007bff', // Personalize a borda
  };

  const testimonialNameStyle = {
    fontWeight: 'bold', // Personalize a fonte
  };
  const testimonialTituloStyle = {
    fontWeight: 'bold', // Personalize a fonte
    padding: '1em'
  };

  const testimonialTextStyle = {
    fontStyle: 'italic', // Personalize o estilo de fonte
    padding: '0.500em'
  };
  const containerStyle = {
    padding: '2em', // Altere o valor conforme necessário
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