import React from 'react';
import Slider from 'react-slick';
import { Avatar, Grid, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/system';

function Anuncios() {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('xl')); // Detecta telas menores que XL

    // Configuração das imagens para telas maiores e menores
    const slides = isSmallScreen
        ? [

            {
                link: '/CursoIdosa',
                imgSrc: 'https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/ANUNCIOS-CURSOS-FOTOS-SITE%2Fcapa%20mobile%20etica%203.jpg?alt=media&token=33e96cdf-c195-4987-b154-e1043c1864a1',
            },
              {
                  link: '/CursoCEP',
                  imgSrc: 'https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/ANUNCIOS-CURSOS-FOTOS-SITE%2Fcapa%20mobile%20etica%20(1).png?alt=media&token=d7e1b9ab-48c5-4272-a46f-b72627d485c7',
              },
              
          ]
        : [

            {
                link: '/CursoIdosa',
                imgSrc: 'https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/ANUNCIOS-CURSOS-FOTOS-SITE%2Fcapa%20idosa%20-%20web%202.jpg?alt=media&token=88740344-8b5e-4113-a01d-bab511bd6d67',
            },
              {
                  link: '/CursoCEP',
                  imgSrc: 'https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/ANUNCIOS-CURSOS-FOTOS-SITE%2F_thumb%20CODIGO-1%20(1980%20x%20250%20px)%20(1).png?alt=media&token=1f28fc04-05fc-4f0b-9650-a4f7ff26b0f4',
              },
           
          ];

    // Configuração do slider
    const settings = {
        dots: true,
        infinite: true,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
    };

    return (
        <Grid container sx={{ justifyContent: 'center' }}>
            <Grid item xs={12}>
                <Slider {...settings}>
                    {slides.map((slide, index) => (
                        <a key={index} href={slide.link} target="_blank" rel="noopener noreferrer">
                            <Avatar
                                alt={`Slide ${index + 1}`}
                                src={slide.imgSrc}
                                sx={{
                                    width: '100%',
                                    height: isSmallScreen ? 170 : 150, // Altura diferente para telas menores e maiores
                                    borderRadius: 0,
                                }}
                            />
                        </a>
                    ))}
                </Slider>
            </Grid>
        </Grid>
    );
}

export default Anuncios;
