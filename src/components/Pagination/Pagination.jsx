/* eslint-disable react/prop-types */
import { Box, Button, Typography } from "@mui/material";
function Pagination({
    handleNextPage,
    handlePreviousPage,
    paginaAtual,
    totalPages,
}) {

    return (
        <Box className="pagination">
            <Button onClick={handlePreviousPage} disabled={paginaAtual === 1}>
                Anterior
            </Button>
            <Typography sx={{ fontFamily: "Poppins", fontSize: "0.850em", fontWeight: "500", padding: "0.500em", textAlign: "center" }}>
                {paginaAtual.toLocaleString('pt-BR')} de {totalPages.toLocaleString('pt-BR')}
            </Typography>
            <Button onClick={handleNextPage}>
                Próxima
            </Button>
        </Box>
    )
}

export default Pagination;