import React, { useState } from "react";
import TaskList from './Components/TaskList';
import "./Components/stylesApp.css";
import clickSound from './Components/clickSound/wrong-password.mp3';

function App() {
  // React Estados
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const clickAudio = new Audio(clickSound)

  // Base de datos de Usuario y Contraseña
  const database = [
    {
      username: "usuario",
      password: "1234"
    },
    {
      username: "usuario2",
      password: "1234"
    }
  ];

  const errors = {
    uname: "usuario no válido",
    pass: "contraseña no válida"
  };

  const handleSubmit = (event) => {
    //Previene actualización de página
    event.preventDefault();

    var { uname, pass } = document.forms[0];

    // Busca usuario sesión
    const userData = database.find((user) => user.username === uname.value);

    // Compara usuario
    if (userData) {
      if (userData.password !== pass.value) {
        // Contraseña no válida
        setErrorMessages({ name: "pass", message: errors.pass });
        clickAudio.play(); // Play the click sound
      } else {
        setIsSubmitted(true);
      }
    } else {
      // Nombre del usuario no encontrado
      setErrorMessages({ name: "uname", message: errors.uname });
      clickAudio.play(); // Play the click sound
    }
  };

  //Genera código JSX para mensaje de error
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  //Código JSX para iniciar sesión 
  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Usuario </label>
          <input type="text" name="uname" required />
          {renderErrorMessage("uname")}
        </div>
        <div className="input-container">
          <label>Contraseña </label>
          <input type="password" name="pass" required />
          {renderErrorMessage("pass")}
        </div>
        <div className="button-container">
          <input type="submit" />
        </div>
      </form>
    </div>
  );

  return (
    <div className="app">
      {isSubmitted ? (
        <TaskList />
      ) : (
        <div className="login-form">
          <div className="title">Iniciar sesión</div>
          {renderForm}
        </div>
      )}
    </div>
  );
  }
  
  export default App;
  