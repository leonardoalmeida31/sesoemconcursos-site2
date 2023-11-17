import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { Chart } from 'react-google-charts';
import "../App.css";
import IconButton from "@mui/material/IconButton";
import SignalCellularAltRoundedIcon from '@mui/icons-material/SignalCellularAltRounded';
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import {
  Modal,
  Button,
  Typography,
} from "@mui/material";

function EstatisticasQuestao({ questionId }) {
  const [graficosData, setGraficosData] = useState([]);
  const [showChart, setShowChart] = useState(false); // Estado para controlar a exibição do gráfico

  useEffect(() => {
    if (showChart && questionId) {
      async function fetchDadosGraficos() {
        try {
          const db = getFirestore();
          const dbRef = collection(db, 'alternativasRespondidas');

          const q = query(dbRef, where('questionId', '==', questionId));
          const querySnapshot = await getDocs(q);

          const graficos = [];

          querySnapshot.forEach((doc) => {
            const responseData = doc.data();

            const respostaCounts = responseData.respostaCounts || {};
            const data = [
              ['Alternativas mais respondidas', 'Respostas'],
              ['A', respostaCounts['0'] || 0],
              ['B', respostaCounts['1'] || 0],
              ['C', respostaCounts['2'] || 0],
              ['D', respostaCounts['3'] || 0],
              ['E', respostaCounts['4'] || 0],
            ];

            graficos.push({ questionId, data });
          });

          console.log('Dados recuperados do Firestore:', graficos);
          setGraficosData(graficos);
        } catch (error) {
          console.error('Erro ao buscar dados de alternativasRespondidas:', error);
        }
      }

      fetchDadosGraficos();
    }
  }, [showChart, questionId]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", color: "#1c5253", alignItems: "flex-start", justifyContent: 'flex-start', }}>
    <Box sx={{ display: "flex", flexDirection: "column", color: "#1c5253", alignItems: "flex-start", justifyContent: 'flex-start', }}>


      <IconButton sx={{ display: "flex", flexDirection: "row", color: "#1c5253", padding: "0.700em", alignItems: "flex-start" }}
        className="button-comentario" onClick={() => setShowChart(!showChart)}

      >
        {" "}
        <SignalCellularAltRoundedIcon fontSize="small" sx={{ display: "flex", flexDirection: "row", color: "#1c5253", backgroundColor: 'transparent' }} />
        <Typography sx={{ display: "flex", fontSize: '0.550em', color: "#1c5253", marginLeft: '0.500em', fontFamily: 'Poppins', fontWeight: '500', whiteSpace: 'nowrap' }} color="error">Estatísticas da Questão
        </Typography>
      </IconButton>

      {showChart && graficosData.map((grafico, index) => (
        <Box key={index} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: '5px' }}>
          {/* Gráfico de Barras - Contagem de Respostas */}
          <Chart
            width={'100%'}
            height={'100%'}
            chartType="ColumnChart"
            loader={<Box>Carregando Gráfico...</Box>}
            data={grafico.data}
            options={{
              title: 'Alternativas mais respondidas',
              colors: ['#1c5253', '#d95f02', '#7570b3', '#e7298a', '#66a61e'],
              hAxis: {
                title: 'Alternativas',
                textStyle: {
                  fontName: 'Poppins',
                  fontSize: 14,
                },
              },
              vAxis: {
                title: 'Números',
                textStyle: {
                  fontName: 'Poppins',
                  fontSize: 14,
                 
                },
              },
              titleTextStyle: {
                fontName: 'Poppins',
                fontSize: 12,
               
              },
              legend: { position: 'none' },
              animation: {
                duration: 1000,
                easing: 'out',
                startup: true,
              },
            }}
          />

          {/* Gráfico de Pizza - Porcentagem de Respostas */}
          <Chart
            width={'100%'}
            height={'100%'}
            chartType="PieChart"
            loader={<Box>Carregando Gráfico...</Box>}
            data={grafico.data}
            options={{
              title: 'Porcentagem de Respostas por Alternativa',
              pieHole: 0.3,
              pieSliceText: 'percentage',
              colors: ['#1c5253', 'red', 'orange', 'brown', '#66a61e'],
              legend: 'right',
              animation: {
                duration: 1000,
                easing: 'out',
                startup: true,
              },
              titleTextStyle: {
                fontName: 'Poppins',
                fontSize: 12,
               
              },
              pieSliceTextStyle: {
                fontName: 'Poppins',
                fontSize: 12,
              },
            }}
          />
        </Box>
      ))}
    </Box>
    </Box>
  );
}

export default EstatisticasQuestao;
