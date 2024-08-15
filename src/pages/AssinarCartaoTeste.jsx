import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';

import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import SimCardRoundedIcon from '@mui/icons-material/SimCardRounded';

import { styled } from '@mui/system';

const FormGrid = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'column',
}));

const CardReactMUI = () => {
    const [cardNumber, setCardNumber] = useState('');
    const [cvv, setCvv] = useState('');
    const [expirationDate, setExpirationDate] = useState('');

    const handleCardNumberChange = (event) => {
        const value = event.target.value.replace(/\D/g, '');
        const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        if (value.length <= 16) {
            setCardNumber(formattedValue);
        }
    };

    const handleCvvChange = (event) => {
        const value = event.target.value.replace(/\D/g, '');
        if (value.length <= 3) {
            setCvv(value);
        }
    };

    const handleExpirationDateChange = (event) => {
        const value = event.target.value.replace(/\D/g, '');
        const formattedValue = value.replace(/(\d{2})(?=\d{2})/, '$1/');
        if (value.length <= 4) {
            setExpirationDate(formattedValue);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
            maxWidth="460px"
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    p: 3,
                    height: { xs: 300, sm: 350, md: 375 },
                    width: '100%',
                    borderRadius: '20px',
                    border: '1px solid ',
                    borderColor: 'divider',
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle2">Cartão de Credito</Typography>
                    <CreditCardRoundedIcon sx={{ color: 'text.secondary' }} />
                </Box>
                <SimCardRoundedIcon
                    sx={{
                        fontSize: { xs: 48, sm: 56 },
                        transform: 'rotate(90deg)',
                        color: 'text.secondary',
                    }}
                />

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        gap: 2,
                    }}
                >
                    <FormGrid sx={{ flexGrow: 1 }}>
                        <FormLabel htmlFor="card-number" required>
                            Numero do Cartão
                        </FormLabel>
                        <OutlinedInput
                            id="card-number"
                            autoComplete="card-number"
                            placeholder="0000 0000 0000 0000"
                            required
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                        />
                    </FormGrid>
                    <FormGrid sx={{ maxWidth: '20%' }}>
                        <FormLabel htmlFor="cvv" required>
                            CVV
                        </FormLabel>
                        <OutlinedInput
                            id="cvv"
                            autoComplete="CVV"
                            placeholder="123"
                            required
                            value={cvv}
                            onChange={handleCvvChange}
                        />
                    </FormGrid>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormGrid sx={{ flexGrow: 1 }}>
                        <FormLabel htmlFor="card-name" required>
                            Nome
                        </FormLabel>
                        <OutlinedInput
                            id="card-name"
                            autoComplete="card-name"
                            placeholder="Gerson Aguiar"
                            required
                        />
                    </FormGrid>
                    <FormGrid sx={{ flexGrow: 1 }}>
                        <FormLabel htmlFor="card-expiration" required>
                            Data de validade
                        </FormLabel>
                        <OutlinedInput
                            id="card-expiration"
                            autoComplete="card-expiration"
                            placeholder="MM/YY"
                            required
                            value={expirationDate}
                            onChange={handleExpirationDateChange}
                        />
                    </FormGrid>
                </Box>
            </Box>

            <FormControlLabel
                control={<Checkbox name="saveCard" />}
                label="Lembrar dados do cartão na próxima compra"
            />
        </Box>
    );
};

export default CardReactMUI;
