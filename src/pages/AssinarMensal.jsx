import React, { useEffect, useState } from "react";
import { loadMercadoPago } from "@mercadopago/sdk-js";
import { Grid, Button, TextField, Typography, Container, CircularProgress } from '@mui/material';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import SimCardRoundedIcon from '@mui/icons-material/SimCardRounded';

const CheckoutForm = () => {
  const [message, setMessage] = useState(""); // Feedback message state
  const [isLoading, setIsLoading] = useState(false); // Loading state


  const formatWhatsApp = (number) => {
    // Remove qualquer caractere que não seja dígito
    const cleaned = ('' + number).replace(/\D/g, '');
    
    // Verifica se o número possui 11 dígitos (incluindo o DDD)
    if (cleaned.length === 11) {
      // Formata o número no padrão (99) 99999-9999
      return cleaned.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    }
    
    // Retorna o número não formatado se não tiver 11 dígitos
    return number;
  };
  

  useEffect(() => {
    const initializeMercadoPago = async () => {
      try {
        await loadMercadoPago();
        const mp = new window.MercadoPago("TEST-dfff2587-dd23-4f61-9a42-a58ad90945c1");

        // Criação dos campos do formulário
        const cardNumberField = mp.fields.create("cardNumber", {
          placeholder: "Número do cartão",
          style: {
            base: {
              color: 'black',
              fontSize: '25px',
              '::placeholder': {
                color: 'black',
              },
              borderColor: 'black', // Adicione esta linha para garantir que a borda seja preta
            },
            invalid: {
              color: 'black',
              borderColor: 'black', // Adicione esta linha para garantir que a borda seja preta quando o campo for inválido
            },
          },
        });        
        cardNumberField.mount("#form-checkout__cardNumber");

        const expirationDateField = mp.fields.create("expirationDate", {
          placeholder: "MM/YY",
        });
        expirationDateField.mount("#form-checkout__expirationDate");

        const securityCodeField = mp.fields.create("securityCode", {
          placeholder: "CVV",
        });
        securityCodeField.mount("#form-checkout__securityCode");

        const cardForm = mp.cardForm({
          amount: "60.5",
          iframe: true,
          form: {
            id: "form-checkout",
            cardNumber: {
              id: "form-checkout__cardNumber",
              placeholder: "Número do cartão",
            },
            expirationDate: {
              id: "form-checkout__expirationDate",
              placeholder: "MM/YY",
            },
            securityCode: {
              id: "form-checkout__securityCode",
              placeholder: "Código de segurança",
            },
            cardholderName: {
              id: "form-checkout__cardholderName",
              placeholder: "Titular do cartão",
            },
            issuer: {
              id: "form-checkout__issuer",
              placeholder: "Banco emissor",
            },
            installments: {
              id: "form-checkout__installments",
              placeholder: "Parcelas",
            },
            identificationType: {
              id: "form-checkout__identificationType",
              placeholder: "Tipo de documento",
            },
            identificationNumber: {
              id: "form-checkout__identificationNumber",
              placeholder: "Número do documento",
            },
            cardholderEmail: {
              id: "form-checkout__cardholderEmail",
              placeholder: "E-mail",
            },
          },
          callbacks: {
            onFormMounted: (error) => {
              if (error) {
                console.warn("Form Mounted handling error: ", error);
              } else {
                console.log("Form mounted");
              }
            },
            onSubmit: (event) => {
              event.preventDefault();
              setIsLoading(true);

              const {
                paymentMethodId,
                issuerId,
                cardholderEmail,
                amount,
                token,
                installments,
                identificationNumber,
                identificationType,
              } = cardForm.getCardFormData();

              fetch("http://localhost:3001/api/process_payment", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  token,
                  issuer_id: issuerId,
                  payment_method_id: paymentMethodId,
                  transaction_amount: Number(amount),
                  installments: Number(installments),
                  description: "Descrição do produto",
                  payer: {
                    email: cardholderEmail,
                    identification: {
                      type: identificationType,
                      number: identificationNumber,
                    },
                  },

                }),
              })
                .then(response => response.json())
                .then(data => {
                  setIsLoading(false);
                  if (data.status === "approved") {
                    setMessage("ASSINATURA REALIZADA COM SUCESSO!");
                  } else {
                    setMessage("O pagamento falhou. Por favor, ATUALIZE A PÁGINA E tente novamente.");
                  }
                })
                .catch(error => {
                  setIsLoading(false);
                  setMessage("Ocorreu um erro ao processar o pagamento.");
                  console.error('Payment error:', error);
                });
            },
            onFetching: (resource) => {
              console.log("Fetching resource: ", resource);

              return () => { };
            },
          },
        });

        const updateFormFields = async () => {
          try {
            const issuers = await mp.getIssuers();
            const issuerSelect = document.getElementById("form-checkout__issuer");
            issuers.forEach((issuer) => {
              const option = document.createElement("option");
              option.value = issuer.id;
              option.text = issuer.name;
              issuerSelect.add(option);
            });

            const identificationTypes = await mp.getIdentificationTypes();
            const idTypeSelect = document.getElementById("form-checkout__identificationType");
            identificationTypes.forEach((type) => {
              const option = document.createElement("option");
              option.value = type.id;
              option.text = type.name;
              idTypeSelect.add(option);
            });

          } catch (error) {
            console.error("Error loading form fields: ", error);
          }
        };

        updateFormFields();
      } catch (error) {
        console.error("Error initializing Mercado Pago: ", error);
      }
    };

    initializeMercadoPago();
  }, []);

  


  return (
    <Container maxWidth="xl" sx={{justifyContent: 'center'}}>
      <Typography variant="h5" align="center" sx={{ mb: 2 }}>
        Checkout de Pagamento
      </Typography>
      <form id="form-checkout" style={{ display: 'flex', flexDirection: 'row', gap: '1em' }}>
        <Grid container spacing={2 } sx={{}}>
          <Grid item xs={12} md={6.5} sx={{justifyContent: 'center'}}>
            <Grid container spacing={2} sx={{
              padding: '1em',
              borderRadius: '20px',
              border: '1px solid ',
              borderColor: 'divider',
              background: '#EEF2F2',
              height: '100%',
              
            }}>
              <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', mb: 2 , justifyContent: 'space-between', alignItems: 'top' }}>
                <Typography sx={{fontFamily: 'Poppins', fontWeight:'500', fontSize: '1em'}}>Cartão de Crédito</Typography>
                <CreditCardRoundedIcon sx={{ color: 'black', ml: 1, textAlign: 'right', fontSize: { xs: 20, sm: 26 } }} />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                <SimCardRoundedIcon
                  sx={{
                    fontSize: { xs: 20, sm: 36 },
                    transform: 'rotate(90deg)',
                    color: 'black',
                  }}
                />
                
                <Grid id='dados cartao' sx={{ flex: 1, ml: 2 , }}>
              
                  <div id="form-checkout__cardNumber" style={containerStyle}></div>
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={6} sx={{}}>
                      <div id="form-checkout__expirationDate" className="container" style={containerStyle}></div>
                    </Grid>
                    <Grid item xs={6}>
                      <div id="form-checkout__securityCode" className="container" style={containerStyle}></div>
                    </Grid>
                  </Grid>
                  <TextField fullWidth id="form-checkout__cardholderName" label="Titular do Cartão" variant="outlined" margin="normal" sx={{ mt: 2, backgroundColor: 'transparent', color: 'white' }} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={5} sx={{marginLeft: '1em', justifyContent: 'center'}}>
            <Grid container spacing={2} sx={{
              padding: '1em',
              borderRadius: '20px',
              border: '1px solid ',
              borderColor: 'divider',
              background: '#EEF2F2',
              height: '100%',
            }}>
              <Grid item xs={12}>
                <TextField select fullWidth id="form-checkout__issuer" label="Banco Emissor" variant="outlined" margin="normal" SelectProps={{ native: true }}>
                  <option value="">Selecione o Banco Emissor</option>
                </TextField>
                <TextField select fullWidth id="form-checkout__installments" label="Parcelas" variant="outlined" margin="normal" SelectProps={{ native: true }}>
                  <option value="">Selecione o Número de Parcelas</option>
                </TextField>
                <TextField select fullWidth id="form-checkout__identificationType" label="Tipo de Documento" variant="outlined" margin="normal" SelectProps={{ native: true }}>
                  <option value="">Selecione o Tipo de Documento</option>
                </TextField>
                <TextField fullWidth id="form-checkout__identificationNumber" label="Número do Documento" variant="outlined" margin="normal" sx={{ mt: 2 }} />
                <TextField fullWidth id="form-checkout__cardholderEmail" label="E-mail" variant="outlined" margin="normal" sx={{ mt: 2 }} />
              </Grid>
             
              <Grid item xs={12} sx={{ mt: 2, textAlign: 'center', margin: '1em' }}>
                {isLoading ? (
                  <CircularProgress />
                ) : (
                  <Button sx={{backgroundColor: '#1B4F50'}}  variant="contained" color="primary" type="submit">
                    Finalizar Compra
                  </Button>
                )}
              </Grid>
              {message && (
                <Grid item xs={12} sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color={message.includes("sucesso") ? "green" : "red"}>
                    {message}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

const containerStyle = {
  width: '100%',
  height: '45px',
  color: 'black',
  padding: '0 1em',
  borderRadius: '4px',
  border: '1px solid black', // Altere aqui para que a borda seja preta
  boxSizing: 'border-box',
};


export default CheckoutForm;
