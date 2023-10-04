import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import ReplayIcon from '@mui/icons-material/Replay';
import { Container } from '@mui/material';
import { useMediaQuery } from '@mui/material';

function Cronometro() {
  const [segundos, setSegundos] = useState(0);
  const [minutos, setMinutos] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
  
    if (isRunning) {
      interval = setInterval(() => {
        setSegundos((segundos) => {
          const newSegundos = segundos + 1;
  
          if (newSegundos === 60) {
            setMinutos((minutos) => minutos + 1);
            return 0; // Redefinir os segundos para 0
          } else {
            return newSegundos;
          }
        });
      }, 1000);
    }
  
    return () => {
      clearInterval(interval);
    };
  }, [isRunning]);
  
  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setMinutos(0);
    setSegundos(0);
  };
  const isMobile = useMediaQuery('(max-width: 600px)');
  return (
    <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: isMobile ?'block' : 'flex-end' }}>
      <Typography  sx={{alignItems: 'center', justifyContent: 'flex-end',
      }}>
        {minutos < 10 ? `0${minutos}` : minutos}:{segundos < 10 ? `0${segundos}` : segundos}
      </Typography>
      <IconButton sx={{color:"#1c5253"}} onClick={handleStart} disabled={isRunning}>
        <PlayCircleOutlineIcon fontSize="small" />
      </IconButton>
      <IconButton color="secondary" onClick={handlePause} disabled={!isRunning}>
        <PauseCircleOutlineIcon fontSize="small" />
      </IconButton>
      <IconButton onClick={handleReset}>
        <ReplayIcon fontSize="small" />
      </IconButton>
    </Container>
  );
}

export default Cronometro;
