import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./FiltroMulti.css";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { getDocs, collection } from "firebase/firestore";

import { getDatabase, ref, onValue } from 'firebase/database'

function FiltroMulti({ firebaseApp, onFilterChange }) {
  const [selectedDisciplinas, setSelectedDisciplinas] = useState([]);
  const [selectedAssuntos, setSelectedAssuntos] = useState([]);
  const [assuntoOptions, setAssuntoOptions] = useState([]);
  const [selectedBancas, setSelectedBancas] = useState([]);
  const [selectedModalidades, setSelectedModalidades] = useState([]);
  const [selectedAnos, setSelectedAnos] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [filteredQuestoes, setFilteredQuestoes] = useState([]);
  const [keywords, setKeywords] = useState("");
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    const questionsRef = ref(getDatabase(firebaseApp), 'discursivas');

    const fetchData = () => {
      onValue(questionsRef, (snapshot) => {
        const questionData = snapshot.val();

        if (questionData) {
          const questionArray = Object.keys(questionData).map((key) => ({
            id: key,
            ...questionData[key],
          }));

          setQuestions(questionArray);
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


  const handleFilterClick = () => {
    const filteredQuestoes = questions
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
  
        const keywordsMatch =
          keywords.trim() === "" ||
          item.enunciado.toLowerCase().includes(keywords.toLowerCase());
  
        return (
          disciplinaMatch &&
          assuntoMatch &&
          bancaMatch &&
          modalidadeMatch &&
          areaMatch &&
          anoMatch &&
          keywordsMatch
        );
      });
  
    setFilteredQuestoes(filteredQuestoes);
    onFilterChange(filteredQuestoes);
  };
  

  return (
    <div className="filter-container">
      <Box  className="div-filter2">
        <TextField  
          type="text"
          className="filter-input"
          placeholder="Filtrar por palavra-chave"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          size="small"

        />
      </Box>

      <div className="div-filter">
        <Select
          className="filter-select"
          value={selectedDisciplinas}
          onChange={handleDisciplinasChange}
          options={disciplinaOptions}
          isMulti={true}
          placeholder="Disciplina"
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
        />
      </div>
      <div className="div-filter">
        <Select
          className="filter-select"
          value={selectedBancas}
          onChange={(selectedOptions) => setSelectedBancas(selectedOptions)}
          options={bancaOptions}
          isMulti={true}
          placeholder="Banca"
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
        />
      </div>

      <div className="div-filter">
        <Select
          className="filter-select"
          value={selectedAnos}
          onChange={(selectedOptions) => setSelectedAnos(selectedOptions)}
          options={anoOptions}
          isMulti={true}
          placeholder="Ano"
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
        />
      </div>
      <div>
        <div className="div-button">
          <button className="filter-button" onClick={handleFilterClick}>
            Filtrar Questões
          </button>
        </div>
      </div>
    </div>
  );
}




export default FiltroMulti;

