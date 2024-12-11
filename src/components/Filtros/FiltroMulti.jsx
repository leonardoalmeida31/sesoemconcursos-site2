/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./FiltroMulti.css";
import TextField from "@mui/material/TextField";
import { Grid, Typography } from "@mui/material";
import { getDatabase, ref, onValue } from 'firebase/database'
import { components } from 'react-select';


function FiltroMulti({ firebaseApp, onFilterChange, setPaginaAtual }) {
  const [selectedDisciplinas, setSelectedDisciplinas] = useState([]);
  const [selectedAssuntos, setSelectedAssuntos] = useState([]);
  const [assuntoOptions, setAssuntoOptions] = useState([]);
  const [selectedBancas, setSelectedBancas] = useState([]);
  const [selectedModalidades, setSelectedModalidades] = useState([]);
  const [selectedAnos, setSelectedAnos] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [selectedConcursos, setSelectedConcursos] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const [questions, setQuestions] = useState([]);
  const [filteredQuestoes, setFilteredQuestoes] = useState([]);
  const [keywords, setKeywords] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(0); // Novo estado para armazenar o número total de questões


  // Estado para controlar os IDs carregados progressivamente
  const [displayedIds, setDisplayedIds] = useState([]);
  const [batchSize, setBatchSize] = useState(20); // Quantidade inicial de IDs carregados
  const [hasMore, setHasMore] = useState(true); // Controle de mais itens para carregar

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
  const idsQuestoes = Array.from(new Set(questions.map((item) => item.ids)));
  const idsOptions = idsQuestoes.map((ids) => ({
    value: ids,
    label: ids,
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
        const idsMatch =
          selectedIds.length === 0 || selectedIds.some(
            (selected) => selected.label === item.ids
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
          idsMatch &&
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
  const sortedIdsOptions = idsOptions.sort((a, b) => Number(a.value) - Number(b.value));

  const sortedDisciplinaOptions = disciplinaOptions.slice().sort((a, b) => a.label.localeCompare(b.label));
  const sortedAnoOptions = anoOptions.slice().sort((a, b) => b.label - a.label);

  // Função para carregar mais IDs quando o usuário rolar
  const loadMoreIds = () => {
    if (displayedIds.length >= idsOptions.length) {
      setHasMore(false);
      return;
    }
    const nextBatch = idsOptions.slice(displayedIds.length, displayedIds.length + batchSize);
    setDisplayedIds([...displayedIds, ...nextBatch]);
  };

  useEffect(() => {
    // Carrega os primeiros IDs ao montar o componente
    loadMoreIds();
  }, []);

  // Custom component para detectar scroll e carregar mais IDs
  const MenuList = (props) => {
    const onScroll = (event) => {
      const bottom = event.target.scrollHeight === event.target.scrollTop + event.target.clientHeight;
      if (bottom && hasMore) {
        loadMoreIds();
      }
    };

    return (
      <components.MenuList {...props} onScroll={onScroll}>
        {props.children}
      </components.MenuList>
    );
  };


  return (
    <Grid maxWidth='xl' container spacing={2} sx={{ display: 'flex', flexWrap: 'wrap', padding: '1.5em', backgroundColor: '#F8F8F8', marginTop: '0.5em', borderRadius: '10px', justifyContent: 'flex-end' }}>
      <Grid item xs={12} sm={6} md={4} lg={3.92} sx={{ marginRight: '0.2em' }}>
        <TextField
          type="text"
          className="filter-input"
          placeholder="Filtrar por palavra-chave..."
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          size="small"
          InputProps={{ style: { fontSize: '0.885em', color: 'black' } }}
          fullWidth
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={4}>
        <Select
          className="filter-select"
          value={selectedDisciplinas}
          onChange={handleDisciplinasChange}
          options={sortedDisciplinaOptions}
          isMulti
          placeholder="Disciplina"
          styles={{
            placeholder: (provided) => ({
              ...provided,
              fontFamily: 'Poppins',
              fontSize: '1.5vh',
              color: '#888'  // Cor do placeholder
            }),
            singleValue: (provided) => ({
              ...provided,
              fontFamily: 'Poppins',
              fontSize: '1.5vh'
            }),
            multiValue: (provided) => ({
              ...provided,
              fontFamily: 'Poppins',
              fontSize: '1.5vh'
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isFocused ? "#1C5253" : "white",
              color: state.isFocused ? "white" : "black",
              fontFamily: 'Poppins',
              fontSize: '1.5vh'
            })
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={4}>
        <Select
          className="filter-select"
          value={selectedAssuntos}
          onChange={handleAssuntosChange}
          options={assuntoOptions}
          isMulti
          placeholder="Assunto"
          isDisabled={selectedDisciplinas.length === 0}
          styles={{
            placeholder: (provided) => ({
              ...provided,
              fontFamily: 'Poppins',
              fontSize: '1.5vh',
              color: '#888'
            }),
            singleValue: (provided) => ({
              ...provided,
              fontFamily: 'Poppins',
              fontSize: '1.5vh'
            }),
            multiValue: (provided) => ({
              ...provided,
              fontFamily: 'Poppins',
              fontSize: '1.5vh'
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isFocused ? "#1C5253" : "white",
              color: state.isFocused ? "white" : "black",
              fontFamily: 'Poppins',
              fontSize: '1.5vh'
            })
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={4}>
        <Select
          className="filter-select"
          value={selectedBancas}
          onChange={(selectedOptions) => setSelectedBancas(selectedOptions)}
          options={sortedBancaOptions}
          isMulti
          placeholder="Banca"
          styles={{
            placeholder: (provided) => ({
              ...provided,
              fontFamily: 'Poppins',
              fontSize: '1.5vh',
              color: '#888'  // Cor do placeholder
            }),
            singleValue: (provided) => ({
              ...provided,
              fontFamily: 'Poppins',
              fontSize: '1.5vh'
            }),
            multiValue: (provided) => ({
              ...provided,
              fontFamily: 'Poppins',
              fontSize: '1.5vh'
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isFocused ? "#1C5253" : "white",
              color: state.isFocused ? "white" : "black",
              fontFamily: 'Poppins',
              fontSize: '1.5vh'
            })
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={4}>
        <Select
          className="filter-select"
          value={selectedModalidades}
          onChange={(selectedOptions) => setSelectedModalidades(selectedOptions)}
          options={modalidadeOptions}
          isMulti
          placeholder="Modalidade"
          styles={{
            placeholder: (provided) => ({
              ...provided,
              fontFamily: 'Poppins',
              fontSize: '1.5vh',
              color: '#888'  // Cor do placeholder
            }),
            singleValue: (provided) => ({
              ...provided,
              fontFamily: 'Poppins',
              fontSize: '1.5vh'
            }),
            multiValue: (provided) => ({
              ...provided,
              fontFamily: 'Poppins',
              fontSize: '1.5vh'
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isFocused ? "#1C5253" : "white",
              color: state.isFocused ? "white" : "black",
              fontFamily: 'Poppins',
              fontSize: '1.5vh'
            })
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={4}>
        <Select
          className="filter-select"
          value={selectedAnos}
          onChange={(selectedOptions) => setSelectedAnos(selectedOptions)}
          options={sortedAnoOptions}
          isMulti
          placeholder="Ano"
          styles={{
            placeholder: (provided) => ({
              ...provided,
              fontFamily: 'Poppins',
              fontSize: '1.5vh',
              color: '#888'  // Cor do placeholder
            }),
            singleValue: (provided) => ({
              ...provided,
              fontFamily: 'Poppins',
              fontSize: '1.5vh'
            }),
            multiValue: (provided) => ({
              ...provided,
              fontFamily: 'Poppins',
              fontSize: '1.5vh'
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isFocused ? "#1C5253" : "white",
              color: state.isFocused ? "white" : "black",
              fontFamily: 'Poppins',
              fontSize: '1.5vh'
            })
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={4}>
        <Select
          className="filter-select"
          value={selectedAreas}
          onChange={(selectedOptions) => setSelectedAreas(selectedOptions)}
          options={areaOptions}
          isMulti
          placeholder="Área"
          styles={{
            placeholder: (provided) => ({
              ...provided,
              fontFamily: 'Poppins',
              fontSize: '1.5vh',
              color: '#888'  // Cor do placeholder
            }),
            singleValue: (provided) => ({
              ...provided,
              fontFamily: 'Poppins',
              fontSize: '1.5vh'
            }),
            multiValue: (provided) => ({
              ...provided,
              fontFamily: 'Poppins',
              fontSize: '1.5vh'
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isFocused ? "#1C5253" : "white",
              color: state.isFocused ? "white" : "black",
              fontFamily: 'Poppins',
              fontSize: '1.5vh'
            })
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={4}>
        <Select
          className="filter-select"
          value={selectedConcursos}
          onChange={(selectedOptions) => setSelectedConcursos(selectedOptions)}
          options={sortedConcursoOptions}
          isMulti
          placeholder="Instituição"
          styles={{
            placeholder: (provided) => ({
              ...provided,
              fontFamily: 'Poppins',
              fontSize: '1.5vh',
              color: '#888'  // Cor do placeholder
            }),
            singleValue: (provided) => ({
              ...provided,
              fontFamily: 'Poppins',
              fontSize: '1.5vh'
            }),
            multiValue: (provided) => ({
              ...provided,
              fontFamily: 'Poppins',
              fontSize: '1.5vh'
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isFocused ? "#1C5253" : "white",
              color: state.isFocused ? "white" : "black",
              fontFamily: 'Poppins',
              fontSize: '1.5vh'
            })
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={4}>
        <Select
          className="filter-select"
          value={selectedIds}
          onChange={(selectedOptions) => setSelectedIds(selectedOptions)}
          options={sortedIdsOptions}
          isMulti
          placeholder="Número ID"
          styles={{
            placeholder: (provided) => ({
              ...provided,
              fontFamily: 'Poppins',
              fontSize: '1.5vh',
              color: '#888'  // Cor do placeholder
            }),
            singleValue: (provided) => ({
              ...provided,
              fontFamily: 'Poppins',
              fontSize: '1.5vh'
            }),
            multiValue: (provided) => ({
              ...provided,
              fontFamily: 'Poppins',
              fontSize: '1.5vh'
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isFocused ? "#1C5253" : "white",
              color: state.isFocused ? "white" : "black",
              fontFamily: 'Poppins',
              fontSize: '1.5vh'
            })
          }}
        />
      </Grid>

      <Grid item xs={2} sm={2} md={2} lg={2} sx={{ display: 'flex', justifyContent: 'right', }}>
        <button className="filter-button" onClick={() => handleFilterClick(questions)}>
          Filtrar Questões
        </button>
      </Grid>

      <Grid item xs={12} sm={12} md={12} lg={3} sx={{ textAlign: 'center', marginTop: '1em' }}>
        <Typography sx={{ fontFamily: 'Poppins', fontSize: '0.9em', fontWeight: '400', backgroundColor: 'white', color: 'black', padding: '0.500em', borderRadius: '5px', marginBottom: '0.300em' }}>
          {`${totalQuestions.toLocaleString()} Questões no Site`}
        </Typography>

        <Typography sx={{ fontFamily: 'Poppins', fontSize: '0.9em', fontWeight: '500', backgroundColor: 'white', color: 'black', padding: '0.500em', borderRadius: '5px' }}>
          {`${filteredQuestoes.length.toLocaleString()} Questões filtradas`}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default FiltroMulti;
