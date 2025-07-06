import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import "material-icons/iconfont/material-icons.css";
import styles from '../../styles/loginform.module.css';
import api from '../../api'; // Importa la instancia de Axios configurada

// componente LoginForm
// Este componente maneja el formulario de inicio de sesión
const LoginForm = () => {

  // Estados para manejar la visibilidad de la contraseña, el nombre de usuario, la contraseña y el estado de carga
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Función para alternar la visibilidad de la contraseña
  // Cambia el estado de passwordVisible entre true y false
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Función para manejar el envío del formulario de inicio de sesión
  // Se encarga de enviar los datos al backend y manejar la respuesta
  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    console.log("🔐 Enviando login con:", {
      username: username,
      password: password
    });

    try {
      const response = await api.post('http://localhost:8080/api/auth/login', {
        username: username,
        password: password
      });

      const token = response.data.token;

      // Guardar el token en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('isLoggedIn', 'true');

      // Decodificar el token para extraer datos del usuario 
      const decoded = jwtDecode(token);
      localStorage.setItem('userData', JSON.stringify(decoded));

      // ✅ Forzar recarga completa para que PermisosContext cargue bien 
      window.location.href = '/menu-principal';
    } catch (error) {
      console.error("❌ Error de autenticación:", error.response?.data || error.message);
      alert("Usuario o contraseña inválidos.");
    } finally {
      setIsLoading(false);
    }
  };

  // Renderiza el formulario de inicio de sesión
  // Incluye campos para el nombre de usuario y la contraseña, y un botón para enviar
  return (
    <div className={styles["form-wrapper"]}>
      <form className={styles["login-form"]} onSubmit={handleLogin}>
        <h2>Inicio de sesión</h2>
        <p>Por favor loguearse para continuar.</p>

        <label htmlFor="username">Usuario</label>
        <input
          type="email"
          id="username"
          placeholder="judajo_systemsoft@gmail.com"
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

        <button type="submit" className={styles["submit-button"]} disabled={isLoading}>
          {isLoading ? "Ingresando..." : "Ingresar"}
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