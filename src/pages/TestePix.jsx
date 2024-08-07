// TestePix.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Typography } from '@mui/material';

const TestePix = () => {
    const [qrCode, setQrCode] = useState(null);
    const [qrCodeBase64, setQrCodeBase64] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState('');
    const [paymentId, setPaymentId] = useState(null);

    const createPixPayment = async () => {
        try {
            const response = await axios.post('http://localhost:3001/create_pix_payment', {
                transaction_amount: 1.00, // Valor do pagamento em reais
                description: 'Compra de teste de 1 real',
                payer: {
                    email: 'cliente@exemplo.com'
                }
            });

            setQrCode(response.data.qrCode);
            setQrCodeBase64(response.data.qrCodeBase64);
            setPaymentId(response.data.payment.id);
            setPaymentStatus('Aguardando pagamento...');
        } catch (error) {
            console.error('Erro ao criar pagamento Pix:', error);
            setPaymentStatus('Erro ao criar pagamento.');
        }
    };

    const checkPaymentStatus = async () => {
        if (!paymentId) return;

        try {
            const response = await axios.get(`http://localhost:3001/check_payment_status?payment_id=${paymentId}`);
            const status = response.data.status;
            if (status === 'approved') {
                setPaymentStatus('Pagamento confirmado!');
            } else {
                setPaymentStatus('Aguardando pagamento...');
            }
        } catch (error) {
            console.error('Erro ao verificar status do pagamento:', error);
        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            checkPaymentStatus();
        }, 5000); // Verificar a cada 5 segundos

        return () => clearInterval(intervalId); // Limpar o intervalo quando o componente for desmontado
    }, [paymentId]);

    return (
        <Box mt={4} mb={4} textAlign="center">
            <Typography variant="h5" gutterBottom>
                Pagamento Pix de R$ 1,00
            </Typography>
            <Button variant="contained" color="primary" onClick={createPixPayment}>
                Criar Pagamento Pix
            </Button>
            {qrCode && (
                <Box mt={2}>
                    <Typography variant="body1">QR Code:</Typography>
                    <img src={`data:image/png;base64,${qrCodeBase64}`} alt="QR Code" />
                </Box>
            )}
            {paymentStatus && <Typography variant="body1">{paymentStatus}</Typography>}
        </Box>
    );
};

export default TestePix;
