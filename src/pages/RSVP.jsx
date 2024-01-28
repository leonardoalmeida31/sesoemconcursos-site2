import React, { useState } from 'react';
import './RSVP.css';

function RSVP() {
  const [name, setName] = useState('');
  const [isAttending, setIsAttending] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Obrigado, ${name}, sua presença ${isAttending ? 'será' : 'não será'} registrada.`);
    // Aqui você pode adicionar a lógica para salvar essas informações no seu banco de dados
  };

  return (
    <div className="rsvp">
      <form onSubmit={handleSubmit}>
        <label>
          Nome:
          <input type="text" value={name} onChange={e => setName(e.target.value)} required />
        </label>
        <label>
          Vai comparecer ao casamento?
          <select value={isAttending} onChange={e => setIsAttending(e.target.value === 'true')}>
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </select>
        </label>
        <input type="submit" value="Enviar" />
      </form>
    </div>
  );
}

export default RSVP;
