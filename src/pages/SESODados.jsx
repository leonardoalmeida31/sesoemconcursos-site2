import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Grid } from "@mui/material";
import { Chart } from "react-google-charts";
import Select from "react-select";

const SESODashboard = () => {
    const [data, setData] = useState(null);
    const [filteredData, setFilteredData] = useState(null);
    const [selectedBanca, setSelectedBanca] = useState(null);
    const [selectedConcurso, setSelectedConcurso] = useState(null);
    const [selectedDisciplinas, setSelectedDisciplinas] = useState([]);

    useEffect(() => {
        fetch("https://api-seso-em-dados.vercel.app/SESODados", {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            setData(data);
            setFilteredData(data);
        })
        .catch(error => console.error("Erro ao buscar dados: ", error));
    }, []);

    const handleBancaChange = (selectedOption) => {
        setSelectedBanca(selectedOption);
        setSelectedConcurso(null); // Reset selected concurso when changing banca
        setSelectedDisciplinas([]); // Reset selected disciplinas when changing banca
        if (selectedOption) {
            setFilteredData(data.filter(item => item.banca === selectedOption.value));
        } else {
            setFilteredData(data);
        }
    };

    const handleConcursoChange = (selectedOption) => {
        setSelectedConcurso(selectedOption);
        setSelectedDisciplinas([]); // Reset selected disciplinas when changing concurso
        if (selectedOption) {
            setFilteredData(data.filter(item => item.concurso === selectedOption.value));
        } else {
            setFilteredData(data);
        }
    };

    const handleDisciplinasChange = (selectedOptions) => {
        setSelectedDisciplinas(selectedOptions);
    };

    const generateChartData = () => {
        const charts = selectedDisciplinas.map((selectedDisciplina) => {
            const chartData = [["Assunto", "Quantidade"]];
            const disciplinaData = filteredData.find(item => item.banca === selectedBanca.value && item.concurso === selectedConcurso.value)?.disciplinas.find(disciplina => disciplina.nome === selectedDisciplina.label);
            if (disciplinaData) {
                disciplinaData.assuntos.forEach(assunto => {
                    chartData.push([assunto.nome, assunto.quantidade]);
                });
            }
            return (
                <Grid item xs={12} md={6} key={selectedDisciplina.label}>
                    <Chart
                        width={"100%"}
                        height={"400px"}
                        chartType="PieChart"
                        loader={<div>Carregando Gráfico...</div>}
                        data={chartData}
                        options={{
                            title: `Distribuição de Assuntos por Disciplina: ${selectedDisciplina.label}`,
                            pieHole: 0.4,
                        }}
                    />
                </Grid>
            );
        });

        return charts;
    };

    const calculateTotalQuestoes = () => {
        if (!filteredData) return 0;
        return filteredData.reduce((total, item) => total + item.questoesProva, 0);
    };

    const totalQuestoes = calculateTotalQuestoes();
    const totalQuestoesRecuperadas = filteredData ? filteredData.reduce((total, item) => {
        return total + item.disciplinas.reduce((subTotal, disciplina) => {
            return subTotal + disciplina.assuntos.reduce((assuntoTotal, assunto) => {
                return assuntoTotal + assunto.quantidade;
            }, 0);
        }, 0);
    }, 0) : 0;

    const bancasOptions = data ? [...new Set(data.map(item => item.banca))].map(banca => ({ value: banca, label: banca })) : [];
    const concursosOptions = selectedBanca ? [...new Set(filteredData.filter(item => item.banca === selectedBanca.value).map(item => item.concurso))].map(concurso => ({ value: concurso, label: concurso })) : [];
    const disciplinasOptions = selectedBanca && selectedConcurso ? filteredData.find(item => item.banca === selectedBanca.value && item.concurso === selectedConcurso.value)?.disciplinas.map(disciplina => ({ value: disciplina.nome, label: disciplina.nome })) : [];

    return (
        <Container maxWidth="xl" sx={{ backgroundColor: '#F9F9F9' }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h4">Dashboard de Dados</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Select
                        options={bancasOptions}
                        isClearable
                        placeholder="Selecione uma Banca"
                        onChange={handleBancaChange}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Select
                        options={concursosOptions}
                        isClearable
                        placeholder="Selecione um Concurso"
                        onChange={handleConcursoChange}
                        isDisabled={!selectedBanca}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Select
                        options={disciplinasOptions}
                        isMulti
                        placeholder="Selecione uma ou mais Disciplinas"
                        value={selectedDisciplinas}
                        onChange={handleDisciplinasChange}
                        isDisabled={!selectedBanca || !selectedConcurso}
                    />
                </Grid>
                {selectedDisciplinas.length > 0 && (
                    <>
                        <Grid item xs={12}>
                            <Typography variant="h6">Gráficos de Assuntos por Disciplina</Typography>
                        </Grid>
                        {generateChartData()}
                    </>
                )}
                <Grid item xs={12} sm={6}>
                    <Box sx={{ padding: 2, border: '1px solid #ccc', borderRadius: 4 }}>
                        <Typography variant="h6">Número de Questões por Prova</Typography>
                        <Typography variant="h4">{totalQuestoes}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box sx={{ padding: 2, border: '1px solid #ccc', borderRadius: 4 }}>
                        <Typography variant="h6">Número Total de Questões Recuperadas</Typography>
                        <Typography variant="h4">{totalQuestoesRecuperadas}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    {filteredData ? (
                        <Box>
                            <Typography variant="h6">Detalhes</Typography>
                            {filteredData.map((item) => (
                                <Box key={item.ids} sx={{ marginBottom: 2 }}>
                                    <Typography variant="h6">Banca: {item.banca}</Typography>
                                    <Typography variant="h6">Concurso: {item.concurso}</Typography>
                                    <Typography variant="h6">Ano: {item.ano}</Typography>
                                    <Typography variant="h6">Área: {item.area}</Typography>
                                    {item.disciplinas.map((disciplina, index) => (
                                        <Box key={index} sx={{ marginLeft: 2, marginTop: 1 }}>
                                            <Typography variant="h6">Disciplina: {disciplina.nome}</Typography>
                                            <ul>
                                                {disciplina.assuntos.map((assunto, i) => (
                                                    <li key={i}>
                                                        <strong>{assunto.nome}</strong> (Quantidade: {assunto.quantidade})
                                                        <ul>
                                                            {assunto.subassuntos && assunto.subassuntos.map((subassunto, j) => (
                                                                <li key={j}>
                                                                    {subassunto.nome} (Quantidade: {subassunto.quantidade})
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </li>
                                                ))}
                                            </ul>
                                        </Box>
                                    ))}
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Typography>Carregando dados...</Typography>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default SESODashboard;
