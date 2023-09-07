import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./FiltroMulti.css";

import { getDocs, collection } from "firebase/firestore";

function FiltroMulti({ db, onFilterChange}) {
  const [selectedDisciplinas, setSelectedDisciplinas] = useState([]);
  const [selectedAssuntos, setSelectedAssuntos] = useState([]);
  const [assuntoOptions, setAssuntoOptions] = useState([]);
  const [selectedBancas, setSelectedBancas] = useState([]);
  const [selectedModalidades, setSelectedModalidades] = useState([]);
  const [selectedAnos, setSelectedAnos] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [filteredQuestoes, setFilteredQuestoes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "questions"));
        const questionsData = querySnapshot.docs.map((doc) => doc.data());
        setQuestions(questionsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [db]);

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

        return (
          disciplinaMatch &&
          assuntoMatch &&
          bancaMatch &&
          modalidadeMatch &&
          anoMatch
        );
      });

    setFilteredQuestoes(filteredQuestoes); // Alterada para usar setFilteredQuestoes
    onFilterChange(filteredQuestoes);
  };

  return (
    <div className="filter-container">
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
      <div>
        <div>
          <button className="filter-button" onClick={handleFilterClick}>
            Filtrar Questões
          </button>
        </div>
      </div>
    </div>
  );
}




export default FiltroMulti;

