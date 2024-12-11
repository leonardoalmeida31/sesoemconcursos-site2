import React, { useEffect, useState } from 'react';
import { auth, db, app } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import HeaderMain from '../../components/Header/HeaderMain';
import { Table } from 'react-bootstrap';
import { getDocs, collection, getFirestore, doc, updateDoc } from 'firebase/firestore';
import { ref, get, getDatabase,  } from 'firebase/database';

const Adm = () => {
    const [user, setUser] = useState(null);
    const [usersData, setUsersData] = useState([]);
    const [activeSubscribers, setActiveSubscribers] = useState([]);
    const [questoesData, setQuestoesData] = useState({});
    const navigate = useNavigate();
    const db = getFirestore();
    const usersCollectionRef = collection(db, "users");
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setLoading(false);
            if (currentUser) {
                setUser(currentUser);
                if (currentUser.email === 'projetos206@gmail.com' && currentUser.email === 'leonardoalmeida10515@gmail.com'){
                    navigate('/');
                }
            } else {
                setUser(null);
                navigate('/login');
            }
        });

        

            const fetchUserData = async () => {
                try {
                    const usersSnapshot = await getDocs(usersCollectionRef);
                    const users = usersSnapshot.docs.map(doc => doc.data());
                    setUsersData(users);


                    const activeUsers = users.filter(user => {
                        const currentDate = new Date();


                        if (user.paymentInfo && user.paymentInfo !== null && user.expirationDate) {
                            let expirationDate;
                            if (user.expirationDate && user.expirationDate.toDate) {
                                expirationDate = user.expirationDate.toDate(); 
                            } else if (user.expirationDate instanceof Date) {
                                expirationDate = user.expirationDate; 
                            } else {
                                console.log("expirationDate inválido para:", user.email);
                                expirationDate = null; 
                            }


                            return expirationDate && expirationDate > currentDate;
                        }
                        return false; 
                    });

                    setActiveSubscribers(activeUsers);

                    const questionsRef = ref(getDatabase(app), "questions");
                    const snapshot = await get(questionsRef);
                    if (snapshot.exists()) {
                        const questoesData = snapshot.val();
                        const bancasAnos = Object.keys(questoesData).map(id => ({
                            banca: questoesData[id].banca,
                            ano: questoesData[id].ano,
                            acertos: questoesData[id].acertos || 0,
                            erros: questoesData[id].erros || 0,
                        }));

                        const uniqueBancasAnos = Array.from(new Set(bancasAnos.map(item => `${item.banca}-${item.ano}`)))
                            .map(bancaAno => {
                                const [banca, ano] = bancaAno.split('-');
                                return { banca, ano };
                            });

                        setQuestoesData({
                            totalQuestoes: Object.keys(questoesData).length,
                            bancasAnos: uniqueBancasAnos,
                        });
                    } else {
                        console.log("No questions data found");
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchUserData();

            return () => unsubscribe();
        }, [navigate]);


    if (loading) {
        return <div>Carregando...</div>;
    }

    if (!user) {
        return <div>Você não está autenticado. Redirecionando...</div>;
    }

    const customPages = [
        { name: 'Cadastrar Evento Etica', path: '/CadastroEventoEtica' },
        { name: 'Cadastrados Evento Etica', path: '/CadastradosEventoEtica' },
        { name: 'Cadastrar Questões', path: '/CadastroQuestoes' },
        { name: 'Usuarios', path: '/Usuarios' },
        { name: 'Contador Assinantes', path: '/ContadorAssinantes'},
    ];

    return (
        <div style={styles.container}>
            <HeaderMain pages={customPages} />
            <h1 style={styles.pageTitle}>Página Administrativa</h1>
            <p style={styles.welcomeMessage}>Bem-vindo, {user.displayName}</p>

            <div style={styles.dashboard}>
                {/* Stat Cards - lado a lado */}
                <div style={styles.stats}>
                    <div style={styles.statCard}>
                        <h3 style={styles.statTitle}>Total de Assinantes Ativos</h3>
                        <p style={styles.statCount}>{activeSubscribers.length}</p>
                    </div>
                    <div style={styles.statCard}>
                        <h2 style={styles.statTitle}>Total de Usuários</h2>
                        <p style={styles.statCount}>{usersData.length}</p>
                    </div>
                </div>

                <div style={styles.subscribersSection}>
                    <h3 style={styles.sectionTitle}>Assinantes Ativos</h3>
                    <Table striped bordered hover className="subscribers-table" style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.tableHeader}>Nome do Usuário</th>
                                <th style={styles.tableHeader}>Email</th>
                                <th style={styles.tableHeader}>Data de Expiração</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeSubscribers.length > 0 ? (
                                activeSubscribers.map((subscriber, index) => (
                                    <tr key={index}>
                                        <td style={styles.tableCell}>{subscriber.displayName}</td>
                                        <td style={styles.tableCell}>{subscriber.email}</td>
                                        <td style={styles.tableCell}>
                                            {subscriber.expirationDate && subscriber.expirationDate.toDate
                                                ? subscriber.expirationDate.toDate().toLocaleDateString()
                                                : 'Data inválida'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" style={styles.tableEmptyMessage}>Nenhum assinante ativo encontrado.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>

                <div style={styles.questionsSection}>
                    <h3 style={styles.sectionTitle}>Total de Questões no Banco</h3>
                    <div style={styles.statCard}>

                        <h2 style={styles.statTitle}>Total de questões:</h2>
                        <p style={styles.statCount}>{questoesData.totalQuestoes}</p>

                    </div>

                    <Table striped bordered hover style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.tableHeader}>Ano</th>
                                <th style={styles.tableHeader}>Bancas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(questoesData.bancasAnos) && questoesData.bancasAnos.length > 0 ? (
                                Object.entries(
                                    questoesData.bancasAnos.reduce((acc, item) => {
                                        const year = item.ano;
                                        if (!acc[year]) {
                                            acc[year] = [];
                                        }
                                        acc[year].push(item.banca);
                                        return acc;
                                    }, {})
                                ).map(([year, bancas], index) => (
                                    <tr key={index}>
                                        <td style={styles.tableCell}>{year}</td>
                                        <td style={styles.tableCell}>
                                            <div style={styles.bancasWrapper}>
                                                {bancas.map((banca, index) => (
                                                    <span key={index} style={styles.bancaItem}>
                                                        {banca}
                                                        {index < bancas.length - 1 && <span style={styles.separator}>|</span>}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" style={styles.tableEmptyMessage}>Nenhuma questão encontrada.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>




    );
};

export default Adm;

const styles = {
    container: {
        padding: '20px',
        backgroundColor: '#f4f7fc',
        fontFamily: 'Arial, sans-serif',
    },
    pageTitle: {
        fontSize: '2rem',
        color: '#333',
        marginBottom: '10px',
        textAlign: 'center',
    },
    welcomeMessage: {
        fontSize: '1.2rem',
        color: '#555',
        textAlign: 'center',
    },
    dashboard: {
        display: 'flex',
        flexDirection: 'column',
        gap: '30px', // Espaco entre as seções
        marginTop: '20px',
    },
    stats: {
        display: 'flex',
        justifyContent: 'space-between',  // Para os cartões ficarem lado a lado
        gap: '20px',  // Espaço entre os cartões
    },
    statCard: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '48%',  // Reduz o tamanho para caber lado a lado
        textAlign: 'center',
    },
    statTitle: {
        fontSize: '1.5rem',
        color: '#333',
    },
    statCount: {
        fontSize: '2rem',
        color: '#007bff',
        fontWeight: 'bold',
    },
    subscribersSection: {
        marginTop: '30px',
    },
    sectionTitle: {
        fontSize: '1.8rem',
        color: '#333',
        marginBottom: '10px',
    },
    table: {
        width: '100%',
        marginTop: '15px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    tableHeader: {
        textAlign: 'center',
        padding: '12px',
        backgroundColor: '#007bff',
        color: '#fff',
    },
    tableCell: {
        textAlign: 'center',
        padding: '10px',
        borderBottom: '1px solid #ddd',
    },
    tableEmptyMessage: {
        textAlign: 'center',
        padding: '10px',
        color: '#888',
        fontStyle: 'italic',
    },
    bancasWrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    bancaItem: {
        whiteSpace: 'nowrap',
        marginRight: '10px',
    },
    separator: {
        margin: '0 5px',
        color: '#555',
    },
    questionCount: {
        fontSize: '1.2rem',
        color: '#555',
    },
};

