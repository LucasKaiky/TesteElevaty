import './App.css';
import React, { useState } from 'react';
import Table from './componentes/Table/Table';
function App() {

  return (
    <div className="App">
      <h1 className="Titulo">
        Consultar Clientes
        <hr />
      </h1>
      <Table/>
    </div>
  )
}

export default App;
