import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  deleteDoc,
  doc, getDoc, updateDoc
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
  TextareaAutosize, Container
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import { useMediaQuery } from "@mui/material";
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOffAltOutlinedIcon from '@mui/icons-material/ThumbDownOffAltOutlined';
import ReactMarkdown from 'react-markdown';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import './Comentarios.css';

const Comentarios = ({ question, db, user }) => {
  const [comentario, setComentario] = useState("");
  const [currentQuestionId, setCurrentQuestionId] = useState("");
  const [comments, setComments] = useState({});
  const [photoURL, setPhotoURL] = useState("");

  const [likes, setLikes] = useState({}); // Estado para controlar as curtidas
  const [dislikes, setDislikes] = useState({}); // Estado para controlar as descurtidas


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


  const handleCommentChange = (content, delta, source, editor) => {
    setComentario(editor.getHTML());
  };

  const handleCommentSubmit = async () => {
    if (!question.id || !comentario.trim()) {
      console.error("O questionId não está definido ou o comentário está vazio.");
      return;
    }

    try {
      const comentariosRef = collection(db, "comentarios");
      await addDoc(comentariosRef, {
        questionsId: question.id,
        text: comentario,
        timestamp: serverTimestamp(),
        user: user.uid,
        displayName: user.displayName,
        userPhotoURL: user.photoURL,
        likes: 0,
        dislikes: 0,
      });

      // Atualize a lista de comentários para a questão atual
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
          userPhotoURL: data.userPhotoURL,
        });
      });

      setComments((prevComments) => ({
        ...prevComments,
        [question.id]: comentarioData,
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
              userPhotoURL: data.userPhotoURL,
              likes: data.likes || 0, // Valor padrão se não houver dados de curtidas
              dislikes: data.dislikes || 0, // Valor padrão se não houver dados de descurtidas
              likesBy: data.likesBy || [], // Usuários que curtiram o comentário
              dislikesBy: data.dislikesBy || [], // Usuários que descurtiram o comentário
            });
          });

          // Atualize os comentários apenas para a questão atual
          setComments((prevComments) => ({
            ...prevComments,
            [question.id]: comentarioData,
          }));

          // Atualize os estados de curtidas e descurtidas
          const likesData = {};
          const dislikesData = {};

          comentarioData.forEach((comentario) => {
            likesData[comentario.id] = comentario.likes;
            dislikesData[comentario.id] = comentario.dislikes;
          });

          setLikes(likesData);
          setDislikes(dislikesData);
        }
      } catch (error) {
        console.error("Erro ao carregar comentários:", error);
      }
    };

    loadComments();
  }, [question.id, db]);

  const handleLikeComment = async (commentId) => {
    try {
      const comentariosRef = collection(db, "comentarios");
      const commentDoc = doc(comentariosRef, commentId);
      const commentSnapshot = await getDoc(commentDoc);

      if (!commentSnapshot.exists()) {
        console.error("O comentário não existe.");
        return;
      }

      const commentData = commentSnapshot.data();

      // Verifique se o usuário já curtiu o comentário
      if (!commentData.likesBy || !commentData.likesBy.includes(user.uid)) {
        // Atualize o Firestore para registrar a curtida
        await updateDoc(commentDoc, {
          likes: commentData.likes + 1,
          likesBy: [...(commentData.likesBy || []), user.uid],
        });

        // Atualize o estado local
        setLikes((prevLikes) => ({
          ...prevLikes,
          [commentId]: (prevLikes[commentId] || 0) + 1,
        }));
      } else {
        // Se o usuário já curtiu o comentário, remova a curtida
        await updateDoc(commentDoc, {
          likes: commentData.likes - 1,
          likesBy: commentData.likesBy.filter((userId) => userId !== user.uid),
        });

        // Atualize o estado local para refletir a remoção da curtida
        setLikes((prevLikes) => ({
          ...prevLikes,
          [commentId]: (prevLikes[commentId] || 0) - 1,
        }));
      }
    } catch (error) {
      console.error("Erro ao curtir comentário:", error);
    }
  };


  const handleDislikeComment = async (commentId) => {
    try {
      const comentariosRef = collection(db, "comentarios");
      const commentDoc = doc(comentariosRef, commentId);
      const commentSnapshot = await getDoc(commentDoc);

      if (!commentSnapshot.exists()) {
        console.error("O comentário não existe.");
        return;
      }

      const commentData = commentSnapshot.data();

      // Verifique se o usuário já descurtiu o comentário
      if (!commentData.dislikesBy || !commentData.dislikesBy.includes(user.uid)) {
        // Atualize o Firestore para registrar a descurtida
        await updateDoc(commentDoc, {
          dislikes: commentData.dislikes + 1,
          dislikesBy: [...(commentData.dislikesBy || []), user.uid],
        });

        // Atualize o estado local
        setDislikes((prevDislikes) => ({
          ...prevDislikes,
          [commentId]: (prevDislikes[commentId] || 0) + 1,
        }));
      } else {
        // Se o usuário já descurtiu o comentário, remova a descurtida
        await updateDoc(commentDoc, {
          dislikes: commentData.dislikes - 1,
          dislikesBy: commentData.dislikesBy.filter((userId) => userId !== user.uid),
        });

        // Atualize o estado local para refletir a remoção da descurtida
        setDislikes((prevDislikes) => ({
          ...prevDislikes,
          [commentId]: (prevDislikes[commentId] || 0) - 1,
        }));
      }
    } catch (error) {
      console.error("Erro ao descurtir comentário:", error);
    }
  };



  const handleBoldText = () => {
    const textArea = document.getElementById("comment-input");
    const startPos = textArea.selectionStart;
    const endPos = textArea.selectionEnd;
    const selectedText = textArea.value.substring(startPos, endPos);

    const newText =
      textArea.value.substring(0, startPos) +
      `<b>${selectedText}</b>` +
      textArea.value.substring(endPos);

    setComentario(newText);
  };


  
  const modules = {
    toolbar: {
      container: [
        [{ font: [] }],
        [{ 'header': [1, 2, 3, 4, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
       
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['video'], // Adicione o módulo de vídeo
        ['clean'],
        [{ 'color': [] }, { 'background': [] }], // Adicione as opções de seleção de cores
        
      ],
    },

  };

  const styles = {
    backgroundColor: "#FFFFFF", // Defina a cor de fundo como branco
    color: "#000000", // Defina a cor do texto como preto

    border: "1px solid #ccc", // Adicione uma borda
    borderRadius: "7px", // Adicione bordas arredondadas
    padding: "10px", // Adicione preenchimento interno
    // Adicione outros estilos conforme necessário
    
  };

  
  return (
    <Box className="app-container">
      <Typography variant="h7">Comentários relevantes</Typography>
      <List className="comment-list">
        {comments[question.id] &&
          comments[question.id].map((comentario) => (

            <ListItem sx={{ width: '100%', display: 'flex', alignItems: 'flex-start' }} key={comentario.id} className="comment">
              <ListItemAvatar >
                <Avatar style={{ width: '2em', height: '2em', }} src={comentario.userPhotoURL}>{comentario.displayName[0]}</Avatar>
              </ListItemAvatar>

              <Box className="comment-content">
                <ListItemText
                  primary={comentario.displayName}
                  primaryTypographyProps={{
                    style: { fontSize: '1em', fontFamily: 'Poppins', color: '#1c5253' },
                  }}
                  secondary={
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      sx={{
                        paddingTop: '1em',
                        fontSize: '1em',
                        fontFamily: 'Poppins',
                        color: 'black',
                      }}
                      dangerouslySetInnerHTML={{ __html: comentario.text }}
                    />
                  }
                />
                <p className="comment-time">
                  {new Date(comentario.timestamp).toLocaleString()}
                </p>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', }}>
                  <IconButton
                    sx={{ color: "#1c5253", }}

                    aria-label="Curtir"
                    onClick={() => handleLikeComment(comentario.id)}

                  >
                    < ThumbUpOutlinedIcon fontSize="small" />
                  </IconButton>
                  <Typography sx={{ marginRight: '1em', fontSize: '0.900em', color: "#1c5253" }} color="primary"> Ajudou ({likes[comentario.id]})
                  </Typography>
                  <IconButton
                    sx={{ color: "#1c5253" }}
                    aria-label="Descurtir"
                    onClick={() => handleDislikeComment(comentario.id)}
                  >
                    <ThumbDownOffAltOutlinedIcon fontSize="small" />
                  </IconButton>
                  <Typography sx={{ fontSize: '0.900em', color: "#1c5253" }} color="error"> Não ajudou  ({dislikes[comentario.id]})
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', }}>

                  <IconButton
                    color="error"
                    aria-label="Excluir Comentário"
                    onClick={() => handleCommentDelete(comentario.id)}
                    disabled={comentario.user !== user.uid}
                  >
                    <HighlightOffIcon fontSize="small" />
                  </IconButton >  <Typography sx={{ fontSize: '0.900em', }}  >
                  </Typography>

                </Box>

              </Box>

            </ListItem>
          ))}
      </List>

      <Box className="comment-input-container">
        <ReactQuill
          theme="snow"
          value={comentario}
          onChange={handleCommentChange}
          modules={modules}
          style={styles}
       
        />



        <Box mt={1}>
          <Button
            variant="contained"
            style={{ backgroundColor: "#1c5253", color: "white" }}
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
