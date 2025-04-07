import { Typography, Container, Box, List, ListItem, ListItemText, Button } from '@mui/material';
import { styled } from '@mui/system';

function Mentorias() {
  

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

    return (
        <Container>
            <Box sx={{ backgroundColor: '#1c5253', justifyContent: 'center', fontFamily: 'Poppins, sans-serif', padding: '3em', borderBottomRightRadius: '3em', borderBottomStyle: 'solid', borderBottomColor: '#48c2c8', borderBottomWidth: '10px' }}>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '700', fontSize: '1.7em', color: 'white' }}>
                    MENTORIA PERSONALIZADA <br></br> SESO EM CONCURSOS
                </Typography>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', paddingTop: '2em', fontWeight: '500', fontSize: '1em', color: 'white' }}>
                    DESCUBRA COMO OS CONCURSEIROS DE ALTO DESEMPENHO QUE SÃO APROVADOS EM CONCURSOS DE SERVIÇO SOCIAL ESTUDAM
                </Typography>
            </Box>
            <Box sx={{
                borderStyle: 'solid',
                borderColor: '#48c2c8',
                borderWidth: '2px',
                borderRadius: '8px',
                padding: '20px', marginTop: '20px', backgroundColor: '#f0f0f0', justifyContent: 'center', paddingTop: '2em', fontFamily: 'Poppins, sans-serif'
            }}>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '500', fontSize: '1.1em', }}>
                    Você quer ser aprovado em concursos de serviço social? Descubra o método que já ajudou mais de 262 ASSISTENTES SOCIAIS a realizarem esse sonho.<Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '400', fontSize: '1em', paddingTop: '2em' }}>Você já se sentiu frustrado por estudar horas e horas e não ver resultados nos concursos de serviço social? Você já se perguntou por que alguns candidatos parecem ter mais facilidade para aprender e se destacar nas provas? Você já sonhou em ter uma mentoria personalizada que te ensinasse tudo o que você precisa saber para passar em qualquer concurso?</Typography>
                </Typography>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '500', fontSize: '1em', paddingTop: '2em' }}>Se você respondeu sim a alguma dessas perguntas, então você está no lugar certo. Nesta página, você vai descobrir como a Mentoria de Grupo - SESO em Concursos pode te ajudar a alcançar o seu objetivo de ser aprovado em concursos de serviço social.</Typography>
            </Box>
            <Box
                sx={{
                    borderStyle: 'solid', borderColor: '#48c2c8', borderWidth: '2px', borderRadius: '8px', padding: '20px', marginTop: '20px', backgroundColor: '#f0f0f0', justifyContent: 'center', paddingTop: '2em', fontFamily: 'Poppins, sans-serif', backgroundImage: 'linear-gradient(to right, #1c5253, #1c7475)',
                }}  >
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '600', fontSize: '1.2em', color: 'white' }}>PARA QUEM SERVE A MENTORIA?</Typography>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '500', fontSize: '1em', paddingTop: '2em', color: 'white' }}>Para você que está começando agora no mundo dos concursos de Serviço Social e se sente perdida, frustrada ou desmotivada a respeito de como estudar para concursos da sua área.</Typography>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '500', fontSize: '1em', paddingTop: '2em', color: 'white' }}>Ou para você que já tem experiência nos estudos para concursos, mas que deseja apronfundar sua preparação conhecendo novos métodos de estudos que te possibilitam te capacitar para concursos de níveis mais altos</Typography>
            </Box>
            <Box sx={{
                borderStyle: 'solid',
                borderColor: '#48c2c8',
                borderWidth: '2px',
                borderRadius: '8px',
                padding: '20px', marginTop: '20px', backgroundColor: '#f0f0f0', justifyContent: 'center', paddingTop: '2em', fontFamily: 'Poppins, sans-serif'
            }}>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '600', fontSize: '1.2em', }}>POR QUE DEVO ME INSCREVER NA MENTORIA PERSONALIZADA - SESO EM CONCURSOS?</Typography>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '500', fontSize: '1em', paddingTop: '2em' }}>Esta é uma mentoria diferente de todas as outras que você possa conhecer. Não vamos te passar mais um curso de vídeo aulas. Você não vai receber mais um preparatório.Você não vai receber um plano de estudos genérico, muito menos apostilas de estudos com textos difíceis de entender.</Typography>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '500', fontSize: '1em', paddingTop: '2em' }}>Na nossa mentoria vamos entregar tudo que você precisa para ser aprovada no seu concurso.</Typography>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '500', fontSize: '1em', paddingTop: '2em' }}>FAZEMOS UM PREPARATÓRIO PERSONALIZADO DE ACORDO O SEU EDITAL E O SEU NÍVEL DE CONHECIMENTO.</Typography>
            </Box>
            <Box
                sx={{
                    borderStyle: 'solid', borderColor: '#48c2c8', borderWidth: '2px', borderRadius: '8px', padding: '20px', marginTop: '20px', backgroundColor: '#f0f0f0', justifyContent: 'center', paddingTop: '2em', fontFamily: 'Poppins, sans-serif', backgroundImage: 'linear-gradient(to right, #1c5253, #1c7475)',
                }}  >
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '600', fontSize: '1.2em', color: 'white' }}>COMO FUNCIONA A MENTORIA?</Typography>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '500', fontSize: '1em', paddingTop: '2em', color: 'white' }}>A mentoria será realizada em vídeo aulas ao vivo com o concurseiro via google meet e também com aulas gravadas dos nossos cursos. Os encontros serão através da plataforma Google Meet. Sendo 1 encontro por semana e às vezes 2 encontros de acordo a disponibilidade</Typography>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '500', fontSize: '1em', paddingTop: '2em', color: 'white' }}>Não se preocupe! Todos os encontros ficarão gravados e você terá acesso a todos eles posteriormente para os assistir</Typography>
            </Box>

            <Box
                sx={{
                    borderStyle: 'solid', borderColor: '#48c2c8', borderWidth: '2px', borderRadius: '8px', padding: '20px', marginTop: '20px', backgroundColor: '#f0f0f0', justifyContent: 'center', paddingTop: '2em', fontFamily: 'Poppins, sans-serif', backgroundImage: 'linear-gradient(to right, #1c5253, #1c7475)',
                }}  >
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '600', fontSize: '1.2em', color: 'white' }}>COMO ADQUIRIR?</Typography>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '500', fontSize: '1em', paddingTop: '2em', color: 'white' }}>MENTORIA CONHECIMENTOS ESPECIFÍCOS DE SERVIÇO SOCIAL</Typography>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '500', fontSize: '1em', paddingTop: '2em', color: 'white' }}>PARA TODOS OS CONCURSOS DE SERVIÇO SOCIAL SOMENTE PARTE DO EDITAL DE CONHECEIMENTOS ESPECIFÍCOS DO CARGO</Typography>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '500', fontSize: '1em', paddingTop: '2em', color: 'white' }}>ACOMPANHAMENTO DO PLANEJAMENTO DE ESTUDOS</Typography>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '500', fontSize: '1em', paddingTop: '2em', color: 'white' }}>AULAS AO VIVO DO CONTEÚDO DO EDITAL</Typography>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '500', fontSize: '1em', paddingTop: '2em', color: 'white' }}>MÉTODOS DE ESTUDOS PARA GABARITAR EM QUALQUER LEI OU DISCIPLINA</Typography>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '500', fontSize: '1em', paddingTop: '2em', color: 'white' }}>A PARTIR DE R$ 299,90</Typography>
            </Box>

            <Box
                sx={{
                    borderStyle: 'solid', borderColor: '#48c2c8', borderWidth: '2px', borderRadius: '8px', padding: '20px', marginTop: '20px', backgroundColor: '#f0f0f0', justifyContent: 'center', paddingTop: '2em', fontFamily: 'Poppins, sans-serif', backgroundImage: 'linear-gradient(to right, #1c5253, #1c7475)',
                }}  >
              
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '500', fontSize: '1em', paddingTop: '2em', color: 'white' }}>MENTORIA COMPLETA PARA CONCURSOS DE SERVIÇO SOCIAL</Typography>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '500', fontSize: '1em', paddingTop: '2em', color: 'white' }}>TODOS OS CONTEÚDOS DO SEU EDITAL (PORTUGUÊS, INFORMÁTICA E LEGISLAÇÃO)</Typography>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '500', fontSize: '1em', paddingTop: '2em', color: 'white' }}>DESCUBRA COMO ESTUDAR PARA QUALQUER CONCURSO DE SERVIÇO SOCIAL</Typography>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '500', fontSize: '1em', paddingTop: '2em', color: 'white' }}>TODOS OS NOSSOS CURSOS LIBERADOS DE FORMA VITALÍCIA</Typography>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '500', fontSize: '1em', paddingTop: '2em', color: 'white' }}>ACOMPANHAMENTO DO PLANEJAMENTO DE ESTUDOS</Typography>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '500', fontSize: '1em', paddingTop: '2em', color: 'white' }}>AULAS AO VIVO DO CONTEÚDO DO EDITAL</Typography>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '500', fontSize: '1em', paddingTop: '2em', color: 'white' }}>MÉTODOS DE ESTUDOS PARA GABARITAR EM QUALQUER LEI OU DISCIPLINA</Typography>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '500', fontSize: '1em', paddingTop: '2em', color: 'white' }}>A PARTIR DE R$ 599,90</Typography>
            </Box>
        
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
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '600', fontSize: '1.2em', }}>RESTAM APENAS 7 VAGAS!</Typography>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '500', fontSize: '1em', paddingTop: '2em' }}>A nossa mentoria terá um número limitado de inscritos, por isso ENTRE EM CONTATO AGORA!
                </Typography>
            
                <Button
                    variant="contained"
                    color="primary"
                    component="a"
                    href="https://wa.me/5574981265381?text=Ol%C3%A1%2C+Quero+informa%C3%A7%C3%B5es+sobre+a+Mentoria"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginTop: "1em", justifyContent: "center" }}
                >
                    Toque aqui para mais Informações
                </Button>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', fontWeight: '500', fontSize: '1em', paddingTop: '2em' }}></Typography>

            </Box>
        </Container>
    )
}

export default Mentorias;