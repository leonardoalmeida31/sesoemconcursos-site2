import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, getDocs, doc, setDoc } from "firebase/firestore";
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_REACT_APP_API_KEY,
    authDomain: import.meta.env.VITE_REACT_APP_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_REACT_APP_PROJECT_ID,
};

const Discursivas = () => {
    const [questions, setQuestions] = useState([]);
    const [responses, setResponses] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const firebaseApp = initializeApp(firebaseConfig);
        const db = getFirestore(firebaseApp);
        const questionsCollectionRef = collection(db, "discursivas");
        const q = query(questionsCollectionRef);

        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(q);
                const questionsData = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const id = doc.id;
                    questionsData.push({ id, ...data });
                });
                setQuestions(questionsData);
                // Inicialize as respostas com um array vazio com a mesma quantidade de perguntas
                setResponses(new Array(questionsData.length).fill({ id: '', resposta: '' }));
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        };

        fetchData();
    }, []);

    const handleResponseChange = (questionId, response) => {
        // Crie uma cópia do array de respostas
        const updatedResponses = [...responses];
    
        // Encontre o índice da pergunta no array de respostas
        const questionIndex = updatedResponses.findIndex((item) => item.id === questionId);
    
        // Se a pergunta já tiver uma resposta no array, atualize-a; caso contrário, adicione uma nova entrada
        if (questionIndex !== -1) {
            updatedResponses[questionIndex].resposta = response;
        } else {
            updatedResponses.push({ id: questionId, resposta: response });
        }
    
        // Defina o novo array de respostas no estado
        setResponses(updatedResponses);
    };
    

    const handleSubmitResponse = async (questionId) => {
        const responseText = responses.find((item) => item.id === questionId)?.resposta;
        if (!responseText || submitting) {
            return;
        }

        setSubmitting(true);

        try {
            const firebaseApp = initializeApp(firebaseConfig);
            const db = getFirestore(firebaseApp);
            const questionRef = doc(db, "discursivas", questionId);

            // Atualize o documento com a resposta do usuário
            await setDoc(questionRef, { resposta: responseText }, { merge: true });

            // Limpe o campo de resposta
            handleResponseChange(questionId, '');

            // Marque como não enviando
            setSubmitting(false);
        } catch (error) {
            console.error("Erro ao enviar resposta:", error);
            setSubmitting(false);
        }
    };

    return (
        <Container className="form-container">
            <Typography variant="h4" gutterBottom>
                Discursivas
            </Typography>
            {questions.map((question, index) => (
                <Paper key={question.id} elevation={3} style={{ padding: '16px', margin: '16px 0' }}>
                    <Typography variant="h6" gutterBottom>
                        ID do Documento: {question.id}
                    </Typography>
                    <Typography variant="body1">
                        Enunciado: {question.enunciado}
                    </Typography>
                    <TextField
    label="Sua Resposta"
    multiline
    fullWidth
    value={responses.find((item) => item.id === question.id)?.resposta || ''}
    onChange={(e) => handleResponseChange(question.id, e.target.value)}
    variant="outlined"
    margin="normal"
/>

                    <TextField
                        label="Resposta do Usuário"
                        multiline
                        fullWidth
                        value={question.resposta || ''}
                        variant="outlined"
                        margin="normal"
                        disabled
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleSubmitResponse(question.id)}
                        disabled={submitting}
                    >
                        Enviar Resposta
                    </Button>
                </Paper>
            ))}
        </Container>
    );
};

export default Discursivas;
