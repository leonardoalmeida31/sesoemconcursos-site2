import React from 'react';
import { Typography, Container, Box, List, ListItem, ListItemText, Button } from '@mui/material';
import { styled } from '@mui/system';

const Modulos = [
    'Como estudar para concursos de Serviço Social: Aquilo que os preparatórios não ensinam você aprende aqui.',
    'Não caia em furada! Quais métodos de estudos funcionam e quais não funcionam?',
    'Como estudar e não esquecer o que estudou - parte 1.',
    'Como estudar e não esquecer o que estudou - parte 2.',
    'Como estudar legislação para concursos de serviço social',
    'Como estudar português para concursos de serviço social',
    'Como estudar matemática e informática para concursos de serviço social',
    'Como estudar e aprender legislação de Serviço Social',
    'Como estudar e aprender a respeito dos artigos e livros de conhecimentos específicos de Serviço Social',
    'Como estudar por questões e aprender de verdade.',
    'Por que não consigo ser aprovado: Como ter disciplina, foco, estratégia e motivação para passar em qualquer concurso',
    'Como encontrar provas anteriores de bancas que não disponibilizam provas. (Bônus)',
    'Respondendo dúvidas e analisando os concursos dos mentorados'
];

const StyledContainer = styled(Container)({
    textAlign: 'center',
    paddingTop: '15px',
   
});


const StyledBox = styled(Box)({
    backgroundColor: '#f4f4f4',
    padding: '10px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    marginBottom: '20px',
});

const StyledList = styled(List)({
    padding: 0,
});

const StyledListItem = styled(ListItem)(({ theme }) => ({
    borderRadius: '10px',
    backgroundColor: 'white',
    margin: '10px 0',
    '&:hover': {
        backgroundColor: '#48c2c8',
    },
}));

const StyledListItemText = styled(ListItemText)({
    textAlign: 'center',
    color: 'black',
    fontSize: '1em',
    padding: '15px',
});

