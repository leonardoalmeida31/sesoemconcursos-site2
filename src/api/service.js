import axios from "axios";

const BASE_PATH = "http://localhost:3000";

export async function postCriarPix(body) {
    return await axios.post(`${BASE_PATH}/criar-pix`,
        { body }
    );
}

export async function postCredit(
    token,
    issuer_id,
    payment_method_id,
    transaction_amount,
    installments,
    email,
    identificationType,
    identificationNumber
) {
    const body = {
        token,
        issuer_id,
        payment_method_id,
        transaction_amount: transaction_amount,
        installments: Number(installments),
        description: "Capa para notebook",
        payer: {
            email,
            identification: {
                type: identificationType,
                number: identificationNumber,
            },
        },
    };

    return await axios.post(`${BASE_PATH}/process_payment`,
        { body }
    );
}