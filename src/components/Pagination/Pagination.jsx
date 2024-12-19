/* eslint-disable react/prop-types */
import { Box, Button, Typography } from "@mui/material";
import NavigateNextSharpIcon from '@mui/icons-material/NavigateNextSharp';
import NavigateBeforeSharpIcon from '@mui/icons-material/NavigateBeforeSharp';

function Pagination({ handlePageChange, paginaAtual, totalPages }) {
    const visiblePages = 5; // Número máximo de botões visíveis

    // Calcula o intervalo de páginas visíveis
    const startPage = Math.max(1, paginaAtual - Math.floor(visiblePages / 2));
    const endPage = Math.min(totalPages, startPage + visiblePages - 1);

    // Garante que sempre mostre exatamente `visiblePages` enquanto possível
    const adjustedStartPage = Math.max(1, endPage - visiblePages + 1);
    const pages = Array.from({ length: endPage - adjustedStartPage + 1 }, (_, index) => adjustedStartPage + index);

    return (
        <Box
      
            sx={{
                display: 'flex',
                justifyContent: 'center', // Centraliza no eixo horizontal
                alignItems: 'center', // Centraliza no eixo vertical
                gap: '0.5em',
                marginTop: '1em', // Adiciona margem para melhor separação
            }}
        >
            <Typography
                sx={{
                    fontFamily: "Poppins",
                    fontSize: "0.850em",
                    fontWeight: "500",
                    padding: "0.500em",
                    textAlign: "center",
                }}
            >
    
            </Typography>
            <Button
                onClick={() => handlePageChange(paginaAtual - 1)}
                disabled={paginaAtual === 1}
                sx={{
                    minWidth: "40px",
                    backgroundColor: "white",
                    color: "black",
                    '&:hover': {
                        backgroundColor: "#f0f0f0",
                    },
                }}
            >
           <NavigateBeforeSharpIcon/>
            </Button>
            {pages.map((page) => (
                <Button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    sx={{
                        minWidth: "40px",
                        padding: "0.5em",
                        backgroundColor: paginaAtual === page ? "#1C5253" : "white",
                        color: paginaAtual === page ? "white" : "black",
                        border: paginaAtual === page ? "none" : "1px solid #ccc",
                        '&:hover': {
                            backgroundColor: paginaAtual === page ? "#1C5253" : "#f0f0f0",
                        },
                    }}
                >
                    {page}
                </Button>
            ))}
            <Button
                onClick={() => handlePageChange(paginaAtual + 1)}
                disabled={paginaAtual === totalPages}
                sx={{
                    minWidth: "40px",
                    backgroundColor: "white",
                    color: "black",
                    '&:hover': {
                        backgroundColor: "#f0f0f0",
                    },
                }}
            >
             <NavigateNextSharpIcon/>
            </Button>
        </Box>
    );
}

export default Pagination;
