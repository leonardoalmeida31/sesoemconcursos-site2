import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { Box, Container, Typography } from '@mui/material';

// Importe a fonte Arial (se já não estiver importada)

function ChartsCamila() {
    // Configuração da fonte Arial para Highcharts
    Highcharts.setOptions({
        chart: {
            style: {
                fontFamily: 'Arial, sans-serif'
            }
        },
        title: {
            style: {
                fontFamily: 'Arial, sans-serif'
            }
        },
        subtitle: {
            style: {
                fontFamily: 'Arial, sans-serif'
            }
        },
        xAxis: {
            labels: {
                style: {
                    fontFamily: 'Arial, sans-serif'
                }
            }
        },
        yAxis: {
            title: {
                style: {
                    fontFamily: 'Arial, sans-serif'
                }
            },
            labels: {
                style: {
                    fontFamily: 'Arial, sans-serif'
                }
            }
        },
        legend: {
            itemStyle: {
                fontFamily: 'Arial, sans-serif'
            }
        }
    });

    const options = {
        chart: {
            type: 'line'
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: [
                'Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 
                'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
            ],
            labels: {
                style: {
                    fontFamily: 'Arial, sans-serif'
                }
            }
        },
        yAxis: [{
            title: {
                text: 'Temperatura (°C)',
                style: {
                    fontFamily: 'Arial, sans-serif'
                }
            },
            tickPositions: [15, 20, 25, 30, 35, 40], // Define os valores desejados para as marcações
            labels: {
                format: '{value}°C',
                style: {
                    fontFamily: 'Arial, sans-serif'
                }
            }
        }, {
            title: {
                text: 'Precipitação (mm)',
                style: {
                    fontFamily: 'Arial, sans-serif'
                }
            },
            opposite: true,
            labels: {
                style: {
                    fontFamily: 'Arial, sans-serif'
                }
            }
        }],
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: false // Desabilita os data labels para a série de linha
                },
                enableMouseTracking: false
            },
            column: {
                dataLabels: {
                    enabled: false // Desabilita os data labels para a série de coluna
                },
                enableMouseTracking: true,
                color: '#7cb5ec' // Cor das barras de precipitação
            }
        },
        series: [
            {
                name: 'Precipitação (mm)',
                type: 'column', // Define o tipo como coluna para a série de precipitação
                data: [79, 64, 81, 63, 50, 48, 45, 41, 29, 33, 59, 68],
                yAxis: 1,
                color: '#7cb5ec' // Cor das barras de precipitação
            },
            {
                name: 'Minima (°C)',
                data: [21, 21, 21, 21, 20, 19, 18, 17, 18, 20, 20, 21],
                color: '#0000FF' // Cor da linha de mínima
            },
            {
                name: 'Máxima (°C)',
                data: [30, 30, 30, 29, 27, 25, 25, 25, 28, 30, 30, 30],
                color: '#FF0000' // Cor da linha de máxima
            },
        ]
    };

    return (
        <Container maxWidth='xl'>
            <Box sx={{justifyContent: 'center', padding: '2em'}}>
                <Typography>
                    Teste
                </Typography>
            </Box>
            <Box sx={{display: 'flex', justifyContent: 'center', padding: '0em'}}>
                <Box sx={{ padding: '0em' }}>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={options}
                    />
                </Box>
                <Box sx={{ padding: '0em' }}>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={options}
                    />
                </Box>
            </Box>
        </Container>
    );
}

export default ChartsCamila;
