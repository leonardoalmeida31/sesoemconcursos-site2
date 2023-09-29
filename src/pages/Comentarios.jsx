import { useEffect, useState } from "react";
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

const Comentarios = ({ question, db, user }) => {
  const [comentario, setComentario] = useState("");
  const [currentQuestionId, setCurrentQuestionId] = useState("");
  const [comments, setComments] = useState({});

  const handleCommentDelete = async (commentId) => {
    try {
      const comentariosRef = collection(db, "comentarios");
      await deleteDoc(doc(comentariosRef, commentId));
  
      // Atualize o estado dos comentários após a exclusão
      setComments((prevComments) => ({
        ...prevComments,
        [question.id]: prevComments[question.id].filter((comentario) => comentario.id !== commentId),
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
      console.error(
        "O questionId não está definido ou o comentário está vazio."
      );
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
    <div className="app-container">
      <h4>Comentários relevantes</h4>
      <ul className="comment-list">
        {comments[question.id] &&
          comments[question.id].map((comentario) => (
            <li key={comentario.id} className="comment">
              <div className="comment-content">
                <p className="comment-username">{comentario.displayName}</p>
                <p className="comment-text">{comentario.text}</p>
                <p className="comment-time">
                  {new Date(comentario.timestamp).toLocaleString()}
                </p>
                <button className="delete-button" onClick={() => handleCommentDelete(comentario.id)}>Excluir</button>
              </div>
            </li>
          ))}
      </ul>

      <div className="comment-input-container">
        {" "}
        {/* Container para o textarea e botão */}
        <textarea
          className="comment-input"
          placeholder="Digite seu comentário"
          value={comentario}
          data-questionid={question.id}
          onChange={handleCommentChange}
        />
        <button className="add-button" onClick={handleCommentSubmit}>
          Adicionar Comentário
        </button>
      </div>
    </div>
  );
};

export default Comentarios;
