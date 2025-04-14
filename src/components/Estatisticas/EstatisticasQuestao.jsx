import React, { useEffect } from 'react';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Box, Typography, Grid } from '@mui/material';
import '../../App.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, BarElement);

// eslint-disable-next-line react/prop-types
function EstatisticasQuestao({ questionId, showChart }) {
  const [graficosData, setGraficosData] = React.useState(null);

  useEffect(() => {
    if (showChart && questionId) {
      async function fetchDadosGraficos() {
        try {
          const db = getFirestore();
          const dbRef = collection(db, 'alternativasRespondidas');
          const q = query(dbRef, where('questionId', '==', questionId));
          const querySnapshot = await getDocs(q);

          const respostaCounts = { '0': 0, '1': 0, '2': 0, '3': 0, '4': 0 };
          querySnapshot.forEach((doc) => {
            const data = doc.data().respostaCounts || {};
            Object.keys(respostaCounts).forEach((key) => {
              respostaCounts[key] += data[key] || 0;
            });
          });

          const labels = ['A', 'B', 'C', 'D', 'E'];
          const values = Object.values(respostaCounts);
          const total = values.reduce((sum, val) => sum + val, 0);

          // Calculate percentages for pie chart
          const percentages = values.map(value => total > 0 ? (value / total) * 100 : 0);

          setGraficosData({
            barData: {
              labels,
              datasets: [
                {
                  label: 'Respostas',
                  data: values,
                  backgroundColor: [
                    '#4B728A', // Azul suave
                    '#A4C2A8', // Verde claro
                    '#F4A261', // Laranja suave
                    '#E76F51', // Coral
                    '#9D8189', // Roxo acinzentado
                  ],
                  borderColor: '#ffffff',
                  borderWidth: 1,
                },
              ],
            },
            pieData: {
              labels,
              datasets: [
                {
                  data: values,
                  backgroundColor: [
                    '#4B728A', // Azul suave
                    '#A4C2A8', // Verde claro
                    '#F4A261', // Laranja suave
                    '#E76F51', // Coral
                    '#9D8189', // Roxo acinzentado
                  ],
                  borderColor: '#ffffff',
                  borderWidth: 2,
                  hoverOffset: 20,
                },
              ],
            },
          });
        } catch (error) {
          console.error('Erro ao buscar dados de alternativasRespondidas:', error);
        }
      }
      fetchDadosGraficos();
    }
  }, [showChart, questionId]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: { family: 'Poppins', size: 14, weight: '500' },
          color: '#1c5253',
          padding: 20,
        },
      },
      tooltip: {
        bodyFont: { family: 'Poppins', size: 12 },
        titleFont: { family: 'Poppins', size: 14 },
        backgroundColor: 'rgba(28, 82, 83, 0.8)',
        cornerRadius: 8,
      },
      animation: {
        duration: 1500,
        easing: 'easeInOutQuart',
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Alternativas mais respondidas',
        font: { family: 'Poppins', size: 16 },
        color: '#1c5253',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Alternativas',
          font: { family: 'Poppins', size: 12 },
          color: '#1c5253',
        },
        ticks: { font: { family: 'Poppins', size: 12 } },
      },
      y: {
        title: {
          display: true,
          text: 'Quantidade',
          font: { family: 'Poppins', size: 12 },
          color: '#1c5253',
        },
        ticks: { font: { family: 'Poppins', size: 12 } },
        beginAtZero: true,
      },
    },
  };

  const pieOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Porcentagem de Respostas por Alternativa',
        font: { family: 'Poppins', size: 16 },
        color: '#1c5253',
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const dataset = context.dataset;
            const total = dataset.data.reduce((sum, val) => sum + val, 0);
            const value = dataset.data[context.dataIndex];
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) + '%' : '0%';
            return `${context.label}: ${percentage}`;
          }
        }
      },
      datalabels: {
        display: true,
        formatter: (value, ctx) => {
          const dataset = ctx.chart.data.datasets[0];
          const total = dataset.data.reduce((sum, val) => sum + val, 0);
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) + '%' : '0%';
          return percentage;
        },
        color: '#fff',
        font: { family: 'Poppins', size: 12, weight: 'bold' },
      }
    },
    elements: {
      arc: {
        borderWidth: 2,
        shadowOffsetX: 3,
        shadowOffsetY: 3,
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.2)',
      },
    },
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        p: 1,
        borderRadius: 2,
        width: '100%',
      }}
    >
      {showChart && graficosData && (
        <Grid
          container
          spacing={2} // Espaçamento entre os gráficos
          sx={{
            width: '100%',
            mt: 2,
            backgroundColor: '#f9fafb',
            alignItems: 'center',
          }}
        >
          <Grid item xs={12} sm={6}> {/* Cada gráfico ocupa metade da tela */}
            <Box sx={{ height: 350, width: '100%' }}>
              {graficosData.barData ? (
                <Bar data={graficosData.barData} options={barOptions} />
              ) : (
                <Typography>Carregando Gráfico...</Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} >
            <Box sx={{ height: 350, width: '100%' }}>
              {graficosData.pieData ? (
                <Pie data={graficosData.pieData} options={pieOptions} />
              ) : (
                <Typography>Carregando Gráfico...</Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default EstatisticasQuestao;