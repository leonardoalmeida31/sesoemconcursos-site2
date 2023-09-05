import React from "react";
import Chart from "react-google-charts";

const DesempenhoNaDisciplina = ({ disciplina, acertos, erros }) => {
  return (
    <div className="disciplina-desempenho">
      <p>{disciplina}</p>
      <Chart
        width={"100%"}
        height={200}
        chartType="PieChart"
        loader={<div>Loading Chart</div>}
        data={[
          ["Resultado", "Quantidade"],
          ["Acertos", acertos],
          ["Erros", erros],
        ]}
        options={{
          title: "Seu Desempenho na Disciplina:",
          is3D: true,
          colors: ['#1c5253', '#B22222'],
        }}
      />
    </div>
  );
};

export default DesempenhoNaDisciplina;
