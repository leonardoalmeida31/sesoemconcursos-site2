import React from 'react';
import { Container, Box, Typography } from '@mui/material';

const PDFViewer = () => {
    const pdfUrl = 'https://firebasestorage.googleapis.com/v0/b/sesoemconcursosweb.appspot.com/o/L8742.pdf?alt=media&token=cad2f105-7fc0-4e48-88c6-cffa62f0686d';

    return (
        <Container maxWidth="xl" sx={{ bgcolor: '#f5f5f5', borderRadius: '8px', padding: '16px' }}>
            <Typography variant="h4" align="center" gutterBottom>
                Visualizador de PDF
            </Typography>
            <Box
                sx={{
                    height: '90vh',
                    width: '100%',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: 2,
                }}
            >
                <iframe
                    src={pdfUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 'none' }}
                    title="PDF Viewer"
                    allow="autoplay; encrypted-media"
                />
            </Box>
        </Container>
    );
};

export default PDFViewer;