/* eslint-disable react/prop-types */
import React, { useState} from "react";
import { Grid, Select, MenuItem, IconButton } from "@mui/material";
import { useMediaQuery } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import "../../App.css";

function QuestaoPorPagina({ questoesPorPaginaInicial = 5, onChangeQuestoesPorPagina, handlePrint }) {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const [questoesPorPagina, setQuestoesPorPagina] = useState(questoesPorPaginaInicial);

  const handleChangeQuestoesPorPagina = (e) => {
    const newValue = Number(e.target.value);
    setQuestoesPorPagina(newValue);
    onChangeQuestoesPorPagina(newValue);
  };

  return (
    <>
      <Select
        value={questoesPorPagina}
        onChange={handleChangeQuestoesPorPagina}
        size="small"
        sx={{ backgroundColor: '#f2f2f2', fontSize: '1em', fontFamily: 'Poppins' }}
      >
        <MenuItem value={1}>1 Questão por página</MenuItem>
        <MenuItem value={5}>5 Questões por página</MenuItem>
        <MenuItem value={10}>10 Questões por página</MenuItem>
        <MenuItem value={15}>15 Questões por página</MenuItem>
        <MenuItem value={20}>20 Questões por página</MenuItem>
        <MenuItem value={50}>50 Questões por página</MenuItem>
        <MenuItem value={100}>100 Questões por página</MenuItem>
      </Select>

      <Grid sx={{
        justifyContent: 'center', display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
      }}>
        <IconButton onClick={handlePrint} color="primary">
          <PrintIcon sx={{ color: '#1C5253', }} />
        </IconButton>
      </Grid>

    </>
  );
}

export default QuestaoPorPagina;
