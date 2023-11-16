import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { Chart } from 'react-google-charts';

function EstatisticasQuestao({ questionId }) {
  const [graficosData, setGraficosData] = useState([]);

  useEffect(() => {
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
            ['Alternativas', 'Respostas'],
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

    if (questionId) {
      fetchDadosGraficos();
    }
  }, [questionId]);

  return (
    <div>
      <h2>Gráficos de Barras com Respostas</h2>
      {graficosData.map((grafico, index) => (
        <div key={index}>
          <h3>Question ID: {grafico.questionId}</h3>
          <Chart
            width={'500px'}
            height={'300px'}
            chartType="Bar"
            loader={<div>Carregando Gráfico...</div>}
            data={grafico.data}
            options={{
              showRowNumber: true,
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default EstatisticasQuestao;
