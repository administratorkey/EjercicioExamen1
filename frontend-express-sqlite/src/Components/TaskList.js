import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './stylesTaskList.css';
import Clock from './clock';
import JsonImporter from './JsonImporter';
import WindowScreen from './WindowScreen';
import { saveTaskIdsToDB } from './db';
import clickSound from './clickSound/click-sound.mp3';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const clickAudio = new Audio(clickSound);

  const getTasks = async () => {
    const response = await fetch('http://localhost:8000/tarefa/');
    const tasks = await response.json();
    setTasks(tasks);
  };

  const addTask = async () => {
    const task = { descripcion: newTaskDescription, completada: false };
    clickAudio.play();
    const response = await fetch('http://localhost:8000/tarefa/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    });
    const result = await response.text();
    console.log('Add task result:', result);
    setNewTaskDescription('');
    getTasks();
  };

  const updateTask = async (task) => {
    const response = await fetch('http://localhost:8000/tarefa/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    });
    const result = await response.text();
    console.log('Update task result:', result);
    getTasks();
  };

  const deleteTask = async (taskId) => {
    const response = await fetch('http://localhost:8000/tarefa/', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: taskId })
    });
    const result = await response.text();
    console.log('Delete task result:', result);
    getTasks();
  };

  const deleteAllTasks = async () => {
    const response = await fetch('http://localhost:8000/tarefa/', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    const result = await response.text();
    console.log('Delete all tasks result:', result);
    getTasks();
  };

  const handleExportClick = () => {
    saveTaskIdsToDB(tasks);
  };

  useEffect(() => {
    getTasks();
  }, []);

  const filteredTasks = tasks.filter(task => task.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleImport = (jsonData) => {
    const newWindow = window.open();
    newWindow.document.body.innerHTML = `
    <div id="window-screen"></div>
    `;
    

    ReactDOM.render(<WindowScreen jsonData={jsonData} />, newWindow.document.getElementById('window-screen'));
    
  };

  

  
    return (
      
      <div className="appTaskList">
      <Clock />
      <p></p>
      <h1>LISTA DE TAREAS</h1>

      <div>
        <label className="thick" htmlFor="new-task-input">Introducir tarea </label>
        <input className="myInput" type="text" id="new-task-input" value={newTaskDescription} onChange={(e) => setNewTaskDescription(e.target.value)} />
        <button className="AgregarTarea-btn" onClick={addTask}>Agregar Tarea</button>
        <button className="BorrarTodo-btn" onClick={deleteAllTasks}>Borrar tareas</button>
        <input className="myInput2" type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar tareas" size="21" />
        <p></p>
        <button className="ExportarIDs-btn" onClick={handleExportClick}>Exportar</button>
        <JsonImporter onImport={handleImport} />
      </div>

      <ul>
  {filteredTasks.map((task) => (
    <li key={task.id}>
      <input
        type="checkbox"
        checked={task.completada}
        onChange={() => updateTask({ ...task, completada: !task.completada })}
      />
      <span style={{color: task.completada ? 'red' : 'black'}}>
        {task.descripcion}
      </span>
      <button className="borrar-btn" onClick={() => deleteTask(task.id)}>Borrar</button>
    </li>
  ))}
</ul>
</div>
);
}



export default TaskList;
