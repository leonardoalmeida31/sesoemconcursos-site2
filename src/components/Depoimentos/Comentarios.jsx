/* eslint-disable react/prop-types */
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
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Box,
  Container,
  Paper,
  Divider,
  IconButton,
  CircularProgress,
  Fade,
} from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import SendIcon from "@mui/icons-material/Send";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useMediaQuery, useTheme } from "@mui/material";
import "./Comentarios.css";

const Comentarios = ({ question, db, user }) => {
  const [comentario, setComentario] = useState("");
  const [comments, setComments] = useState({});
  const [likes, setLikes] = useState({});
  const [dislikes, setDislikes] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Módulos do ReactQuill
  const modules = {
    toolbar: {
      container: [
        [{ font: ["Poppins", "Arial"] }],
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["clean"],
        [{ color: [] }, { background: [] }],
      ],
    },
  };

  // Carregar comentários
  useEffect(() => {
    const loadComments = async () => {
      try {
        setIsLoading(true);
        if (question.id) {
          const comentariosRef = collection(db, "comentarios");
          const q = query(comentariosRef, where("questionsId", "==", question.id));
          const comentariosSnapshot = await getDocs(q);

          const comentarioData = [];
          comentariosSnapshot.forEach((doc) => {
            const data = doc.data();
            comentarioData.push({
              id: doc.id,
              text: data.text,
              timestamp: data.timestamp?.toDate(),
              user: data.user,
              displayName: data.displayName,
              userPhotoURL: data.userPhotoURL,
              likes: data.likes || 0,
              dislikes: data.dislikes || 0,
              likesBy: data.likesBy || [],
              dislikesBy: data.dislikesBy || [],
            });
          });

          setComments((prev) => ({
            ...prev,
            [question.id]: comentarioData,
          }));

          const likesData = {};
          const dislikesData = {};
          comentarioData.forEach((c) => {
            likesData[c.id] = c.likes;
            dislikesData[c.id] = c.dislikes;
          });
          setLikes(likesData);
          setDislikes(dislikesData);
        }
      } catch (error) {
        console.error("Erro ao carregar comentários:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadComments();
  }, [question.id, db]);

  // Manipular envio de comentário
  const handleCommentSubmit = async () => {
    if (!question.id || !comentario.trim()) return;
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
        likesBy: [],
        dislikesBy: [],
      });

      const q = query(comentariosRef, where("questionsId", "==", question.id));
      const comentariosSnapshot = await getDocs(q);
      const comentarioData = [];
      comentariosSnapshot.forEach((doc) => {
        const data = doc.data();
        comentarioData.push({
          id: doc.id,
          text: data.text,
          timestamp: data.timestamp?.toDate(),
          user: data.user,
          displayName: data.displayName,
          userPhotoURL: data.userPhotoURL,
          likes: data.likes || 0,
          dislikes: data.dislikes || 0,
          likesBy: data.likesBy || [],
          dislikesBy: data.dislikesBy || [],
        });
      });

      setComments((prev) => ({
        ...prev,
        [question.id]: comentarioData,
      }));
      setComentario("");
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
    }
  };

  // Manipular exclusão de comentário
  const handleCommentDelete = async (commentId) => {
    try {
      const commentDoc = doc(db, "comentarios", commentId);
      const commentSnapshot = await getDoc(commentDoc);
      if (!commentSnapshot.exists()) return;

      const commentData = commentSnapshot.data();
      if (commentData.user === user.uid) {
        await deleteDoc(commentDoc);
        setComments((prev) => ({
          ...prev,
          [question.id]: prev[question.id].filter((c) => c.id !== commentId),
        }));
      }
    } catch (error) {
      console.error("Erro ao excluir comentário:", error);
    }
  };

  // Manipular curtida
  const handleLikeComment = async (commentId) => {
    try {
      const commentDoc = doc(db, "comentarios", commentId);
      const commentSnapshot = await getDoc(commentDoc);
      if (!commentSnapshot.exists()) return;

      const commentData = commentSnapshot.data();
      const likesBy = commentData.likesBy || [];
      if (!likesBy.includes(user.uid)) {
        await updateDoc(commentDoc, {
          likes: commentData.likes + 1,
          likesBy: [...likesBy, user.uid],
          dislikes: commentData.dislikesBy?.includes(user.uid)
            ? commentData.dislikes - 1
            : commentData.dislikes,
          dislikesBy: commentData.dislikesBy?.filter((id) => id !== user.uid) || [],
        });
        setLikes((prev) => ({ ...prev, [commentId]: prev[commentId] + 1 }));
        if (commentData.dislikesBy?.includes(user.uid)) {
          setDislikes((prev) => ({ ...prev, [commentId]: prev[commentId] - 1 }));
        }
      } else {
        await updateDoc(commentDoc, {
          likes: commentData.likes - 1,
          likesBy: likesBy.filter((id) => id !== user.uid),
        });
        setLikes((prev) => ({ ...prev, [commentId]: prev[commentId] - 1 }));
      }
    } catch (error) {
      console.error("Erro ao curtir comentário:", error);
    }
  };

  // Manipular descurtida
  const handleDislikeComment = async (commentId) => {
    try {
      const commentDoc = doc(db, "comentarios", commentId);
      const commentSnapshot = await getDoc(commentDoc);
      if (!commentSnapshot.exists()) return;

      const commentData = commentSnapshot.data();
      const dislikesBy = commentData.dislikesBy || [];
      if (!dislikesBy.includes(user.uid)) {
        await updateDoc(commentDoc, {
          dislikes: commentData.dislikes + 1,
          dislikesBy: [...dislikesBy, user.uid],
          likes: commentData.likesBy?.includes(user.uid)
            ? commentData.likes - 1
            : commentData.likes,
          likesBy: commentData.likesBy?.filter((id) => id !== user.uid) || [],
        });
        setDislikes((prev) => ({ ...prev, [commentId]: prev[commentId] + 1 }));
        if (commentData.likesBy?.includes(user.uid)) {
          setLikes((prev) => ({ ...prev, [commentId]: prev[commentId] - 1 }));
        }
      } else {
        await updateDoc(commentDoc, {
          dislikes: commentData.dislikes - 1,
          dislikesBy: dislikesBy.filter((id) => id !== user.uid),
        });
        setDislikes((prev) => ({ ...prev, [commentId]: prev[commentId] - 1 }));
      }
    } catch (error) {
      console.error("Erro ao descurtir comentário:", error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 2,
          backgroundColor: "#fff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant={isMobile ? "h6" : "h5"}
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
            color: "#1c5253",
            mb: 2,
          }}
        >
          Comentários
        </Typography>

        {/* Formulário de Comentário */}
        <Box className="comment-input-container" sx={{ mb: 3 }}>
          <ReactQuill
            theme="snow"
            value={comentario}
            onChange={(content, delta, source, editor) =>
              setComentario(editor.getHTML())
            }
            modules={modules}
            placeholder="Escreva seu comentário para ajudar outros colegas..."
            className="comment-editor"
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={handleCommentSubmit}
              disabled={!comentario.trim() || !user}
              sx={{
                fontFamily: "Poppins, sans-serif",
                backgroundColor: "#1c5253",
                "&:hover": { backgroundColor: "#267c7e" },
                borderRadius: 1,
                textTransform: "none",
                px: 3,
                py: 1,
              }}
            >
              Enviar
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Lista de Comentários */}
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : comments[question.id]?.length > 0 ? (
          <List sx={{ width: "100%" }}>
            {comments[question.id].map((comentario) => (
              <Fade in key={comentario.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    borderBottom: "1px solid #e0e0e0",
                    py: 2,
                    "&:last-child": { borderBottom: "none" },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={comentario.userPhotoURL}
                      sx={{
                        width: { xs: 36, sm: 48 },
                        height: { xs: 36, sm: 48 },
                        bgcolor: "#1c5253",
                      }}
                    >
                      {comentario.displayName?.[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          color: "#1c5253",
                        }}
                      >
                        {comentario.displayName}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{
                            fontFamily: "Poppins, sans-serif",
                            color: "#666",
                            mb: 1,
                            display: "block",
                          }}
                        >
                          {new Date(comentario.timestamp).toLocaleString("pt-BR", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </Typography>
                        <Box
                          className="comment-text"
                          dangerouslySetInnerHTML={{ __html: comentario.text }}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: 1,
                          }}
                        >
                          <IconButton
                            onClick={() => handleLikeComment(comentario.id)}
                            disabled={!user}
                            sx={{
                              color: comentario.likesBy?.includes(user?.uid)
                                ? "#1c5253"
                                : "#999",
                            }}
                            aria-label="Curtir comentário"
                          >
                            <ThumbUpIcon fontSize="small" />
                          </IconButton>
                          <Typography variant="caption" sx={{ color: "#1c5253" }}>
                            {likes[comentario.id] || 0}
                          </Typography>
                          <IconButton
                            onClick={() => handleDislikeComment(comentario.id)}
                            disabled={!user}
                            sx={{
                              color: comentario.dislikesBy?.includes(user?.uid)
                                ? "#1c5253"
                                : "#999",
                            }}
                            aria-label="Descurtir comentário"
                          >
                            <ThumbDownIcon fontSize="small" />
                          </IconButton>
                          <Typography variant="caption" sx={{ color: "#1c5253" }}>
                            {dislikes[comentario.id] || 0}
                          </Typography>
                          {comentario.user === user?.uid && (
                            <IconButton
                              onClick={() => handleCommentDelete(comentario.id)}
                              sx={{ color: "#ff5252" }}
                              aria-label="Excluir comentário"
                            >
                              <HighlightOffIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      </>
                    }
                  />
                </ListItem>
              </Fade>
            ))}
          </List>
        ) : (
          <Typography
            variant="body1"
            sx={{
              fontFamily: "Poppins, sans-serif",
              color: "#666",
              textAlign: "center",
              py: 4,
            }}
          >
            Ainda não há comentários. Seja o primeiro a comentar!
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default Comentarios;