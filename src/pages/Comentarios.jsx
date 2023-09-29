import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
  Button,
  Box,
  TextareaAutosize,
} from "@mui/material";

const Comentarios = ({ question, db, user }) => {
  const [comentario, setComentario] = useState("");
  const [currentQuestionId, setCurrentQuestionId] = useState("");
  const [comments, setComments] = useState({});

  // Função para ajustar dinamicamente a altura do textarea
  const handleTextareaHeight = (event) => {
    const textarea = event.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleCommentDelete = async (commentId) => {
    try {
      const comentariosRef = collection(db, "comentarios");
      await deleteDoc(doc(comentariosRef, commentId));

      // Atualize o estado dos comentários após a exclusão
      setComments((prevComments) => ({
        ...prevComments,
        [question.id]: prevComments[question.id].filter(
          (comentario) => comentario.id !== commentId
        ),
      }));
    } catch (error) {
      console.error("Erro ao excluir comentário:", error);
    }
  };

  const handleCommentChange = (e) => {
    const questionId = e.target.getAttribute("data-questionid");
    setCurrentQuestionId(questionId);
    setComentario(e.target.value);
  };

  const handleCommentSubmit = async () => {
    if (!currentQuestionId || comentario.trim() === "") {
      console.error("O questionId não está definido ou o comentário está vazio.");
      return;
    }

    try {
      const comentariosRef = collection(db, "comentarios");
      await addDoc(comentariosRef, {
        questionsId: currentQuestionId,
        text: comentario,
        timestamp: serverTimestamp(),
        user: user.uid,
        displayName: user.displayName,
        userPhotoURL: user.photoURL, // Adicione a URL da foto de perfil do usuário
      });

      // Atualize a lista de comentários para a questão atual
      const q = query(
        comentariosRef,
        where("questionsId", "==", currentQuestionId)
      );
      const comentariosSnapshot = await getDocs(q);

      const comentarioData = [];

      comentariosSnapshot.forEach((doc) => {
        const data = doc.data();
        comentarioData.push({
          id: doc.id,
          text: data.text,
          timestamp: data.timestamp.toDate(),
          user: data.user,
          displayName: data.displayName,
        });
      });

      setComments((prevComments) => ({
        ...prevComments,
        [currentQuestionId]: comentarioData,
      }));

      setComentario("");
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
    }
  };

  useEffect(() => {
    const loadComments = async () => {
      try {
        if (question.id) {
          const comentariosRef = collection(db, "comentarios");
          const q = query(
            comentariosRef,
            where("questionsId", "==", question.id)
          );
          const comentariosSnapshot = await getDocs(q);

          const comentarioData = [];

          comentariosSnapshot.forEach((doc) => {
            const data = doc.data();
            comentarioData.push({
              id: doc.id,
              text: data.text,
              timestamp: data.timestamp.toDate(),
              user: data.user,
              displayName: data.displayName,
            });
          });

          // Atualize os comentários apenas para a questão atual
          setComments((prevComments) => ({
            ...prevComments,
            [question.id]: comentarioData,
          }));
        }
      } catch (error) {
        console.error("Erro ao carregar comentários:", error);
      }
    };

    loadComments();
  }, [question.id, db]);

  return (
    <Box sx={{paddingBottom: '3em'}}>
      <Typography >Comentários relevantes</Typography>
      <List className="comment-list">
        {comments[question.id] &&
          comments[question.id].map((comentario) => (
            <ListItem key={comentario.id} className="comment">
              <ListItemAvatar>
              <Avatar src={user.photoURL}>
                  {/* Exiba a primeira letra do nome se a foto não estiver disponível */}
                  {!user.photoURL && comentario.displayName[0]}
                </Avatar>
              </ListItemAvatar>
              <div className="comment-content">
                <ListItemText
                  secondary={comentario.displayName}
                  primary={comentario.text}
                />
                <p className="comment-time">
                  {new Date(comentario.timestamp).toLocaleString()}
                </p>
                <Button
                  variant="outlined"
                  color="error"
                  className="delete-button"
                  onClick={() => handleCommentDelete(comentario.id)}
                >
                  Excluir
                </Button>
              </div>
            </ListItem>
          ))}
      </List>

      <Box mt={2} className="comment-input-container">
        {" "}
        {/* Container para o textarea e botão */}
        <TextareaAutosize
          className="comment-input"
          placeholder="Digite seu comentário"
          value={comentario}
          data-questionid={question.id}
          style={{ maxWidth: "50em" }}
          onChange={(e) => {
            handleTextareaHeight(e);
            handleCommentChange(e);
          }}
        />
        <Box mt={1}>
          <Button
            variant="contained"
            style={{ backgroundColor: "#1c5253", color: "white" }} // Defina a cor de fundo e a cor do texto
            onClick={handleCommentSubmit}
          >
            Adicionar Comentário
          </Button>

        </Box>
      </Box>
    </Box>
  );
};

export default Comentarios;
