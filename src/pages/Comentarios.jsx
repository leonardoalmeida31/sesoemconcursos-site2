import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  deleteDoc,
  doc, getDoc
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
  TextareaAutosize, OutlinedInput
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";



const Comentarios = ({ question, db, user }) => {
  const [comentario, setComentario] = useState("");
  const [currentQuestionId, setCurrentQuestionId] = useState("");
  const [comments, setComments] = useState({});
  const [photoURL, setPhotoURL] = useState("");


  // Função para ajustar dinamicamente a altura do textarea
  const handleTextareaHeight = (event) => {
    const textarea = event.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleCommentDelete = async (commentId) => {
    try {
      const comentariosRef = collection(db, "comentarios");
      const commentDoc = doc(comentariosRef, commentId);
      const commentSnapshot = await getDoc(commentDoc);

      if (!commentSnapshot.exists()) {
        console.error("O comentário não existe.");
        return;
      }

      const commentData = commentSnapshot.data();

      // Verifique se o usuário atual é o autor do comentário
      if (commentData.user === user.uid) {
        // Apenas o autor pode excluir o comentário
        await deleteDoc(commentDoc);

        // Atualize o estado dos comentários após a exclusão
        setComments((prevComments) => ({
          ...prevComments,
          [question.id]: prevComments[question.id].filter(
            (comentario) => comentario.id !== commentId
          ),
        }));
      } else {
        console.error("Você não tem permissão para excluir este comentário.");
      }
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
        userPhotoURL: user.photoURL,
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
          userPhotoURL: data.userPhotoURL,
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
              userPhotoURL: data.userPhotoURL, // Usar a URL da foto do usuário do comentário
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
    <Box className="app-container">
      <Typography variant="h6">Comentários relevantes</Typography>
      <List className="comment-list">
        {comments[question.id] &&
          comments[question.id].map((comentario) => (
            <ListItem key={comentario.id} className="comment">
              <ListItemAvatar>
                <Avatar src={comentario.userPhotoURL}>{comentario.displayName[0]}</Avatar>
              </ListItemAvatar>

              <div className="comment-content">
                <ListItemText
                  secondary={comentario.displayName} 
                  secondaryTypographyProps={{ variant: 'body1', color: 'textSecondary', color: '#1c5253', paddingTop: '1em' }}
                  primary={comentario.text}
                  
                />
                <p className="comment-time">
                  {new Date(comentario.timestamp).toLocaleString()}
                </p>
                <ListItemSecondaryAction>
                <IconButton
                  color="error"
                  aria-label="Excluir Comentário"
                  onClick={() => handleCommentDelete(comentario.id)}
                  disabled={comentario.user !== user.uid}
                >
                  <HighlightOffIcon />
                </IconButton>
                </ListItemSecondaryAction>

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
