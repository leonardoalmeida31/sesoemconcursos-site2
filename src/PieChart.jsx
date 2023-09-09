import React from "react";
import { Chart } from "react-google-charts";

const PieChart = ({ data, options, title }) => {
  return (
    <div className="grafico-pizza">
      
      <Chart className="piechart"
        width={'100%'}
        height={250}
        chartType="PieChart"
        data={data}
        options={{
        title,
          is3D: true,
          colors: ['#1c5253', '#B22222'],
        
          ...options, // Você pode passar opções adicionais como props
        }}
        rootProps={{ 'data-testid': '1' }}
      />
    </div>
  );
};

export default PieChart;
