import React from 'react';

function WindowScreen({ jsonData }) {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: 'black',
  };

  const contentStyle = {
    backgroundColor: 'yellowgreen',
    padding: '20px',
    borderRadius: '5px',
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <h1><u>TAREAS IMPORTADAS</u></h1>
        <ul>
          {jsonData.map((task) => (
            <li key={task.descripcion}>
              <input type="checkbox" checked={task.completada} readOnly />
              <span>{task.descripcion}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default WindowScreen;
