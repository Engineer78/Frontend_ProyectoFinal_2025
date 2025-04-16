import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/loginform.module.css';
import "material-icons/iconfont/material-icons.css";

/// Este componente es un formulario de inicio de sesión
/// que permite a los usuarios ingresar su nombre de usuario y contraseña.
const LoginForm = () => {

    // se definen los estados para el nombre de usuario y la contraseña
    // y la visibilidad de la contraseña
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // se define la función para manejar la visibilidad de la contraseña
    // y se cambia el estado de la contraseña visible a no visible
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
      };

      // se define la función para manejar el almacenamiento de los datos
      // y se guardan los datos en el almacenamiento local (localstorage)
      const handleLogin = (event) => {
        event.preventDefault();
    
        const savedUser = JSON.parse(localStorage.getItem("user"));
    
        if (savedUser && username === savedUser.username && password === savedUser.password) {
          console.log("¡Inicio de sesión exitoso! Bienvenido:", username);
          navigate('/menu-principal');
        } else {
          console.error("Nombre de usuario o contraseña incorrectos.");
        }
      };

      // Este componente renderiza un formulario de inicio de sesión
      // que incluye campos para el nombre de usuario y la contraseña,
      return (
        <div className={styles["form-wrapper"]}>
          <form className={styles["login-form"]} onSubmit={handleLogin}>
            <h2>Inicio de sesión</h2>
            <p>Por favor loguearse para continuar.</p>
    
            <label htmlFor="username">Usuario</label>
            <input
              type="email"
              id="username"
              placeholder="jujo_systemsoft@gmail.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)} 
            />
    
            <label htmlFor="password">Contraseña</label>
            <div className={styles["password-container"]}>
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
              />
              <span
                className={styles["toggle-password"]}
                onClick={togglePasswordVisibility}
                title={passwordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                <span className="material-icons">
                  {passwordVisible ? "visibility_off" : "visibility"}
                </span>
              </span>
            </div>
    
            <button type="submit" className={styles["submit-button"]}>
              Ingresar
              <span className="material-icons" style={{ marginLeft: "0.5rem" }}>
                login
              </span>
            </button>
    
            <a href="https://www.gmail.com" className={styles["forgot-password"]}>
              ¿Olvidó su contraseña? <span>Clic aquí</span> para recuperarla.
            </a>
          </form>
        </div>
      );
    };
    
    export default LoginForm;