function App() {
    return (
        <Container>
            <Box sx={{ backgroundColor: '#1c5253',justifyContent: 'center', fontFamily: 'Poppins, sans-serif', padding: '3em', borderBottomRightRadius: '3em', borderBottomStyle: 'solid', borderBottomColor: '#48c2c8', borderBottomWidth: '10px'  }}>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '700', fontSize: '1.7em', color: 'white' }}>
                    MENTORIA DE GRUPO - SESO EM CONCURSOS
                </Typography>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', paddingTop: '2em', fontWeight: '500', fontSize: '1em', color: 'white' }}>
                    DESCUBRA COMO OS CONCURSEIROS DE ALTO DESEMPENHO QUE SÃO APROVADOS EM CONCURSOS DE SERVIÇO SOCIAL ESTUDAM
                </Typography>

            </Box>
            <Box sx={{ borderStyle: 'solid', 
      borderColor: '#48c2c8',
      borderWidth: '2px', 
      borderRadius: '8px', 
      padding: '20px' ,marginTop: '20px' ,backgroundColor: '#f0f0f0',justifyContent: 'center', paddingTop: '2em', fontFamily: 'Poppins, sans-serif' }}>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '500', fontSize: '1.1em', }}>
                    Você quer ser aprovado em concursos de serviço social? Descubra o método que já ajudou mais de 262 ASSISTENTES SOCIAIS a realizarem esse sonho.<Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '400', fontSize: '1em', paddingTop: '2em' }}>Você já se sentiu frustrado por estudar horas e horas e não ver resultados nos concursos de serviço social? Você já se perguntou por que alguns candidatos parecem ter mais facilidade para aprender e se destacar nas provas? Você já sonhou em ter uma mentoria personalizada que te ensinasse tudo o que você precisa saber para passar em qualquer concurso?</Typography>
                </Typography>

                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '500', fontSize: '1em', paddingTop: '2em' }}>Se você respondeu sim a alguma dessas perguntas, então você está no lugar certo. Nesta página, você vai descobrir como a Mentoria de Grupo - SESO em Concursos pode te ajudar a alcançar o seu objetivo de ser aprovado em concursos de serviço social.</Typography>


            </Box>
             <Box
      sx={{borderStyle: 'solid', borderColor: '#48c2c8', borderWidth: '2px',  borderRadius: '8px',  padding: '20px', marginTop: '20px', backgroundColor: '#f0f0f0', justifyContent: 'center',  paddingTop: '2em',  fontFamily: 'Poppins, sans-serif', backgroundImage: 'linear-gradient(to right, #1c5253, #1c7475)',
      }}  >
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '600', fontSize: '1.2em', color: 'white' }}>PARA QUEM SERVE A MENTORIA?</Typography>

                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '500', fontSize: '1em', paddingTop: '2em', color: 'white' }}>Para você que está começando agora no mundo dos concursos de Serviço Social e se sente perdida, frustrada ou desmotivada a respeito de como estudar para concursos da sua área.</Typography>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '500', fontSize: '1em', paddingTop: '2em', color: 'white' }}>Ou para você que já tem experiência nos estudos para concursos, mas que deseja apronfundar sua preparação conhecendo novos métodos de estudos que te possibilitam te capacitar para concursos de níveis mais altos</Typography>

            </Box>

            <Box sx={{ borderStyle: 'solid', 
      borderColor: '#48c2c8',
      borderWidth: '2px', 
      borderRadius: '8px', 
      padding: '20px' ,marginTop: '20px' ,backgroundColor: '#f0f0f0',justifyContent: 'center', paddingTop: '2em', fontFamily: 'Poppins, sans-serif' }}>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '600', fontSize: '1.2em',  }}>POR QUE DEVO ME INSCREVER NA MENTORIA DE GRUPO - SESO EM CONCURSOS?</Typography>

                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '500', fontSize: '1em', paddingTop: '2em' }}>Esta é uma mentoria diferente de todas as outras que você possa conhecer. Não vamos te passar mais um curso de vídeo aulas. Você não vai receber mais um preparatório.Você não vai receber um plano de estudos genérico, muito menos apostilas de estudos com textos difíceis de entender.</Typography>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '500', fontSize: '1em', paddingTop: '2em' }}>Na nossa mentoria vamos fazer o que os cursinhos e preparatórios de concursos não querem te ensinar e muito menos desejam que você saiba. Vamos te mostrar e te ensinar de verdade a como estudar para concursos de Serviço Social de forma autônoma sem depender nunca mais de cursos preparatórios. SIM, É ISSO MESMO! AO REALIZAR A NOSSA MENTORIA COMPLETA VOCÊ VAI APRENDER TUDO SOBRE COMO ESTUDAR PARA CONCURSOS E NUNCA MAIS VAI PRECISAR GASTAR R$ 1 REAL EM CURSOS PREPARATÓRIOS, APOSTILAS, AULAS, MAPAS MENTAIS E OUTROS MATERIAIS.</Typography>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '500', fontSize: '1em', paddingTop: '2em' }}>VOCÊ TERÁ CONHECIMENTO PARA ESTUDAR SOZINHO(A) E SER CAPAZ DE PASSAR EM QUALQUER CONCURSO QUE ESTUDAR.</Typography>

            </Box>

             <Box
      sx={{borderStyle: 'solid', borderColor: '#48c2c8', borderWidth: '2px',  borderRadius: '8px',  padding: '20px', marginTop: '20px', backgroundColor: '#f0f0f0', justifyContent: 'center',  paddingTop: '2em',  fontFamily: 'Poppins, sans-serif', backgroundImage: 'linear-gradient(to right, #1c5253, #1c7475)',
      }}  >
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '600', fontSize: '1.2em',  color: 'white' }}>COMO FUNCIONA A MENTORIA DE GRUPO?</Typography>

                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '500', fontSize: '1em', paddingTop: '2em', color: 'white' }}>A mentoria será realizada em 13 encontros ao vivo, nos quais traremos todo o conteúdo que você precisa para se preparar para concursos. Os encontros serão através da plataforma Google Meet. Sendo 1 encontro por semana e às vezes 2 encontros de acordo a disponibilidade</Typography>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '500', fontSize: '1em', paddingTop: '2em', color: 'white' }}>Não se preocupe! Todos os encontros ficarão gravados e você terá acesso a todos eles posteriormente para os assistir</Typography>

            </Box>    
        
        <StyledContainer sx={{borderStyle: 'solid', borderColor: '#48c2c8', borderWidth: '2px',  borderRadius: '8px',  padding: '20px', marginTop: '20px', backgroundColor: '#f0f0f0', justifyContent: 'center',  paddingTop: '2em',  fontFamily: 'Poppins, sans-serif', backgroundImage: 'linear-gradient(to right, #1c5253, #1c7475)',
      }}  >
          
            <StyledBox sx={{borderStyle: 'solid', borderColor: '#48c2c8', borderWidth: '2px',  borderRadius: '8px',  padding: '20px', marginTop: '20px', backgroundColor: '#f0f0f0', justifyContent: 'center',  paddingTop: '2em',  fontFamily: 'Poppins, sans-serif', backgroundImage: 'linear-gradient(to right, #1c5253, #1c7475)',
      }}  >
                <StyledList>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '600', fontSize: '1.2em', paddingBottom: '2em', color: 'white' }}>
                CONFIRA OS MÓDULOS DA MENTORIA:
            </Typography>
                    {Modulos.map((modulo, index) => (
                        <StyledListItem key={index}>
                            <StyledListItemText primary={`${index + 1}. ${modulo}`} />
                        </StyledListItem>
                    ))}
                </StyledList>
            </StyledBox>
        </StyledContainer>
        <Box sx={{
      borderStyle: 'solid',
      borderColor: '#48c2c8',
      borderWidth: '2px',
      borderRadius: '8px',
      padding: '20px',
      marginTop: '20px',
      backgroundColor: '#f0f0f0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      fontFamily: 'Poppins, sans-serif',
    }}>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '600', fontSize: '1.2em',  }}>RESTAM APENAS 11 VAGAS!</Typography>

                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '500', fontSize: '1em', paddingTop: '2em' }}>A nossa mentoria terá um número limitado de inscritos, por isso corra para entrar no grupo e se inscrever para participar dessa turma
                    </Typography>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '500', fontSize: '1em', paddingTop: '2em' }}>ENTRE NO GRUPO DO WHATSAPP PARA PARTICIPAR DA MENTORIA. Lá você saberá de todos os detalhes dos encontros e receberá seu acesso.</Typography>
               

                <Button
          variant="contained"
          color="primary"
          component="a"
          href="https://chat.whatsapp.com/BJmFHuqDVn56S28TIZJ8A0"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginTop: "1em", justifyContent: "center" }}
        >
          Toque aqui para entrar no Grupo
        </Button>
        <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '500', fontSize: '1em', paddingTop: '2em' }}></Typography>

            </Box>
        </Container>
    );
}

export default App;
