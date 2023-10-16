import React from "react";
import { Container, Grid, Card, CardContent, Typography, Button, List, ListItem, ListItemText } from "@mui/material";
import { styled } from "@mui/system";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#f0f0f0",
  border: "1px solid #ccc",
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  height: "100%",
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const StyledPrice = styled(Typography)(({ theme }) => ({
  fontSize: "2rem",
  fontWeight: "bold",
  color: "#007bff",
  alignItems: "center"
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: "1rem",
  backgroundColor: "#007bff",
  color: "white",
  '&:hover': {
    backgroundColor: "#0056b3",
  },
}));

const Assinatura = () => {
  const planos = [
    {
      nome: "Mensal",
      preco: "R$ 11,99/mês",
      beneficios: [
        { texto: "Resolução de Questões Ilimitadas", icone: <CheckIcon style={{ color: "#1c5253" }} /> },
        { texto: "Comentários de professores", icone: <CheckIcon style={{ color: "#1c5253" }}  /> },
        { texto: "Questões Discursivas Liberadas", icone: <CheckIcon style={{ color: "#1c5253" }}  /> },
        { texto: "Acesso ao gráfico de Desempenho Ilimitado", icone: <CheckIcon style={{ color: "#1c5253" }}  /> },
        { texto: "Participar do Ranking de Desempenho do Site", icone: <CheckIcon style={{ color: "#1c5253" }}  /> },
        { texto: "Maior custo a longo prazo", icone: <ClearIcon style={{ color: "#ff0000" }}/> },
      ],
    },
    {
      nome: "Semestral",
      preco: "R$ 60,00/a cada 6 meses",
      beneficios: [
        { texto: "Resolução de Questões Ilimitadas", icone: <CheckIcon style={{ color: "#1c5253" }} /> },
        { texto: "Comentários de professores", icone: <CheckIcon style={{ color: "#1c5253" }}  /> },
        { texto: "Questões Discursivas Liberadas", icone: <CheckIcon style={{ color: "#1c5253" }}  /> },
        { texto: "Acesso ao gráfico de Desempenho Ilimitado", icone: <CheckIcon style={{ color: "#1c5253" }}  /> },
        { texto: "Participar do Ranking de Desempenho do Site", icone: <CheckIcon style={{ color: "#1c5253" }}  /> },
        { texto: "Plano mais popular", icone: <CheckIcon style={{ color: "#1c5253" }}  /> },
        { texto: "Suporte 24/7", icone: <ClearIcon style={{ color: "#ff0000",  }}/> },
      ],
    },
    {
      nome: "Anual",
      preco: "R$ 120,00/a cada 12 meses",
      beneficios: [
        { texto: "Resolução de Questões Ilimitadas", icone: <CheckIcon style={{ color: "#1c5253" }}  /> },
        { texto: "Comentários de professores", icone: <CheckIcon style={{ color: "#1c5253" }}  /> },
        { texto: "Questões Discursivas Liberadas", icone: <CheckIcon style={{ color: "#1c5253" }}  /> },
        { texto: "Acesso ao gráfico de Desempenho Ilimitado", icone: <CheckIcon style={{ color: "#1c5253" }}  /> },
        { texto: "Participar do Ranking de Desempenho do Site", icone: <CheckIcon style={{ color: "#1c5253" }}  /> },
        { texto: "Maior desconto", icone: <CheckIcon style={{ color: "#1c5253" }}  /> },
        { texto: "Suporte prioritário", icone: <ClearIcon style={{ color: "#ff0000" }} /> },
      ],
    },
  ];

  return (
    <Container>
      <Grid container spacing={3}>
        {planos.map((plano, index) => (
          <Grid item xs={10} sm={6} md={4} key={index}>
            <StyledCard>
              <StyledCardContent>
                <Typography variant="h6" component="div">
                  {plano.nome}
                </Typography>
                <StyledPrice sx={{fontSize: "1.2em", color: "#1c5253"}}>{plano.preco}</StyledPrice>
                <List>
                  {plano.beneficios.map((beneficio, idx) => (
                    <ListItem key={idx}>
                      {beneficio.icone} 
                      <ListItemText primary={beneficio.texto} />
                    </ListItem>
                  ))}
                </List>
              </StyledCardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
      {/* Botão "Assinar Agora" fora do mapeamento de planos */}
      <StyledButton variant="contained" color="primary">
        Assinar Agora
      </StyledButton>
    </Container>
  );
};

export default Assinatura;
