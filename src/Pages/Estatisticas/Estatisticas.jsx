import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Tabs,
  Tab,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { Chart } from "react-google-charts";
import FiltroMulti from "../../components/Filtros/FiltroMulti";
import { db } from "../../firebase";
import { getAuth } from "firebase/auth";
import { styled } from "@mui/system";

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  borderRadius: "12px",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
  },
}));

function Estatisticas() {
  const [user, setUser] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [questoesFiltradas, setQuestoesFiltradas] = useState([]);
  const [questoesPorPagina] = useState(5);
  const [tabValue, setTabValue] = useState(0);
  const totalPages = Math.ceil(questoesFiltradas.length / questoesPorPagina);

  const [questoesPorDisciplina, setQuestoesPorDisciplina] = useState([]);
  const [questoesPorAssunto, setQuestoesPorAssunto] = useState([]);
  const [questoesPorBanca, setQuestoesPorBanca] = useState([]);
  const [questoesPorAno, setQuestoesPorAno] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) setUser(currentUser);
  }, []);

  const handlePreviousPage = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
  };

  const handleNextPage = () => {
    if (paginaAtual < totalPages) setPaginaAtual(paginaAtual + 1);
  };

  const calcularEstatisticas = (key, setState) => {
    const estatisticas = {};
    questoesFiltradas.forEach((question) => {
      const valor = question[key] || "Não especificado"; // Evita valores undefined
      estatisticas[valor] = (estatisticas[valor] || 0) + 1;
    });
    const data = [["Categoria", "Quantidade"]];
    Object.entries(estatisticas).forEach(([name, value]) => {
      data.push([name, value]);
    });
    setState(data);
  };

  useEffect(() => {
    calcularEstatisticas("disciplina", setQuestoesPorDisciplina);
    calcularEstatisticas("assunto", setQuestoesPorAssunto);
    calcularEstatisticas("banca", setQuestoesPorBanca);
    calcularEstatisticas("ano", setQuestoesPorAno);
  }, [questoesFiltradas]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const columnChartOptions = {
    chartArea: { width: "70%", height: "70%" },
    hAxis: {
      title: "Categoria",
      titleTextStyle: { color: "#333" },
      slantedText: true, // Inclina os rótulos se forem longos
      slantedTextAngle: 45,
    },
    vAxis: { title: "Quantidade", minValue: 0 },
    legend: { position: "none" }, // Remove a legenda para simplificar
    bar: { groupWidth: "75%" }, // Define a largura das barras (75% do espaço disponível)
  };

  return (
    <Box sx={{ backgroundColor: "#f5f7fa", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="xl">
        <Typography
          variant="h4"
          sx={{
            fontFamily: "Poppins",
            fontWeight: "600",
            textAlign: "center",
            color: "#1c5253",
            mb: 2,
          }}
        >
          Dashboard de Análise de Questões
        </Typography>
        <Typography
          sx={{
            fontSize: "0.9em",
            fontFamily: "Poppins",
            textAlign: "center",
            color: "#666",
            mb: 4,
          }}
        >
          A única plataforma especializada em Serviço Social para concursos
        </Typography>

        <FiltroMulti
          onFilterChange={setQuestoesFiltradas}
          setPaginaAtual={setPaginaAtual}
          db={db}
        />

        <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
          <Button
            variant="outlined"
            onClick={handlePreviousPage}
            disabled={paginaAtual === 1}
            sx={{ mr: 1 }}
          >
            Anterior
          </Button>
          <Typography
            sx={{ fontFamily: "Poppins", fontSize: "1em", mx: 2, alignSelf: "center" }}
          >
            {paginaAtual.toLocaleString("pt-BR")} de{" "}
            {totalPages.toLocaleString("pt-BR")}
          </Typography>
          <Button
            variant="outlined"
            onClick={handleNextPage}
            disabled={paginaAtual === totalPages}
          >
            Próxima
          </Button>
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{ mb: 4 }}
        >
          <Tab label="Disciplinas" />
          <Tab label="Assuntos" />
          <Tab label="Bancas" />
          <Tab label="Anos" />
        </Tabs>

        <Grid container spacing={3} justifyContent="center">
          {tabValue === 0 && (
            <Grid item xs={12} md={12}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" color="textSecondary" align="center">
                    Questões por Disciplina
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Chart
                    chartType="ColumnChart"
                    width="100%"
                    height="400px"
                    data={questoesPorDisciplina}
                    options={{ ...columnChartOptions, colors: ["#0088FE"] }}
                  />
                </CardContent>
              </StyledCard>
            </Grid>
          )}

          {tabValue === 1 && (
            <Grid item xs={12} md={8}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" color="textSecondary" align="center">
                    Questões por Assunto
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Chart
                    chartType="ColumnChart"
                    width="100%"
                    height="400px"
                    data={questoesPorAssunto}
                    options={{ ...columnChartOptions, colors: ["#FF8042"] }}
                  />
                </CardContent>
              </StyledCard>
            </Grid>
          )}

          {tabValue === 2 && (
            <Grid item xs={12} md={8}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" color="textSecondary" align="center">
                    Questões por Banca
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Chart
                    chartType="ColumnChart"
                    width="100%"
                    height="400px"
                    data={questoesPorBanca}
                    options={{ ...columnChartOptions, colors: ["#00C49F"] }}
                  />
                </CardContent>
              </StyledCard>
            </Grid>
          )}

          {tabValue === 3 && (
            <Grid item xs={12} md={8}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" color="textSecondary" align="center">
                    Questões por Ano
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Chart
                    chartType="ColumnChart"
                    width="100%"
                    height="400px"
                    data={questoesPorAno}
                    options={{ ...columnChartOptions, colors: ["#FFBB28"] }}
                  />
                </CardContent>
              </StyledCard>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}

export default Estatisticas;