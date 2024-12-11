import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import "../../App.css";

function Footer() {
    return (
        <>
            <Box className="Box-Rodapé">
                <p className="Texto-Rodapé">
                    <Link to="/" style={{ textDecoration: "none", color: "white" }}>
                        SESOEMCONCURSOS.COM.BR
                    </Link>
                </p>

                <p className="Texto-Rodapé">
                    <Link
                        to="https://api.whatsapp.com/send?phone=5574981265381"
                        target="_blank"
                        style={{ textDecoration: "none", color: "white" }}
                    >
                        Atendimento ao Cliente
                    </Link>
                </p>
                <p className="Texto-Rodapé">
                    <Link
                        to="https://chat.whatsapp.com/F2vTpLRwvPm5be8llpsdVu"
                        target="_blank"
                        style={{ textDecoration: "none", color: "white" }}
                    >
                        Grupo no WhatsApp
                    </Link>
                </p>
                <p className="Texto-Rodapé">Quem Somos</p>
                <p className="Texto-Rodapé">
                    <Link
                        to="https://www.youtube.com/watch?v=2evADTh1FAY&t=1s"
                        target="_blank"
                        style={{ textDecoration: "none", color: "white" }}
                    >
                        Como usar o SESO em Concursos
                    </Link>
                </p>
                <p className="Texto-Rodapé">
                    <Link
                        to="/adm"
                        target="_blank"
                        style={{ textDecoration: "none", color: "white" }}
                    >
                        Adm
                    </Link>
                </p>
            </Box>



            <Box className="Box-Rodapé">
                <p className="Texto-Rodapé">
                    <Link
                        to="/MeuPerfil"
                        target="_blank"
                        style={{ textDecoration: "none", color: "white" }}
                    >
                        Meu Desempenho
                    </Link>
                </p>
                <p className="Texto-Rodapé">
                    <Link to="/" style={{ textDecoration: "none", color: "white", }}>
                        Questões
                    </Link>
                </p>

                <p className="Texto-Rodapé">
                    <Link
                        to="/RankingDesempenho"
                        target="_blank"
                        style={{ textDecoration: "none", color: "white" }}
                    >
                        Ranking de Desempenho
                    </Link>
                </p>
                <p className="Texto-Rodapé">
                    <Link
                        to="/LeisPDF"
                        target="_blank"
                        style={{ textDecoration: "none", color: "white" }}
                    >
                        LeisPDF
                    </Link>
                </p>
            </Box>

            <Box className="Box-Rodapé">
                <p className="Texto-Rodapé">
                    <Link
                        to="https://www.instagram.com/sesoemconcursos/"
                        target="_blank"
                        style={{ textDecoration: "none", color: "white" }}
                    >
                        Instagram
                    </Link>
                </p>
                <p className="Texto-Rodapé">
                    <Link to="/Aulas" style={{ textDecoration: "none", color: "white", }}>
                        Aulas
                    </Link>
                </p>
                <p className="Texto-Rodapé">
                    <Link
                        to="/EstatisticaSite"
                        style={{ textDecoration: "none", color: "white" }}
                    >
                        Estatisticas do Site
                    </Link>
                </p>
                <p className="Texto-Rodapé">
                    <Link
                        to="https://www.youtube.com/watch?v=2evADTh1FAY&t=1s"
                        target="_blank"
                        style={{ textDecoration: "none", color: "white" }}
                    >
                        Como usar o SESO em Concursos
                    </Link>
                </p>
            </Box>

            <Box className="Box-Rodapé1">
                <p className="Texto-Rodapé1">© 2024 - SESO em Concursos</p>
            </Box>
        </>
    )
}

export default Footer;