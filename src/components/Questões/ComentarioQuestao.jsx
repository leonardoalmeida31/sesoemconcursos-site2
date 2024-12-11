/* eslint-disable react/prop-types */
import { IconButton, Typography } from "@mui/material"
import PollOutlinedIcon from '@mui/icons-material/PollOutlined';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LaptopChromebookIcon from '@mui/icons-material/LaptopChromebook';
import "../../App.css";
import { Link } from "react-router-dom";
import EstatisticasQuestao from "../Estatisticas/EstatisticasQuestao";

function ComentariosQuestao({
    toggleComentario,
    question,
    paymentInfo,
}) {
    return (
        <>
            <IconButton
                sx={{ color: '#1c5253', padding: '0.700em' }}
                className="button-comentario"
                onClick={() => toggleComentario(question.ids)}
            >
                <QuestionAnswerOutlinedIcon fontSize="small" sx={{ color: '#1c5253', backgroundColor: 'transparent' }} />
                <Typography sx={{  fontSize: '0.550em', color: '#1c5253', marginLeft: '0.500em', fontFamily: 'Poppins', fontWeight: '500' }} color="error">
                    Comentários
                </Typography>
            </IconButton>

            <IconButton sx={{ color: '#1c5253', padding: '0.700em' }}>
                <Link to="/MeuPerfil" target="_blank" style={{ display: 'flex', textDecoration: 'none' }}>
                    <PollOutlinedIcon fontSize="small" sx={{ color: '#1c5253', backgroundColor: 'transparent' }} />
                    <Typography sx={{  fontSize: '0.550em', color: '#1c5253', marginLeft: '0.500em', fontFamily: 'Poppins', fontWeight: '500' }} color="error">
                        Meu Desempenho
                    </Typography>
                </Link>
            </IconButton>

            {paymentInfo !== null && (
                <EstatisticasQuestao key={question.id} questionId={question.ids} />
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
                        sx={{  fontSize: '0.550em', color: '#1c5253', marginLeft: '0.500em', fontFamily: 'Poppins', fontWeight: '500' }}
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
                        sx={{  fontSize: '0.550em', color: '#1c5253', marginLeft: '0.500em', fontFamily: 'Poppins', fontWeight: '500' }}
                        color="error"
                    >
                        Grupo de Estudos
                    </Typography>
                </a>
            </IconButton>
        </>
    );
}

export default ComentariosQuestao;