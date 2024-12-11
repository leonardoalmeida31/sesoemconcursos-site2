import React, { useEffect, useState } from 'react';
import { useUser } from '../../Context/UserContext';
import { format } from 'date-fns';
import { db } from '../../firebase'; // Supondo que você tenha a configuração do Firebase aqui
import { doc, getDoc } from 'firebase/firestore'; // Importando funções do Firestore
import './Perfil.css';
import { Link } from 'react-router-dom';
import { BsArrowLeft } from "react-icons/bs";

function Perfil() {
    const { user, displayName, desempenhoPorDisciplina, paymentInfo } = useUser();
    const [expirationDate, setExpirationDate] = useState(null);

    // Verifica se o usuário está logado e busca a expirationDate
    useEffect(() => {
        const fetchExpirationDate = async () => {
            if (user?.uid) {
                try {
                    // Buscando o documento do usuário no Firestore
                    const userRef = doc(db, "users", user.uid); // Supondo que "users" seja a coleção no Firestore
                    const docSnap = await getDoc(userRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        if (data.expirationDate) {
                            setExpirationDate(data.expirationDate.toDate ? data.expirationDate.toDate() : data.expirationDate);
                        }
                    }
                } catch (error) {
                    console.error("Erro ao buscar dados do usuário:", error);
                }
            }
        };

        fetchExpirationDate();
    }, [user]);

    const performanceEntries = desempenhoPorDisciplina
        ? Object.entries(desempenhoPorDisciplina)
        : [];

    return (
        <div className="perfil-container">
            <div className="perfil-header">
                <Link to="/" className="back-arrow">
                    <BsArrowLeft className="arrow-icon" />
                </Link>
                <h2 className="perfil-title">Perfil do Usuário</h2>
            </div>
            <div className="perfil-card">
                <h3>Informações Pessoais</h3>
                <p><strong>Nome:</strong> {displayName || 'N/A'}</p>
                <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
                <p><strong>WhatsApp:</strong> {user?.whatsapp || 'N/A'}</p>
            </div>

            <div className="perfil-card">
                <h3>Desempenho por Disciplina</h3>
                {performanceEntries.length > 0 ? (
                    <ul>
                        {performanceEntries.map(([disciplina, desempenho]) => (
                            <li key={disciplina}>
                                <strong>{disciplina}:</strong> Acertos - {desempenho.correct || 0},
                                Erros - {desempenho.incorrect || 0}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Sem dados de desempenho disponíveis.</p>
                )}
            </div>

            <div className="perfil-card">
                <h3>Status da Assinatura</h3>
                <p><strong>Assinante:</strong> {paymentInfo ? 'Sim' : 'Não'}</p>

                {/* Exibe a data de expiração se paymentInfo existir e expirationDate for válida */}
                {paymentInfo && expirationDate ? (
                    <p><strong>Data de Expiração:</strong> {format(expirationDate, 'dd/MM/yyyy HH:mm:ss')}</p>
                ) : (
                    <p><strong>Data de Expiração:</strong> Nenhuma data disponível</p>
                )}
            </div>
        </div>
    );
}

export default Perfil;


