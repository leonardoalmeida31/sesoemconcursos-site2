import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set } from "firebase/database"; 
import {  onAuthStateChanged, signOut } from 'firebase/auth';
import { TextField, Button, TextareaAutosize } from '@mui/material';
import { db, auth, app } from '../../../firebase';
import './CadastroQuestoes.css';
import { useNavigate } from 'react-router-dom';
import {
    Container,
} from "@mui/material";
function CadastroQuestoes() {
    const navigate = useNavigate();
    const db = getDatabase(app);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [questionData, setQuestionData] = useState({
        ids: '',
        banca: '',
        cargo: '',
        concurso: '',
        ano: '',
        disciplina: '',
        assunto: '',
        area: '',
        modalidade: '',
        enunciado: '',
        alternativas: ['(A) ', '(B) ', '(C) ', '(D) ', '(E) '],
        resposta: '',
        comentario: '',
    });

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
                navigate('/login');
            }
        });
    }, [auth, navigate]);

    const handleInputChange = (e, field) => {
        setQuestionData({ ...questionData, [field]: e.target.value });
    };

    const handleAlternativeChange = (e, index) => {
        const updatedAlternatives = [...questionData.alternativas];
        updatedAlternatives[index] = e.target.value;
        setQuestionData({ ...questionData, alternativas: updatedAlternatives });
    };

    const handleAddAlternative = () => {
        setQuestionData({
            ...questionData,
            alternativas: [...questionData.alternativas, '']
        });
    };

    const handleRemoveAlternative = (index) => {
        const updatedAlternatives = [...questionData.alternativas];
        updatedAlternatives.splice(index, 1);
        setQuestionData({ ...questionData, alternativas: updatedAlternatives });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const ids = parseInt(questionData.ids, 10);
            const ano = parseInt(questionData.ano, 10);

            if (isNaN(ids) || isNaN(ano)) {
                throw new Error('IDs e ano devem ser números inteiros válidos.');
            }

            const questionDataWithNumbers = { ...questionData, ids, ano };
            
  
            const questionRef = ref(db, `questions/${questionData.ids}`);
            await set(questionRef, questionDataWithNumbers);

            alert('Questão adicionada com sucesso!');
            setQuestionData({
                ids: '',
                banca: '',
                cargo: '',
                concurso: '',
                ano: '',
                disciplina: '',
                assunto: '',
                area: '',
                modalidade: '',
                enunciado: '',
                alternativas: ['(A) ', '(B) ', '(C) ', '(D) ', '(E) '],
                resposta: '',
                comentario: '',
            });
        } catch (error) {
            console.error('Erro ao adicionar questão:', error);
            alert('Erro ao adicionar a questão. Tente novamente mais tarde.');
        }
    };

    const handleLogout = () => {
        signOut(auth);
        setIsLoggedIn(false);
        navigate('/login');
    };

    const handleBack = () => {
        navigate(-1);
    };
    return (
        <Container className="form-container">
            {isLoggedIn ? (
                <div>
                    <Button onClick={handleLogout} variant="contained" color="secondary">
                        Sair
                    </Button>
                    <Button onClick={handleBack} variant="outlined" color="primary">
                        Voltar
                    </Button>
                    <h2>Adicionar Nova Questão</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="box-container">
                            <div className="box-ids">
                                <label htmlFor="ids">ID: </label>
                                <TextField
                                    type="number"
                                    id="ids"
                                    value={questionData.ids}
                                    onChange={(e) => handleInputChange(e, 'ids')}
                                    style={{ width: '7em' }}
                                />
                            </div>
                            <div className="box-ano">
                                <label htmlFor="ano">Ano: </label>
                                <TextField
                                    type="number"
                                    id="ano"
                                    value={questionData.ano}
                                    onChange={(e) => handleInputChange(e, 'ano')}
                                    style={{ width: '7em' }}
                                />
                            </div>
                            <div className="box-modalidade">
                                <label htmlFor="modalidade">Modalidade: </label>
                                <TextField
                                    id="modalidade"
                                    value={questionData.modalidade}
                                    onChange={(e) => handleInputChange(e, 'modalidade')}
                                    style={{ width: '10em' }}
                                />
                            </div>
                            <div className="box-area">
                                <label htmlFor="area">Área: </label>
                                <TextField
                                    id="area"
                                    value={questionData.area}
                                    onChange={(e) => handleInputChange(e, 'area')}
                                    style={{ width: '8em' }}
                                />
                            </div>
                            <div className="box-banca">
                                <label htmlFor="banca">Banca: </label>
                                <TextField
                                    id="banca"
                                    value={questionData.banca}
                                    onChange={(e) => handleInputChange(e, 'banca')}
                                    style={{ width: '10em' }}
                                />
                            </div>
                            <div className="box-cargo">
                                <label htmlFor="cargo">Cargo: </label>
                                <TextField
                                    id="cargo"
                                    value={questionData.cargo}
                                    onChange={(e) => handleInputChange(e, 'cargo')}
                                    style={{ width: '10em' }}
                                />
                            </div>
                        </div>
                        <div className="box2-container">
                            <div className="box-concurso">
                                <label htmlFor="concurso">Concurso: </label>
                                <TextField
                                    id="concurso"
                                    value={questionData.concurso}
                                    onChange={(e) => handleInputChange(e, 'concurso')}
                                    style={{ width: '75em' }}
                                />
                            </div>
                        </div>
                        <div className="box-disciplina">
                            <label htmlFor="disciplina">Disciplina:</label>
                            <TextField
                                id="disciplina"
                                value={questionData.disciplina}
                                onChange={(e) => handleInputChange(e, 'disciplina')}
                                style={{ width: '75em' }}
                            />
                        </div>
                        <div className="box-disciplina">
                            <label htmlFor="assunto">Assunto:</label>
                            <TextField
                                id="assunto"
                                value={questionData.assunto}
                                onChange={(e) => handleInputChange(e, 'assunto')}
                                style={{ width: '75em' }}
                            />
                        </div>
                        <div className="box-enunciado">
                            <label htmlFor="enunciado">Enunciado:</label>
                            <TextareaAutosize
                                id="enunciado"
                                minRows={3}
                                value={questionData.enunciado}
                                onChange={(e) => handleInputChange(e, 'enunciado')}
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div className="box-alternativas">
                            <label>Alternativas:</label>
                            {questionData.alternativas.map((alt, index) => (
                                <div key={index} className="box-input-alternativas">
                                    <TextField
                                        type="text"
                                        value={alt}
                                        onChange={(e) => handleAlternativeChange(e, index)}
                                        style={{ width: '75em' }}
                                    />
                                    <Button
                                        className="button-remove-alternativas"
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleRemoveAlternative(index)}
                                    >
                                        Remover
                                    </Button>
                                </div>
                            ))}
                            <Button variant="outlined" color="primary" onClick={handleAddAlternative}>
                                Adicionar Alternativa
                            </Button>
                        </div>
                        <div className="box-input-alternativas">
                            <label htmlFor="resposta">Resposta:</label>
                            <TextField
                                id="resposta"
                                value={questionData.resposta}
                                onChange={(e) => handleInputChange(e, 'resposta')}
                            />
                        </div>
                        <div>
                            <label htmlFor="comentario">Comentário:</label>
                            <TextareaAutosize
                                id="comentario"
                                minRows={3}
                                value={questionData.comentario}
                                onChange={(e) => handleInputChange(e, 'comentario')}
                                style={{ width: '100%' }}
                            />
                        </div>
                        <Button type="submit" variant="contained" color="primary">
                            Salvar Questão
                        </Button>
                    </form>
                </div>
            ) : (
                <p>Redirecionando para a tela de login...</p>
            )}
        </Container>
    );
}

export default CadastroQuestoes;
