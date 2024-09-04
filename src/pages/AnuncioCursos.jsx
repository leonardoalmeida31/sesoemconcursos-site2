import React, { useEffect, useState } from 'react';
import { Button, Typography, CircularProgress, Container, Grid, Paper, Avatar } from '@mui/material';



function Anuncios() {
    const link = "https://sesoemconcursos.com.br/CursoCEP"; // Substitua pelo seu link desejado
  
    return (
      <Grid container sx={{ justifyContent: 'center' }}>
        {/* Avatar para telas XL */}
        <Grid item xs={12} display={{ xs: 'none', xl: 'block' }}>
          <a href={link} target="_blank" rel="noopener noreferrer">
            <Avatar
              alt="Avatar for XL"
              src="https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/ANUNCIOS-CURSOS-FOTOS-SITE%2F_thumb%20CODIGO-1%20(1980%20x%20250%20px)%20(1).png?alt=media&token=1f28fc04-05fc-4f0b-9650-a4f7ff26b0f4"
              sx={{
                width: '100%',   // Faz com que o avatar ocupe 100% da largura do grid
                height: 150,     // Altura fixa do avatar
                borderRadius: 0  // Remove o border-radius para manter o avatar quadrado
              }}
            />
          </a>
        </Grid>
  
        {/* Avatar para telas XS */}
        <Grid item xs={12} display={{ xs: 'block', xl: 'none' }}>
          <a href={link} target="_blank" rel="noopener noreferrer">
            <Avatar
              alt="Avatar for XS"
              src="https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/ANUNCIOS-CURSOS-FOTOS-SITE%2Fcapa%20mobile%20etica%20(1).png?alt=media&token=d7e1b9ab-48c5-4272-a46f-b72627d485c7"
              sx={{
                width: '100%',   // Faz com que o avatar ocupe 100% da largura do grid
                height: 170,     // Altura fixa do avatar
                borderRadius: 0  // Remove o border-radius para manter o avatar quadrado
              }}
            />
          </a>
        </Grid>
      </Grid>
    );
  }
  
  export default Anuncios;