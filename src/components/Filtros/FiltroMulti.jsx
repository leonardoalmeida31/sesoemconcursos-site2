import React, { useState, useEffect } from "react";
import "./FiltroMulti.css";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Grid, Typography, Box, Paper, Tooltip, Chip } from "@mui/material";
import { getDatabase, ref, onValue } from 'firebase/database';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import FilterListIcon from '@mui/icons-material/FilterList';
import InputAdornment from '@mui/material/InputAdornment';

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
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const questionsRef = ref(getDatabase(firebaseApp), 'questions');
    setIsLoading(true);

    const fetchData = () => {
      onValue(questionsRef, (snapshot) => {
        const questionData = snapshot.val();

        if (questionData) {
          const questionArray = Object.keys(questionData).map((key) => ({
            id: key,
            ...questionData[key],
          }));

          setQuestions(questionArray);
          setTotalQuestions(questionArray.length);
          handleFilterClick(questionArray);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      });
    };

    fetchData();
  }, [firebaseApp]);

  const handleDisciplinasChange = (event, newValue) => {
    const selectedValues = newValue.map((option) => option.value);
    setSelectedDisciplinas(newValue);

    const filteredAssuntos = Array.from(
      new Set(
        questions
          .filter((item) => selectedValues.includes(item.disciplina))
          .map((item) => item.assunto)
      )
    );

    setAssuntoOptions(filteredAssuntos.map((assunto) => ({
      value: assunto,
      label: assunto,
    })));
    setSelectedAssuntos([]);
  };

  const handleAssuntosChange = (event, newValue) => {
    setSelectedAssuntos(newValue);
  };

  const handleBancasChange = (event, newValue) => {
    setSelectedBancas(newValue);
  };

  const handleModalidadesChange = (event, newValue) => {
    setSelectedModalidades(newValue);
  };

  const handleAnosChange = (event, newValue) => {
    setSelectedAnos(newValue);
  };

  const handleAreasChange = (event, newValue) => {
    setSelectedAreas(newValue);
  };

  const handleConcursosChange = (event, newValue) => {
    setSelectedConcursos(newValue);
  };

  const handleIdsChange = (event, newValue) => {
    setSelectedIds(newValue);
  };

  const handleDeleteChip = (item, filterType) => {
    switch (filterType) {
      case 'disciplina':
        const newDisciplinas = selectedDisciplinas.filter(selected => selected.value !== item.value);
        setSelectedDisciplinas(newDisciplinas);
        const filteredAssuntos = Array.from(
          new Set(
            questions
              .filter((q) => newDisciplinas.some((selected) => selected.value === q.disciplina))
              .map((q) => q.assunto)
          )
        );
        setAssuntoOptions(filteredAssuntos.map((assunto) => ({ value: assunto, label: assunto })));
        setSelectedAssuntos([]);
        break;
      case 'assunto':
        setSelectedAssuntos(selectedAssuntos.filter(selected => selected.value !== item.value));
        break;
      case 'banca':
        setSelectedBancas(selectedBancas.filter(selected => selected.value !== item.value));
        break;
      case 'modalidade':
        setSelectedModalidades(selectedModalidades.filter(selected => selected.value !== item.value));
        break;
      case 'ano':
        setSelectedAnos(selectedAnos.filter(selected => selected.value !== item.value));
        break;
      case 'area':
        setSelectedAreas(selectedAreas.filter(selected => selected.value !== item.value));
        break;
      case 'concurso':
        setSelectedConcursos(selectedConcursos.filter(selected => selected.value !== item.value));
        break;
      case 'ids':
        setSelectedIds(selectedIds.filter(selected => selected.value !== item.value));
        break;
      default:
        break;
    }
  };

  const handleClearFilters = () => {
    setSelectedDisciplinas([]);
    setSelectedAssuntos([]);
    setSelectedBancas([]);
    setSelectedModalidades([]);
    setSelectedAnos([]);
    setSelectedAreas([]);
    setSelectedConcursos([]);
    setSelectedIds([]);
    setKeywords("");
    handleFilterClick(questions);
  };

  const uniqueDisciplinas = Array.from(new Set(questions.map((item) => item.disciplina)));
  const disciplinaOptions = uniqueDisciplinas.map((disciplina) => ({ value: disciplina, label: disciplina }));

  const uniqueBancas = Array.from(new Set(questions.map((item) => item.banca)));
  const bancaOptions = uniqueBancas.map((banca) => ({ value: banca, label: banca }));

  const uniqueModalidades = Array.from(new Set(questions.map((item) => item.modalidade)));
  const modalidadeOptions = uniqueModalidades.map((modalidade) => ({ value: modalidade, label: modalidade }));

  const uniqueAnos = Array.from(new Set(questions.map((item) => item.ano)));
  const anoOptions = uniqueAnos.map((ano) => ({ value: ano, label: ano }));

  const uniqueAreas = Array.from(new Set(questions.map((item) => item.area)));
  const areaOptions = uniqueAreas.map((area) => ({ value: area, label: area }));

  const uniqueConcursos = Array.from(new Set(questions.map((item) => item.concurso)));
  const concursoOptions = uniqueConcursos.map((concurso) => ({ value: concurso, label: concurso }));

  const idsQuestoes = Array.from(new Set(questions.map((item) => item.ids)));
  const idsOptions = idsQuestoes.map((ids) => ({ value: ids, label: ids }));

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
          selectedAnos.length === 0 ||
          selectedAnos.some((selected) => selected.value === item.ano);
        const areaMatch =
          selectedAreas.length === 0 ||
          selectedAreas.some((selected) => selected.value === item.area);
        const concursoMatch =
          selectedConcursos.length === 0 ||
          selectedConcursos.some((selected) => selected.value === item.concurso);
        const idsMatch =
          selectedIds.length === 0 ||
          selectedIds.some((selected) => selected.value === item.ids);

        const keywordsMatch =
          keywords.trim() === "" ||
          item.enunciado.toLowerCase().includes(keywords.toLowerCase()) ||
          item.ids.toString().includes(keywords);

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
      });

    setFilteredQuestoes(filteredQuestoes);
    onFilterChange(filteredQuestoes);
    setPaginaAtual(1);
  };

  const sortedBancaOptions = bancaOptions.slice().sort((a, b) => a.label.localeCompare(b.label));
  const sortedConcursoOptions = concursoOptions.slice().sort((a, b) => a.label.localeCompare(b.label));
  const sortedIdsOptions = idsOptions.sort((a, b) => Number(a.value) - Number(b.value));
  const sortedDisciplinaOptions = disciplinaOptions.slice().sort((a, b) => a.label.localeCompare(b.label));
  const sortedAnoOptions = anoOptions.slice().sort((a, b) => b.label - a.label);

  const renderSearchField = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <TextField 
        label="Filtrar por palavra-chave"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        size="small"
        fullWidth
        className="filter-input"
        InputProps={{
          style: { fontSize: '0.975rem', color: 'black',  },
          startAdornment: (

            <InputAdornment position="start"  sx={{padding: '1.68em'}}>
              <SearchIcon sx={{ color: '#94a3b8', }} />
            </InputAdornment>
          ),
        }}
        InputLabelProps={{
          style: { fontFamily: 'Poppins, sans-serif', fontSize: '0.875rem', color: '#94a3b8' },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '0.875rem',
            '&.Mui-focused fieldset': {
              borderColor: '#267c7e',
              boxShadow: '0 0 0 2px rgba(38, 124, 126, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: '#cbd5e0',
            },
          },
          '& .MuiInputLabel-root': {
            fontFamily: 'Poppins, sans-serif',
            fontSize: '0.875rem',
            color: '#94a3b8',
            '&.Mui-focused': {
              color: '#267c7e',
            },
          },
        }}
      /> 
    </Box>
  );

  const renderSelectFilter = ({
    value,
    onChange,
    options,
    placeholder,
    isDisabled = false,
    tooltip = ""
  }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Tooltip title={tooltip} arrow placement="top">
        <Autocomplete
          multiple
          value={value}
          onChange={onChange}
          options={options}
          getOptionLabel={(option) => option.label}
          disableCloseOnSelect
          disabled={isDisabled}
          renderInput={(params) => (
            <TextField
              {...params}
              label={placeholder}
              variant="outlined"
              className="filter-select"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '0.875rem',
                  '& .MuiAutocomplete-input': {
                    padding: '8px',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#267c7e',
                    boxShadow: '0 0 0 2px rgba(38, 124, 126, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#cbd5e0',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '0.875rem',
                  color: '#94a3b8',
                  '&.Mui-focused': {
                    color: '#267c7e',
                  },
                },
              }}
            />
          )}
          renderOption={(props, option) => (
            <li {...props} style={{ whiteSpace: 'normal', wordWrap: 'break-word', padding: '10px 12px' }}>
              {option.label}
            </li>
          )}
          ListboxProps={{
            sx: {
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              maxHeight: '300px',
              '& .MuiAutocomplete-option': {
                fontFamily: 'Poppins, sans-serif',
                fontSize: '0.875rem',
                whiteSpace: 'normal',
                wordWrap: 'break-word',
                '&:hover': {
                  backgroundColor: '#1C5253',
                  color: 'white',
                },
                '&[aria-selected="true"]': {
                  backgroundColor: '#e6f7f8',
                  color: '#1c5253',
                },
              },
            },
          }}
          renderTags={() => null} // Oculta chips dentro do Autocomplete
        />
      </Tooltip>
    </Box>
  );

  const AllChipsContainer = () => {
    const allSelected = [
      ...selectedDisciplinas.map(item => ({ ...item, type: 'disciplina', prefix: 'Disciplina:' })),
      ...selectedAssuntos.map(item => ({ ...item, type: 'assunto', prefix: 'Assunto:' })),
      ...selectedBancas.map(item => ({ ...item, type: 'banca', prefix: 'Banca:' })),
      ...selectedModalidades.map(item => ({ ...item, type: 'modalidade', prefix: 'Modalidade:' })),
      ...selectedAnos.map(item => ({ ...item, type: 'ano', prefix: 'Ano:' })),
      ...selectedAreas.map(item => ({ ...item, type: 'area', prefix: 'Área:' })),
      ...selectedConcursos.map(item => ({ ...item, type: 'concurso', prefix: 'Instituição:' })),
      ...selectedIds.map(item => ({ ...item, type: 'ids', prefix: 'Número ID:' })),
    ];

    if (allSelected.length === 0) return null;

    return (
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginTop: '12px',
          marginBottom: '12px',
          padding: '10px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}
      >
        <Box>
          <Typography>Filtrar Por:</Typography>
        </Box>
        {allSelected.map((item) => (
          <Chip
            key={`${item.type}-${item.value}`}
            label={`${item.prefix} ${item.label}`}
            onDelete={() => handleDeleteChip(item, item.type)}
            size="small"
            sx={{
              backgroundColor: '#e6f7f8',
              color: '#1c5253',
              fontSize: '0.85rem',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 500,
              whiteSpace: 'normal',
              wordWrap: 'break-word',
              '& .MuiChip-deleteIcon': {
                color: '#1c5253',
                '&:hover': {
                  color: '#ff5252',
                },
              },
            }}
          />
        ))}
      </Box>
    );
  };

  return (
    <Paper
      elevation={2}
      sx={{
        maxWidth: 'xl',
        padding: { xs: '1rem', md: '1.5rem' },
        backgroundColor: '#ffffff',
        marginTop: '1rem',
        borderRadius: '12px',
        marginBottom: '2rem'
      }}
    >
      <Box sx={{ marginBottom: '1rem' }}>
        <Typography variant="h6" sx={{
          display: 'flex',
          alignItems: 'center',
          fontFamily: 'Poppins, sans-serif',
          color: '#1c5253',
          fontWeight: 600,
          fontSize: '1.1rem',
        }}>
          <FilterListIcon sx={{ marginRight: '8px' }} />
          Filtrar questões
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          {renderSearchField()}
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4.5}>
          {renderSelectFilter({
            value: selectedDisciplinas,
            onChange: handleDisciplinasChange,
            options: sortedDisciplinaOptions,
            placeholder: "Disciplina",
            tooltip: "Selecione uma ou mais disciplinas"
          })}
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4.5}>
          {renderSelectFilter({
            value: selectedAssuntos,
            onChange: handleAssuntosChange,
            options: assuntoOptions,
            placeholder: "Assunto",
            isDisabled: selectedDisciplinas.length === 0,
            tooltip: selectedDisciplinas.length === 0 ? "Selecione uma disciplina primeiro" : "Selecione um ou mais assuntos"
          })}
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          {renderSelectFilter({
            value: selectedBancas,
            onChange: handleBancasChange,
            options: sortedBancaOptions,
            placeholder: "Banca",
            tooltip: "Selecione uma ou mais bancas"
          })}
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          {renderSelectFilter({
            value: selectedAnos,
            onChange: handleAnosChange,
            options: sortedAnoOptions,
            placeholder: "Ano",
            tooltip: "Selecione um ou mais anos"
          })}
        </Grid>
        
        <Grid item xs={12} sm={6} md={4} lg={3}>
          {renderSelectFilter({
            value: selectedModalidades,
            onChange: handleModalidadesChange,
            options: modalidadeOptions,
            placeholder: "Modalidade",
            tooltip: "Selecione uma ou mais modalidades"
          })}
        </Grid>

     

        <Grid item xs={12} sm={6} md={4} lg={3}>
          {renderSelectFilter({
            value: selectedAreas,
            onChange: handleAreasChange,
            options: areaOptions,
            placeholder: "Área",
            tooltip: "Selecione uma ou mais áreas"
          })}
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4}>
          {renderSelectFilter({
            value: selectedConcursos,
            onChange: handleConcursosChange,
            options: sortedConcursoOptions,
            placeholder: "Instituição",
            tooltip: "Selecione uma ou mais instituições"
          })}
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2}>
          {renderSelectFilter({
            value: selectedIds,
            onChange: handleIdsChange,
            options: sortedIdsOptions,
            placeholder: "Número ID",
            tooltip: "Selecione um ou mais IDs"
          })}
        </Grid>

        <Grid item xs={12}>
          <AllChipsContainer />
        </Grid>

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' }, gap: '12px', marginTop: '1rem' }}>
          <button className="filter-button" onClick={() => handleFilterClick(questions)}>
            <FilterAltIcon fontSize="small" />
            Filtrar Questões
          </button>
          <button className="clear-button" onClick={handleClearFilters}>
            <ClearIcon fontSize="small" />
            Limpar Filtros
          </button>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '8px',
            marginTop: '1rem'
          }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 16px',
              borderRadius: '8px',
              backgroundColor: '#f8f9fa',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              width: '100%'
            }}>
              <LibraryBooksIcon sx={{ color: '#1c5253', marginRight: '8px' }} />
              <Typography variant="body2" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                Total de <strong style={{ color: '#1c5253' }}>{totalQuestions.toLocaleString()}</strong> questões disponíveis
              </Typography>
            </Box>

            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 16px',
              borderRadius: '8px',
              backgroundColor: '#e6f7f8',
              borderLeft: '3px solid #1c5253',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              width: '100%'
            }}>
              <FilterAltIcon sx={{ color: '#1c5253', marginRight: '8px' }} />
              <Typography variant="body2" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                <strong style={{ color: '#1c5253' }}>{filteredQuestoes.length.toLocaleString()}</strong> questões filtradas
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default FiltroMulti;