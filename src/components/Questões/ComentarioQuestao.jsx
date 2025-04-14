/* eslint-disable react/prop-types */
import { IconButton, Typography, Box } from "@mui/material";
import PollOutlinedIcon from '@mui/icons-material/PollOutlined';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LaptopChromebookIcon from '@mui/icons-material/LaptopChromebook';
import SignalCellularAltRoundedIcon from '@mui/icons-material/SignalCellularAltRounded';
import { useState } from 'react'; // Importar useState para gerenciar showChart
import "../../App.css";
import { Link } from "react-router-dom";
import EstatisticasQuestao from "../Estatisticas/EstatisticasQuestao";

function ComentariosQuestao({
  toggleComentario,
  question,
  paymentInfo,
}) {
  const [showChart, setShowChart] = useState(false); // Estado para controlar a exibição dos gráficos

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column', // O contêiner principal é uma coluna
        width: '100%', // Ocupa a largura total
      }}
    >
      {/* Contêiner para os botões, alinhados horizontalmente */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row', // Os botões ficam em linha
          gap: 1, // Espaço entre os botões
          flexWrap: 'wrap', // Permite que os botões quebrem linha se necessário
          justifyContent: 'flex-start', // Alinha os botões à esquerda
        }}
      >
        <IconButton
          sx={{ color: '#1c5253', padding: '0.700em' }}
          className="button-comentario"
          onClick={() => toggleComentario(question.ids)}
        >
          <QuestionAnswerOutlinedIcon fontSize="small" sx={{ color: '#1c5253', backgroundColor: 'transparent' }} />
          <Typography sx={{ fontSize: '0.550em', color: '#1c5253', marginLeft: '0.500em', fontFamily: 'Poppins', fontWeight: '500' }} color="error">
            Comentários
          </Typography>
        </IconButton>

        {/* Botão de Estatísticas da Questão movido para cá */}
        {paymentInfo !== null && (
          <IconButton
            onClick={() => setShowChart(!showChart)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: '#1c5253',
              padding: '0.700em',
              '&:hover': { bgcolor: 'rgba(28, 82, 83, 0.1)' },
            }}
          >
            <SignalCellularAltRoundedIcon fontSize="small" />
            <Typography
              sx={{
                ml: 0.5,
                fontSize: '0.550em',
                fontFamily: 'Poppins',
                fontWeight: 500,
                color: '#1c5253',
              }}
            >
              Estatísticas da Questão
            </Typography>
          </IconButton>
        )}

        <IconButton sx={{ color: '#1c5253', padding: '0.700em' }}>
          <a
            href="/Mentorias"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', textDecoration: 'none' }}
          >
            <LaptopChromebookIcon fontSize="small" sx={{ color: '#1c5253', backgroundColor: 'transparent' }} />
            <Typography
              sx={{ fontSize: '0.550em', color: '#1c5253', marginLeft: '0.500em', fontFamily: 'Poppins', fontWeight: '500' }}
              color="error"
            >
              Mentorias
            </Typography>
          </a>
        </IconButton>

        <IconButton sx={{ color: '#1c5253', padding: '0.700em' }}>
          <a
            href="https://chat.whatsapp.com/E4ANUZMGtFIKajR7qqzBxI"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', textDecoration: 'none' }}
          >
            <WhatsAppIcon fontSize="small" sx={{ color: '#1c5253', backgroundColor: 'transparent' }} />
            <Typography
              sx={{ fontSize: '0.550em', color: '#1c5253', marginLeft: '0.500em', fontFamily: 'Poppins', fontWeight: '500' }}
              color="error"
            >
              Grupo de Estudos
            </Typography>
          </a>
        </IconButton>
      </Box>

      {/* Renderizar EstatisticasQuestao abaixo dos botões, passando showChart como prop */}
      {paymentInfo !== null && (
        <Box sx={{ width: '100%' }}>
          <EstatisticasQuestao
            key={question.id}
            questionId={question.ids}
            showChart={showChart} // Passa o estado showChart como prop
          />
        </Box>
      )}
    </Box>
  );
}

export default ComentariosQuestao;