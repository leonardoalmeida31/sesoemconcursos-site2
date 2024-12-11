/* eslint-disable react/prop-types */
import React from "react";
import { Box, Typography } from "@mui/material";
import ContentCutRoundedIcon from "@mui/icons-material/ContentCutRounded";
import "../../App.css"

function QuestaoResposta({
    question,
    alternativaSelecionada,
    alternativasRiscadasPorQuestao,
    handleAlternativaClick,
    handleRiscarAlternativa,
    paymentInfo,
    handleRespostaClick,
    cliques,
    feedbackLocal,
    fontSize
}) {


    return (
        <>
            <ul>
                {question.alternativas.map((alternativa, index) => {
                    const letraAlternativa =
                        alternativa.match(/^\(([A-E])\)/)[1];
                    const isSelected =
                        alternativaSelecionada[question.ids] === index;
                    const isRiscada =
                        alternativasRiscadasPorQuestao[question.ids]?.[index] ||
                        false;

                    return (
                        <Typography sx={{ margin: '0.500em', fontFamily: 'Poppins, Arial', padding: '0.300em', color: 'black', fontSize: `${fontSize}em`, marginBottom: '0.8em' }}
                            className={`alternativa ${isSelected ? "selecionada" : ""} ${isRiscada ? "riscado" : ""}`}
                            key={index}
                            onClick={() => handleAlternativaClick(question.ids, index)}
                        >
                            <Box
                                className={`icon-container ${isRiscada ? "riscado" : ""}`}
                            >
                                <ContentCutRoundedIcon style={{ color: '#1c5253', fontSize: "small", }}
                                    className={`tesoura-icon ${isRiscada ? "riscado" : ""}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRiscarAlternativa(question.ids, index);
                                    }}
                                />
                            </Box>

                            <span
                                className={`letra-alternativa-circle ${isSelected ? "selecionada" : ""} `}
                                style={{
    fontSize: `${fontSize}em`, 
  }}
                            >
                                {letraAlternativa}
                            </span>
                            <span dangerouslySetInnerHTML={{ __html: alternativa.replace(/^\(([A-E])\)/, "") }} />
                        </Typography>

                    );
                })}
            </ul>
            <div className="button-feedback-container">
                <button
                    className="button-responder"
                    onClick={() => handleRespostaClick(question)}
                    disabled={
                        (paymentInfo === null || paymentInfo === 0) &&
                        cliques >= 15
                    }
                >
                    Responder
                </button>

                {feedbackLocal[question.ids] && (
                    <div className="feedback-local">
                        {feedbackLocal[question.ids].resultado ? (
                            <p className="resposta-correta">Você acertou!</p>
                        ) : (
                            <p className="resposta-incorreta">
                                Você errou! Resposta correta: {feedbackLocal[question.ids].respostaCorreta}
                            </p>
                        )}
                    </div>
                )}

            </div>
        </>
    );
}

export default QuestaoResposta;
