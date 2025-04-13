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

// Função para aplicar o gradiente SVG
const applyGradient = (chart) => {
  const chartSvg = chart.getContainer().querySelector("svg");

  // Adiciona o elemento <defs> com o gradiente, se ainda não existir
  let defs = chartSvg.querySelector("defs");
  if (!defs) {
    defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    chartSvg.insertBefore(defs, chartSvg.firstChild);
  }

  // Define o gradiente linear
  const gradientId = "greenGradient";
  let gradient = defs.querySelector(`#${gradientId}`);
  if (!gradient) {
    gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    gradient.setAttribute("id", gradientId);
    gradient.setAttribute("x1", "0%");
    gradient.setAttribute("y1", "0%");
    gradient.setAttribute("x2", "0%");
    gradient.setAttribute("y2", "100%");

    const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", "#1C5253"); // Verde escuro

    const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("stop-color", "#A3D8C6"); // Verde claro

    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
  }

  // Aplica o gradiente às barras
  const bars = chartSvg.querySelectorAll("rect[fill]");
  bars.forEach((bar) => {
    if (bar.getAttribute("fill").startsWith("#")) { // Só aplica se for uma cor sólida
      bar.setAttribute("fill", `url(#${gradientId})`);
    }
  });
};

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
      const valor = question[key] || "Não especificado";
      estatisticas[valor] = (estatisticas[valor] || 0) + 1;
    });
    const data = [["Categoria", "Quantidade"]];
    // Ordena por quantidade em ordem decrescente e limita aos 20 primeiros
    const sortedEntries = Object.entries(estatisticas)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20); // Limita aos 20 maiores
    sortedEntries.forEach(([name, value]) => {
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
      slantedText: true,
      slantedTextAngle: 45,
    },
    vAxis: { title: "Quantidade", minValue: 0 },
    legend: { position: "none" },
    bar: { groupWidth: "75%" },
    colors: ["#1C5253"], // Cor sólida como fallback
  };

  const chartEvents = [
    {
      eventName: "ready",
      callback: ({ chartWrapper }) => {
        const chart = chartWrapper.getChart();
        applyGradient(chart);
      },
    },
  ];

  const getTop10 = (data) => {
    const dataSemCabecalho = data.slice(1);
    return dataSemCabecalho
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
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
            color: "#1C5253",
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
                    options={columnChartOptions}
                    chartEvents={chartEvents}
                  />
                  <Box
                    sx={{
                      mt: 3,
                      p: 2,
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontFamily: "Poppins",
                        fontWeight: "500",
                        color: "#1C5253",
                        mb: 1.5,
                        textAlign: "center",
                      }}
                    >
                      Top 10 Disciplinas
                    </Typography>
                    {getTop10(questoesPorDisciplina).map(([categoria, quantidade], index) => (
                      <Typography
                        key={index}
                        sx={{
                          fontFamily: "Poppins",
                          fontSize: "0.95rem",
                          color: "#333",
                          py: 0.5,
                          px: 1,
                          borderBottom: "1px solid #eee",
                          "&:last-child": { borderBottom: "none" },
                          textAlign: "center",
                        }}
                      >
                        <strong>{categoria}</strong>: {quantidade}
                      </Typography>
                    ))}
                  </Box>
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
                    options={columnChartOptions}
                    chartEvents={chartEvents}
                  />
                  <Box
                    sx={{
                      mt: 3,
                      p: 2,
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontFamily: "Poppins",
                        fontWeight: "500",
                        color: "#1C5253",
                        mb: 1.5,
                        textAlign: "center",
                      }}
                    >
                      Top 10 Assuntos
                    </Typography>
                    {getTop10(questoesPorAssunto).map(([categoria, quantidade], index) => (
                      <Typography
                        key={index}
                        sx={{
                          fontFamily: "Poppins",
                          fontSize: "0.95rem",
                          color: "#333",
                          py: 0.5,
                          px: 1,
                          borderBottom: "1px solid #eee",
                          "&:last-child": { borderBottom: "none" },
                          textAlign: "center",
                        }}
                      >
                        <strong>{categoria}</strong>: {quantidade}
                      </Typography>
                    ))}
                  </Box>
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
                    options={columnChartOptions}
                    chartEvents={chartEvents}
                  />
                  <Box
                    sx={{
                      mt: 3,
                      p: 2,
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontFamily: "Poppins",
                        fontWeight: "500",
                        color: "#1C5253",
                        mb: 1.5,
                        textAlign: "center",
                      }}
                    >
                      Top 10 Bancas
                    </Typography>
                    {getTop10(questoesPorBanca).map(([categoria, quantidade], index) => (
                      <Typography
                        key={index}
                        sx={{
                          fontFamily: "Poppins",
                          fontSize: "0.95rem",
                          color: "#333",
                          py: 0.5,
                          px: 1,
                          borderBottom: "1px solid #eee",
                          "&:last-child": { borderBottom: "none" },
                          textAlign: "center",
                        }}
                      >
                        <strong>{categoria}</strong>: {quantidade}
                      </Typography>
                    ))}
                  </Box>
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
                    options={columnChartOptions}
                    chartEvents={chartEvents}
                  />
                  <Box
                    sx={{
                      mt: 3,
                      p: 2,
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontFamily: "Poppins",
                        fontWeight: "500",
                        color: "#1C5253",
                        mb: 1.5,
                        textAlign: "center",
                      }}
                    >
                      Top 10 Anos
                    </Typography>
                    {getTop10(questoesPorAno).map(([categoria, quantidade], index) => (
                      <Typography
                        key={index}
                        sx={{
                          fontFamily: "Poppins",
                          fontSize: "0.95rem",
                          color: "#333",
                          py: 0.5,
                          px: 1,
                          borderBottom: "1px solid #eee",
                          "&:last-child": { borderBottom: "none" },
                          textAlign: "center",
                        }}
                      >
                        <strong>{categoria}</strong>: {quantidade}
                      </Typography>
                    ))}
                  </Box>
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