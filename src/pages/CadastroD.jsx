import React, { useState } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import './CadastroQuestoes.css';
import { TextField, Button, TextareaAutosize } from '@mui/material'; // Importando os componentes de input do Material-UI

const firebaseConfig = {
    apiKey: import.meta.env.VITE_REACT_APP_API_KEY,
    authDomain: import.meta.env.VITE_REACT_APP_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_REACT_APP_PROJECT_ID,
  };
  

const CadastroD = () => {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const auth = getAuth(firebaseApp);
    const questionsCollectionRef = collection(db, "discursivas");
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



    const handleInputChange = (e, field) => {
        const updatedQuestionData = { ...questionData };
        updatedQuestionData[field] = e.target.value;
        setQuestionData(updatedQuestionData);
    };

    const handleAlternativeChange = (e, index) => {
        const updatedAlternatives = [...questionData.alternativas];
        updatedAlternatives[index] = e.target.value;
        const updatedQuestionData = { ...questionData, alternativas: updatedAlternatives };
        setQuestionData(updatedQuestionData);
    };
    const handleAddAlternative = () => {
        const updatedAlternatives = [...questionData.alternativas, ''];
        const updatedQuestionData = { ...questionData, alternativas: updatedAlternatives };
        setQuestionData(updatedQuestionData);
    };

    const handleRemoveAlternative = (index) => {
        const updatedAlternatives = [...questionData.alternativas];
        updatedAlternatives.splice(index, 1);
        const updatedQuestionData = { ...questionData, alternativas: updatedAlternatives };
        setQuestionData(updatedQuestionData);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Converter os campos "ids" e "ano" para números inteiros
            const ids = parseInt(questionData.ids, 10); // 10 é a base decimal
            const ano = parseInt(questionData.ano, 10);

            // Verificar se a conversão foi bem-sucedida
            if (isNaN(ids) || isNaN(ano)) {
                throw new Error('IDs e ano devem ser números inteiros válidos.');
            }

            // Criar um novo objeto com os valores convertidos
            const questionDataWithNumbers = {
                ...questionData,
                ids: ids,
                ano: ano,
            };

            await addDoc(questionsCollectionRef, questionDataWithNumbers);
            alert('Questão adicionada com sucesso!');
            // Limpar o formulário após o sucesso
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



const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    // Verifique se o username e a senha correspondem a um usuário válido
    if (username === 'leoa7' && password === '312869Lv') {
      setLoggedIn(true);
    } else {
      alert('Nome de usuário ou senha incorretos');
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUsername('');
    setPassword('');
  };

    return (
        <Container className="form-container">

<div>
     
        <><div>

                        <button onClick={handleLogout}>Sair</button>
                    </div>
                    <h2>Adicionar Nova Questão</h2><form onSubmit={handleSubmit}>

                            <div className="box-container">
                                <div className="box-ids">
                                    <label htmlFor="ids">ID:  </label>
                                    <TextField
                                        type="number"
                                        id="ids"
                                        value={questionData.ids}
                                        onChange={(e) => handleInputChange(e, 'ids')}
                                        style={{ width: '7em' }} // Defina o tamanho desejado aqui
                                    />
                                </div>
                                <div className="box-ano">
                                    <label htmlFor="ano">Ano:  </label>
                                    <TextField
                                        type="number"
                                        id="ano"
                                        value={questionData.ano}
                                        onChange={(e) => handleInputChange(e, 'ano')}
                                        style={{ width: '7em' }} // Defina o tamanho desejado aqui
                                    />
                                </div>

                                <div className="box-modalidade">
                                    <label htmlFor="modalidade">Modalidade:  </label>
                                    <TextField
                                        id="modalidade"
                                        value={questionData.modalidade}
                                        onChange={(e) => handleInputChange(e, 'modalidade')}
                                        style={{ width: '10em' }} // Defina o tamanho desejado aqui
                                    />
                                </div>


                                <div className="box-area">
                                    <label htmlFor="area">Área:   </label>
                                    <TextField
                                        id="area"
                                        value={questionData.area}
                                        onChange={(e) => handleInputChange(e, 'area')}
                                        style={{ width: '8em' }} // Defina o tamanho desejado aqui
                                    />
                                </div>
                                <div className="box-banca">
                                    <label htmlFor="banca">Banca:   </label>
                                    <TextField
                                        id="banca"
                                        value={questionData.banca}
                                        onChange={(e) => handleInputChange(e, 'banca')}
                                        style={{ width: '10em' }} // Defina o tamanho desejado aqui
                                    />
                                </div>
                                <div className="box-cargo">
                                    <label htmlFor="cargo">Cargo:   </label>
                                    <TextField
                                        id="cargo"
                                        value={questionData.cargo}
                                        onChange={(e) => handleInputChange(e, 'cargo')}
                                        style={{ width: '10em' }} // Defina o tamanho desejado aqui
                                    />
                                </div>

                            </div>

                            <div className="box2-container">

                                <div className="box-concurso">
                                    <label htmlFor="concurso">Concurso:   </label>
                                    <TextField
                                        id="concurso"
                                        value={questionData.concurso}
                                        onChange={(e) => handleInputChange(e, 'concurso')}
                                        style={{ width: '75em' }} // Defina o tamanho desejado aqui
                                    />
                                </div>

                            </div>

                            <div className="box-disciplina">
                                <label htmlFor="disciplina">Disciplina:</label>
                                <TextField
                                    id="disciplina"
                                    value={questionData.disciplina}
                                    onChange={(e) => handleInputChange(e, 'disciplina')}
                                    style={{ width: '75em' }} // Defina o tamanho desejado aqui
                                />
                            </div>
                            <div className="box-disciplina">
                                <label htmlFor="assunto">Assunto:</label>
                                <TextField
                                    id="assunto"
                                    value={questionData.assunto}
                                    onChange={(e) => handleInputChange(e, 'assunto')}
                                    style={{ width: '75em', }} // Defina o tamanho desejado aqui
                                />
                            </div>

                            <div className="box-enunciado">
                                <label htmlFor="enunciado">Enunciado:</label>
                                <TextareaAutosize
                                    id="enunciado"
                                    minRows={3}
                                    value={questionData.enunciado}
                                    onChange={(e) => handleInputChange(e, 'enunciado')}
                                    style={{ width: '100%' }} // Defina a largura desejada
                                />
                            </div>
                            <div className="box-alternativas">
                                <label>Alternativas:</label>
                                {questionData.alternativas && questionData.alternativas.length > 0 ? (
                                    questionData.alternativas.map((alt, index) => (
                                        <div key={index} className="box-input-alternativas">
                                            <TextField
                                                type="text"
                                                value={alt}
                                                onChange={(e) => handleAlternativeChange(e, index)}
                                                style={{ width: '75em' }} // Defina o tamanho desejado aqui
                                            />
                                            <Button className="button-remove-alternativas"
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleRemoveAlternative(index)}
                                            >
                                                Remover
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="no-alternatives-message">Nenhuma alternativa disponível</p>
                                )}
                                <Button variant="outlined" color="primary" onClick={handleAddAlternative}>
                                    Adicionar Alternativa
                                </Button>
                            </div>

                            <div className="box-input-alternativas">
                                <label htmlFor="resposta">Resposta:</label>
                                <TextField
                                    id="resposta"
                                    value={questionData.resposta}
                                    onChange={(e) => handleInputChange(e, 'resposta')} />
                            </div>
                            <div>
                                <label htmlFor="comentario">Comentário:</label>
                                <TextareaAutosize
                                    id="comentario"
                                    value={questionData.comentario}
                                    onChange={(e) => handleInputChange(e, 'comentario')}
                                    style={{ width: '100%' }} // Defina a largura desejada
                                />
                            </div>

                            <Button type="submit" variant="contained" color="primary">
                                Adicionar Questão
                            </Button>
                        </form></>
           
             ) : (
                <div>
                  <h2>Entre com seu nome de usuário e senha</h2>
                  <div>
                    <label>Nome de Usuário:</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Senha:</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button onClick={handleLogin}>Login</button>
                </div>
             
           </div>
        </Container>
    );
};

export default CadastroD;
