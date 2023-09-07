import React from 'react';

function QuestionCard({
  question,
  alternativasSelecionadas,
  handleAlternativaClick,
  handleRespostaClick,
  feedback,
  toggleComentario,
  comentariosVisiveis,
  toggleEstatisticas,
  desempenho,
}) {
  return (
    <div key={question.id} className="question-container">
                <div className="cabecalho-disciplina">
                  <p>
                    ID: {question.ids}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {question.disciplina}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {question.assunto}
                  </p>
                </div>
                <div className="cabecalho-orgao">
                  <p>
                    Banca: {question.banca}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ano: {question.ano}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Cargo: {question.cargo}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </p>
                  <p>Órgão: {question.concurso}</p>
                </div>
                <p className="enunciado">{question.enunciado}</p>
                <ul>
                  {question.alternativas.map((alternativa, index) => {
                    const letraAlternativa =
                      alternativa.match(/^\(([A-E])\)/)[1];

                    return (
                      <li
                        className={`alternativa ${
                          alternativasSelecionadas[question.id] === index
                            ? "selecionada"
                            : ""
                        }`}
                        key={index}
                        onClick={() =>
                          handleAlternativaClick(question.id, index)
                        }
                      >
                        <span
                          className={`letra-alternativa-circle ${
                            alternativasSelecionadas[question.id] === index
                              ? "selecionada"
                              : ""
                          }`}
                        >
                          {letraAlternativa}
                        </span>
                        {alternativa.replace(/^\(([A-E])\)/, "")}
                      </li>
                    );
                  })}
                </ul>
                <div className="button-feedback-container">
                  <button
                    className="button-responder"
                    onClick={() => handleRespostaClick(question)}
                  >
                    Responder
                  </button>

                  {feedback[question.id] && (
                    <p
                      className={`feedback ${
                        feedback[question.id] === "Você acertou!"
                          ? "acerto"
                          : "erro"
                      }`}
                    >
                      {feedback[question.id] === "Você acertou!"
                        ? "Você acertou!"
                        : `Você errou! A alternativa correta é: ${question.resposta}`}
                    </p>
                  )}
                </div>

                <div className="linha-horizontal-comentario"></div>

                <div className="campo-pai">
                  <div className="campo-comentario">
                    <button
                      className="button-comentario"
                      onClick={() => toggleComentario(question.id)}
                    >
                      {" "}
                      <ChatCenteredText size={14} /> Comentário do Professor
                    </button>

                    <p
                      className={
                        comentariosVisiveis[question.id]
                          ? "comentario visivel"
                          : "comentario"
                      }
                    >
                      {question.comentario}
                    </p>
                  </div>

                  <div className="campo-estatistica">
                    <button
                      className="button-estatisticas"
                      onClick={toggleEstatisticas}
                    >
                      Seu Desempenho
                    </button>

                    {mostrarEstatisticas && (
                      <div className="desempenho-container">
                        {Object.keys(desempenho).map((disciplina) => (
                          <DesempenhoNaDisciplina
                            key={disciplina}
                            disciplina={disciplina}
                            acertos={desempenho[disciplina].acertos}
                            erros={desempenho[disciplina].erros}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
  );
}

export default QuestionCard;