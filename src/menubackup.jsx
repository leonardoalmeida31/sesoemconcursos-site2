import React from 'react';
import './Menu.css';
import { Link } from 'react-router-dom'; // Importe Link do React Router

const Menu2 = () => {
  return (
    <nav className="menu">
      <ul className="menu-list">
        <li className="menu-item"><Link to="/">Início</Link></li>
        <li className="menu-item"><Link to="/">Questões</Link></li>
        <li className="menu-item"><Link to="/">Conheça o Método</Link></li>
        <li className="menu-item"><Link to="/Plano-Estudos">Planos de Estudos</Link></li>
        
      </ul>
    </nav>
  );
}

export default Menu2;