import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/loginform.module.css';
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

    return (
        <div>LoginForm</div>
    )
}

export default LoginForm