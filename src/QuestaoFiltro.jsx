import React, { useState } from 'react';
import './QuestaoFiltro.css'; // Importar arquivo CSS para estilização
import Select from 'react-select';

function QuestaoFiltro({ onFilterChange, bancas, disciplinas, assuntos, anos, modalidades, areas }) {
  const [selectedBanca, setSelectedBanca] = useState('');
  const [selectedDisciplina, setSelectedDisciplina] = useState('');
  const [selectedAssunto, setSelectedAssunto] = useState('');
  const [selectedAno, setSelectedAno] = useState('');
  const [selectedModalidade, setSelectedModalidade] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [filtersCleared, setFiltersCleared] = useState(false);

  const [selectedDisciplinaIndex, setSelectedDisciplinaIndex] = useState(-1);

 

  

  const handleFilterChange = () => {
    onFilterChange(selectedBanca, selectedDisciplina, selectedAno, selectedModalidade, selectedArea, selectedAssunto);
  };
  
  const handleClearFilters = () => {
  setSelectedBanca('');
  setSelectedDisciplina('');
  setSelectedAssunto('');
  setSelectedAno('');
  setSelectedModalidade('');
  setSelectedArea('');
  
  setSelectedDisciplinaIndex(-1);
  setFiltersCleared(true);
};


  return (
    <div className="filter-container">
      <div className="filter-group">
        <Select className="custom-select"
          id="disciplinaFilter"
          options={disciplinas.map(disciplina => ({ value: disciplina, label: disciplina }))}
          onChange={selectedOption => setSelectedDisciplina(selectedOption.value)}
          value={{ value: selectedDisciplina, label: selectedDisciplina || 'Disciplina' }}
          placeholder="Selecione uma disciplina"
        />
      </div>

      <div className="filter-group">
      <Select className="custom-select"
  id="assuntoFilter"
  options={assuntos.map(assunto => ({ value: assunto, label: assunto }))}
  onChange={selectedOption => setSelectedAssunto(selectedOption.value)}
  value={{ value: selectedAssunto, label: selectedAssunto || 'Assunto' }}
  placeholder="Selecione um assunto"
/>

</div>


      <div className="filter-group">
        <Select className="custom-select"
          id="bancaFilter"
          options={bancas.map(banca => ({ value: banca, label: banca }))}
          onChange={selectedOption => setSelectedBanca(selectedOption.value)}
          value={{ value: selectedBanca, label: selectedBanca || 'Banca' }}
          placeholder="Selecione uma banca"
        />
      </div>

      <div className="filter-group">
        <Select className="custom-select"
          id="anoFilter"
          options={anos.map(ano => ({ value: ano, label: ano }))}
          onChange={selectedOption => setSelectedAno(selectedOption.value)}
          value={{ value: selectedAno, label: selectedAno || 'Ano' }}
          placeholder="Selecione um ano"
        />
      </div>

      <div className="filter-group">
        <Select className="custom-select"
          id="modalidadeFilter"
          options={modalidades.map(modalidade => ({ value: modalidade, label: modalidade }))}
          onChange={selectedOption => setSelectedModalidade(selectedOption.value)}
          value={{ value: selectedModalidade, label: selectedModalidade || 'Modalidade' }}
          placeholder="Selecione uma modalidade"
        />
      </div>

      <div className="filter-group">
        <Select className="custom-select"
          id="areaFilter"
          options={areas.map(area => ({ value: area, label: area }))}
          onChange={selectedOption => setSelectedArea(selectedOption.value)}
          value={{ value: selectedArea, label: selectedArea || 'Área' }}
          placeholder="Selecione uma área"
        />
      </div>

      
      <button className="apply-button" onClick={handleFilterChange}>
  Filtrar Questões
</button>
<button className="clear-button" onClick={handleClearFilters}>
  Limpar Filtros
</button>

      
    </div>
  );
}

export default QuestaoFiltro;
