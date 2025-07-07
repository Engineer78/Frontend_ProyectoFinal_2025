import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { logout } from "./authUtils"

// Hook para manejar el cierre de sesión automático al expirar el token JWT
// Este hook verifica el token almacenado en localStorage y establece un temporizador para cerrar sesión
const useTokenAutoLogout = () => {

  // Efecto que se ejecuta al montar el componente
  // Verifica el token y establece un temporizador para cerrar sesión si el token ha expir
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const decoded = jwtDecode(token);

      if (decoded && decoded.exp) {
        const expirationTime = decoded.exp * 1000; // JWT exp viene en segundos
        const now = Date.now();
        const timeLeft = expirationTime - now;

        if (timeLeft > 0) {
          const timeout = setTimeout(() => {
            alert("⚠️ Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.");
            logout();
          }, timeLeft);

          return () => clearTimeout(timeout); // Limpia si desmonta
        } else {
          // El token ya expiró
          logout();
        }
      }
    } catch (error) {
      console.error("Error decodificando token:", error);
      logout();
    }
  }, []);
};

export default useTokenAutoLogout;
