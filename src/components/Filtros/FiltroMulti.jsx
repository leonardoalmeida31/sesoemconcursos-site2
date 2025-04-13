import React, { useState, useEffect } from "react";
import "./FiltroMulti.css";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Grid, Typography, Box, Paper, Tooltip, Chip, Snackbar, Alert } from "@mui/material"; // Adicionado Snackbar e Alert
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Adicionado para autenticação
import { getFirestore, collection, addDoc, serverTimestamp, onSnapshot, deleteDoc, doc } from 'firebase/firestore'; // Adicionado para Firestore
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import FilterListIcon from '@mui/icons-material/FilterList';
import SaveIcon from '@mui/icons-material/Save'; // Ícone para o botão de salvar
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityIcon from '@mui/icons-material/Visibility';

// No início da função FiltroMulti, adicione novos estados
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
  const [user, setUser] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [savedFilters, setSavedFilters] = useState([]);
  const [openSavedFiltersDialog, setOpenSavedFiltersDialog] = useState(false);
  const [openNameFilterDialog, setOpenNameFilterDialog] = useState(false);
  const [filterName, setFilterName] = useState("");

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        console.log("UID do usuário logado:", currentUser.uid); // Log para depuração
      } else {
        console.log("Nenhum usuário logado.");
      }
    });
    return () => unsubscribe();
  }, [firebaseApp]);

  // Dentro da função FiltroMulti, logo após o useEffect existente que verifica o usuário logado
  useEffect(() => {
    if (!user) return;

    const db = getFirestore(firebaseApp);
    const filtersRef = collection(db, `users/${user.uid}/savedFilters`);

    const unsubscribe = onSnapshot(filtersRef, (snapshot) => {
      const filtersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSavedFilters(filtersData);
    }, (error) => {
      console.error("Erro ao buscar filtros salvos:", error);
      setSnackbarMessage("Erro ao carregar filtros salvos.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    });

    return () => unsubscribe();
  }, [user, firebaseApp]);

  // Dentro da função FiltroMulti, antes do return
  const applySavedFilter = (filter) => {
    // Atualizar os estados dos filtros com base no filtro salvo
    setSelectedDisciplinas(
      (filter.disciplinas || []).map((value) => ({ value, label: value }))
    );

    // Atualizar assuntos e opções de assuntos
    const filteredAssuntos = Array.from(
      new Set(
        questions
          .filter((item) => (filter.disciplinas || []).includes(item.disciplina))
          .map((item) => item.assunto)
      )
    );
    setAssuntoOptions(filteredAssuntos.map((assunto) => ({ value: assunto, label: assunto })));
    setSelectedAssuntos(
      (filter.assuntos || []).map((value) => ({ value, label: value }))
    );

    setSelectedBancas(
      (filter.bancas || []).map((value) => ({ value, label: value }))
    );
    setSelectedModalidades(
      (filter.modalidades || []).map((value) => ({ value, label: value }))
    );
    setSelectedAnos(
      (filter.anos || []).map((value) => ({ value, label: value }))
    );
    setSelectedAreas(
      (filter.areas || []).map((value) => ({ value, label: value }))
    );
    setSelectedConcursos(
      (filter.concursos || []).map((value) => ({ value, label: value }))
    );
    setSelectedIds(
      (filter.ids || []).map((value) => ({ value, label: value }))
    );
    setKeywords(filter.keywords || "");

    // Reaplicar a filtragem com os novos valores
    const filteredQuestoes = questions.filter((item) => {
      const disciplinaMatch =
        (filter.disciplinas || []).length === 0 || (filter.disciplinas || []).includes(item.disciplina);
      const assuntoMatch =
        (filter.assuntos || []).length === 0 || (filter.assuntos || []).includes(item.assunto);
      const bancaMatch =
        (filter.bancas || []).length === 0 || (filter.bancas || []).includes(item.banca);
      const modalidadeMatch =
        (filter.modalidades || []).length === 0 || (filter.modalidades || []).includes(item.modalidade);
      const anoMatch =
        (filter.anos || []).length === 0 || (filter.anos || []).includes(item.ano);
      const areaMatch =
        (filter.areas || []).length === 0 || (filter.areas || []).includes(item.area);
      const concursoMatch =
        (filter.concursos || []).length === 0 || (filter.concursos || []).includes(item.concurso);
      const idsMatch =
        (filter.ids || []).length === 0 || (filter.ids || []).includes(item.ids);
      const keywordsMatch =
        (filter.keywords || "").trim() === "" ||
        item.enunciado.toLowerCase().includes((filter.keywords || "").toLowerCase()) ||
        item.ids.toString().includes(filter.keywords || "");

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

    // Fechar o modal
    setOpenSavedFiltersDialog(false);

    // Mostrar mensagem de sucesso
    setSnackbarMessage(`Filtro "${filter.name || filter.id}" aplicado com sucesso!`);
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };


  const saveFilterWithName = async () => {
    if (!user) {
      setSnackbarMessage("Você precisa estar logado para salvar os filtros.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    if (
      selectedDisciplinas.length === 0 &&
      selectedAssuntos.length === 0 &&
      selectedBancas.length === 0 &&
      selectedModalidades.length === 0 &&
      selectedAnos.length === 0 &&
      selectedAreas.length === 0 &&
      selectedConcursos.length === 0 &&
      selectedIds.length === 0 &&
      keywords.trim() === ""
    ) {
      setSnackbarMessage("Nenhum filtro selecionado para salvar.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    try {
      const db = getFirestore(firebaseApp);
      const filters = {
        name: filterName.trim(), // Adiciona o nome do filtro
        disciplinas: selectedDisciplinas.map((item) => item.value),
        assuntos: selectedAssuntos.map((item) => item.value),
        bancas: selectedBancas.map((item) => item.value),
        modalidades: selectedModalidades.map((item) => item.value),
        anos: selectedAnos.map((item) => item.value),
        areas: selectedAreas.map((item) => item.value),
        concursos: selectedConcursos.map((item) => item.value),
        ids: selectedIds.map((item) => item.value),
        keywords: keywords.trim(),
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, `users/${user.uid}/savedFilters`), filters);
      setSnackbarMessage(`Filtro "${filterName.trim()}" salvo com sucesso!`);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Erro ao salvar filtros:", error);
      setSnackbarMessage(`Erro ao salvar o filtro: ${error.message}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSaveFilters = () => {
    setOpenNameFilterDialog(true); // Abre o diálogo para nomear o filtro
  };

  // Função para fechar o Snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };



  const handleDeleteFilter = async (filterId) => {
    if (!user) {
      setSnackbarMessage("Você precisa estar logado para excluir filtros.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      const db = getFirestore(firebaseApp);
      await deleteDoc(doc(db, `users/${user.uid}/savedFilters`, filterId));
      setSnackbarMessage("Filtro excluído com sucesso!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Erro ao excluir filtro:", error);
      setSnackbarMessage(`Erro ao excluir o filtro: ${error.message}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };



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
          style: { fontSize: '0.975rem', color: 'black', },
          startAdornment: (

            <InputAdornment position="start" sx={{ padding: '1.68em' }}>
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

        <Grid item xs={12}>
          <Grid
            container
            spacing={2}
            sx={{
              justifyContent: { xs: 'center', md: 'flex-end' },
              marginTop: '1rem',
            }}
          >
            <Grid item xs={6} md={3} lg={2}>
              <Button
                variant="contained"
                startIcon={<FilterAltIcon fontSize="small" />}
                onClick={() => handleFilterClick(questions)}
                fullWidth
                sx={{
                  fontFamily: 'Poppins, sans-serif',
                  backgroundColor: '#1c5253',
                  '&:hover': { backgroundColor: '#267c7e' },
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  padding: '8px 16px',
                  height: '48px', // Altura fixa para todos os botões
                  whiteSpace: 'normal', // Permite quebra de texto
                  lineHeight: '1.2', // Controla o espaçamento entre linhas
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Filtrar Questões
              </Button>
            </Grid>
            <Grid item xs={6} md={3} lg={2}>
              <Button
                variant="outlined"
                startIcon={<ClearIcon fontSize="small" />}
                onClick={handleClearFilters}
                fullWidth
                sx={{
                  fontFamily: 'Poppins, sans-serif',
                  borderColor: '#ff5252',
                  color: '#ff5252',
                  '&:hover': { borderColor: '#e63946', color: '#e63946' },
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  padding: '8px 16px',
                  height: '48px', // Altura fixa
                  whiteSpace: 'normal',
                  lineHeight: '1.2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Limpar Filtros
              </Button>
            </Grid>
            <Grid item xs={6} md={3} lg={2}>
              <Button
                variant="contained"
                startIcon={<SaveIcon fontSize="small" />}
                onClick={handleSaveFilters}
                fullWidth
                sx={{
                  fontFamily: 'Poppins, sans-serif',
                  backgroundColor: '#1c5253',
                  '&:hover': { backgroundColor: '#267c7e' },
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  padding: '8px 16px',
                  height: '48px', // Altura fixa
                  whiteSpace: 'normal',
                  lineHeight: '1.2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Salvar Filtros
              </Button>
            </Grid>
            <Grid item xs={6} md={3} lg={2}>
              <Button
                variant="contained"
                startIcon={<VisibilityIcon fontSize="small" />}
                onClick={() => setOpenSavedFiltersDialog(true)}
                disabled={!user}
                fullWidth
                sx={{
                  fontFamily: 'Poppins, sans-serif',
                  backgroundColor: '#1c5253',
                  '&:hover': { backgroundColor: '#267c7e' },
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  padding: '8px 16px',
                  height: '48px', // Altura fixa
                  whiteSpace: 'normal',
                  lineHeight: '1.2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&.Mui-disabled': {
                    backgroundColor: '#b0bec5',
                    color: '#ffffff',
                  },
                }}
              >
                Carregar Filtros
              </Button>
            </Grid>
          </Grid>
        </Grid>


        <Dialog
          open={openNameFilterDialog}
          onClose={() => setOpenNameFilterDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ fontFamily: 'Poppins, sans-serif', color: '#1c5253' }}>
            Nomear Filtro
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nome do Filtro"
              type="text"
              fullWidth
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              sx={{ fontFamily: 'Poppins, sans-serif' }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenNameFilterDialog(false)}
              sx={{ fontFamily: 'Poppins, sans-serif', color: '#1c5253' }}
            >
              Cancelar
            </Button>
            <Button
              onClick={async () => {
                if (filterName.trim() === "") {
                  setSnackbarMessage("O nome do filtro não pode estar vazio.");
                  setSnackbarSeverity("warning");
                  setSnackbarOpen(true);
                  return;
                }
                await saveFilterWithName();
                setOpenNameFilterDialog(false);
                setFilterName("");
              }}
              sx={{ fontFamily: 'Poppins, sans-serif', color: '#1c5253' }}
            >
              Salvar
            </Button>
          </DialogActions>
        </Dialog>
        {/* Adicionar Snackbar para feedback */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: '100%', fontFamily: 'Poppins, sans-serif' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        {/* Modal para exibir filtros salvos */}
        <Dialog
          open={openSavedFiltersDialog}
          onClose={() => setOpenSavedFiltersDialog(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle sx={{ fontFamily: 'Poppins, sans-serif', color: '#1c5253' }}>
            Filtros Salvos
          </DialogTitle>
          <DialogContent>
            {savedFilters.length === 0 ? (
              <Typography sx={{ fontFamily: 'Poppins, sans-serif' }}>
                Nenhum filtro salvo encontrado.
              </Typography>
            ) : (

              //Tabela de Filtros Salvos
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>Nome</TableCell>
              
              
                    <TableCell sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {savedFilters.map((filter) => (
                    <TableRow key={filter.id}>
                      <TableCell sx={{ fontFamily: 'Poppins, sans-serif' }}>{filter.name || filter.id}</TableCell>
                    

                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => applySavedFilter(filter)}
                          sx={{
                            marginBottom: '1.5em',
                            backgroundColor: '#1c5253',
                            fontFamily: 'Poppins, sans-serif',
                            marginRight: '8px',
                            '&:hover': { backgroundColor: '#267c7e' },
                          }}
                        >
                          Aplicar
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleDeleteFilter(filter.id)}
                          sx={{
                            borderColor: '#ff5252',
                            color: '#ff5252',
                            fontFamily: 'Poppins, sans-serif',
                            '&:hover': { borderColor: '#e63946', color: '#e63946' },
                          }}
                        >
                          Excluir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenSavedFiltersDialog(false)}
              sx={{ fontFamily: 'Poppins, sans-serif', color: '#1c5253' }}
            >
              Fechar
            </Button>
          </DialogActions>
        </Dialog>

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