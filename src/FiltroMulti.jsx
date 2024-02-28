import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./FiltroMulti.css";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { getDocs, collection } from "firebase/firestore";
import Container from "@mui/material/Container";
import {
  Modal,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  ListItem,
  List,
  ListItemText
} from "@mui/material";
import { getDatabase, ref, onValue } from 'firebase/database'

function FiltroMulti({ firebaseApp, onFilterChange, setPaginaAtual }) {
  const [selectedDisciplinas, setSelectedDisciplinas] = useState([]);
  const [selectedAssuntos, setSelectedAssuntos] = useState([]);
  const [assuntoOptions, setAssuntoOptions] = useState([]);
  const [selectedBancas, setSelectedBancas] = useState([]);
  const [selectedModalidades, setSelectedModalidades] = useState([]);
  const [selectedAnos, setSelectedAnos] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [selectedConcursos, setSelectedConcursos] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [filteredQuestoes, setFilteredQuestoes] = useState([]);
  const [keywords, setKeywords] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(0); // Novo estado para armazenar o número total de questões

  useEffect(() => {
    const questionsRef = ref(getDatabase(firebaseApp), 'questions');

    const fetchData = () => {
      onValue(questionsRef, (snapshot) => {
        const questionData = snapshot.val();

        if (questionData) {
          const questionArray = Object.keys(questionData).map((key) => ({
            id: key,
            ...questionData[key],
          }));

          setQuestions(questionArray);
          setTotalQuestions(questionArray.length); // Atualize o número total de questões
          handleFilterClick(questionArray);
        }
      });
    };

    fetchData();
  }, [firebaseApp]);


  const handleDisciplinasChange = (selectedDisciplinas) => {
    setSelectedDisciplinas(selectedDisciplinas);

    const filteredAssuntos = Array.from(
      new Set(
        questions
          .filter((item) =>
            selectedDisciplinas.some(
              (selected) => selected.value === item.disciplina
            )
          )
          .map((item) => item.assunto)
      )
    );

    setAssuntoOptions(
      filteredAssuntos.map((assunto) => ({
        value: assunto,
        label: assunto,
      }))
    );

    setSelectedAssuntos([]);
  };

  const handleAssuntosChange = (selectedAssuntos) => {
    setSelectedAssuntos(selectedAssuntos);
  };

  const uniqueDisciplinas = Array.from(
    new Set(questions.map((item) => item.disciplina))
  );

  const disciplinaOptions = uniqueDisciplinas.map((disciplina) => ({
    value: disciplina,
    label: disciplina,
  }));

  const uniqueBancas = Array.from(new Set(questions.map((item) => item.banca)));
  const bancaOptions = uniqueBancas.map((banca) => ({
    value: banca,
    label: banca,
  }));

  const uniqueModalidades = Array.from(
    new Set(questions.map((item) => item.modalidade))
  );
  const modalidadeOptions = uniqueModalidades.map((modalidade) => ({
    value: modalidade,
    label: modalidade,
  }));

  const uniqueAnos = Array.from(new Set(questions.map((item) => item.ano)));
  const anoOptions = uniqueAnos.map((ano) => ({
    value: ano,
    label: ano,
  }));

  const uniqueAreas = Array.from(new Set(questions.map((item) => item.area)));
  const areaOptions = uniqueAreas.map((area) => ({
    value: area,
    label: area,
  }));
  const uniqueConcursos = Array.from(new Set(questions.map((item) => item.concurso)));
  const concursoOptions = uniqueConcursos.map((concurso) => ({
    value: concurso,
    label: concurso,
  }));


  const handleFilterClick = (questionsToFilter = questions) => {
    const filteredQuestoes = questionsToFilter
      .filter((item) => {
        const disciplinaMatch =
          selectedDisciplinas.length === 0 ||
          selectedDisciplinas.some((selected) => selected.value === item.disciplina);
        const assuntoMatch =
          selectedAssuntos.length === 0 ||
          selectedAssuntos.some((selected) => selected.value === item.assunto);
        const bancaMatch =
          selectedBancas.length === 0 ||
          selectedBancas.some((selected) => selected.value === item.banca);
        const modalidadeMatch =
          selectedModalidades.length === 0 ||
          selectedModalidades.some((selected) => selected.value === item.modalidade);
        const anoMatch =
          selectedAnos.length === 0 || selectedAnos.some((selected) => selected.value === item.ano);
        const areaMatch =
          selectedAreas.length === 0 || selectedAreas.some((selected) => selected.value === item.area);
          const concursoMatch =
          selectedConcursos.length === 0 || selectedConcursos.some(
            (selected) => selected.label === item.concurso
          );
          

          const keywordsMatch =
        keywords.trim() === "" ||
        item.enunciado.toLowerCase().includes(keywords.toLowerCase()) ||
        item.ids.toString().includes(keywords)


        return (
          disciplinaMatch &&
          assuntoMatch &&
          bancaMatch &&
          modalidadeMatch &&
          areaMatch &&
          concursoMatch &&
          anoMatch &&
          keywordsMatch
        );
      })

      // Embaralhar aleatoriamente as questões
      const shuffledQuestoes = filteredQuestoes.sort(() => Math.random() - 0.5);

      setFilteredQuestoes(filteredQuestoes);
      onFilterChange(filteredQuestoes);
      setPaginaAtual(1);
  
    };

  // Antes de renderizar o componente Select "Banca", ordene o array bancaOptions em ordem alfabética.
  const sortedBancaOptions = bancaOptions.slice().sort((a, b) => a.label.localeCompare(b.label));
  const sortedConcursoOptions = concursoOptions.slice().sort((a, b) => a.label.localeCompare(b.label));
  const sortedDisciplinaOptions = disciplinaOptions.slice().sort((a, b) => a.label.localeCompare(b.label));
  const sortedAnoOptions = anoOptions.slice().sort((a, b) => b.label - a.label);


  return (
    <Box className="filter-container" sx={{ display: 'flex', flexWrap: 'wrap' }}>

      <Box className="div-filter2">
        <TextField
          type="text"
          className="filter-input"
          placeholder="Filtrar por palavra-chave..."
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          size="small"
          InputProps={{ style: { fontSize: '0.885em', color: 'black' } }} // Altere o valor do fontSize conforme necessário
        />
      </Box>

      <div className="div-filter">
        <Select
          className="filter-select"
          value={selectedDisciplinas}
          onChange={handleDisciplinasChange}
          options={sortedDisciplinaOptions}
          isMulti={true}
          placeholder="Disciplina"
          styles={{
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isFocused ? "#1C5253" : "white",
              color: state.isFocused ? "white" : "black",
            }),
          }}
        />
      </div>
      <div className="div-filter">
        <Select
          className="filter-select"
          value={selectedAssuntos}
          onChange={handleAssuntosChange}
          options={assuntoOptions}
          isMulti={true}
          placeholder="Assunto"
          isDisabled={selectedDisciplinas.length === 0}
          styles={{
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isFocused ? "#1C5253" : "white",
              color: state.isFocused ? "white" : "black",
            }),
          }}
        />
      </div>
      <div className="div-filter">
        <Select
          className="filter-select"
          value={selectedBancas}
          onChange={(selectedOptions) => setSelectedBancas(selectedOptions)}
          options={sortedBancaOptions}
          isMulti={true}
          placeholder="Banca"
          styles={{
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isFocused ? "#1C5253" : "white",
              color: state.isFocused ? "white" : "black",
            }),
          }}
        />
      </div>
      <div className="div-filter">
        <Select
          className="filter-select"
          value={selectedModalidades}
          onChange={(selectedOptions) =>
            setSelectedModalidades(selectedOptions)
          }
          options={modalidadeOptions}
          isMulti={true}
          placeholder="Modalidade"
          styles={{
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isFocused ? "#1C5253" : "white",
              color: state.isFocused ? "white" : "black",
            }),
          }}
        />
      </div>

      <div className="div-filter">
        <Select
          className="filter-select"
          value={selectedAnos}
          onChange={(selectedOptions) => setSelectedAnos(selectedOptions)}
          options={sortedAnoOptions}
          isMulti={true}
          placeholder="Ano"
          styles={{
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isFocused ? "#1C5253" : "white",
              color: state.isFocused ? "white" : "black",
            }),
          }}
        />
      </div>
      <div className="div-filter">
        <Select
          className="filter-select"
          value={selectedAreas}
          onChange={(selectedOptions) => setSelectedAreas(selectedOptions)}
          options={areaOptions}
          isMulti={true}
          placeholder="Área"
          styles={{
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isFocused ? "#1C5253" : "white",
              color: state.isFocused ? "white" : "black",
            }),
          }}
        />
      </div>
      <div className="div-filter">
        <Select
          className="filter-select"
          value={selectedConcursos}
          onChange={(selectedOptions) => setSelectedConcursos(selectedOptions)}
          options={sortedConcursoOptions}
          isMulti={true}
          placeholder="Instituição"
          styles={{
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isFocused ? "#1C5253" : "white",
              color: state.isFocused ? "white" : "black",
            }),
          }}
        />
      </div>
   
      <div>
        <Box sx={{ flexDirection: 'column', paddingLeft: '12em' }} className="div-button">
        <button className="filter-button" onClick={() => handleFilterClick(questions)}>
  Filtrar Questões
</button>

        </Box>
      </div>
  <Box sx={{ flexDirection: 'column', paddingTop: '0.500em', paddingBottom: '2em' }}>
      <Typography sx={{ fontFamily: 'Poppins', fontSize: '0.850em', fontWeight: '400', backgroundColor: 'white', color: 'black', padding: '0.500em', borderRadius: '5px', marginBottom: '0.300em' }}>
        {`${totalQuestions.toLocaleString()}  Questões no Site`}</Typography>

      <Typography sx={{ fontFamily: 'Poppins', fontSize: '0.850em', fontWeight: '500', backgroundColor: 'white', color: 'black', padding: '0.500em', borderRadius: '5px'  }}>
        {`${filteredQuestoes.length.toLocaleString()}  Questões filtradas`}
      </Typography>
    </Box>

  </Box>
    
  );
}




export default FiltroMulti;

