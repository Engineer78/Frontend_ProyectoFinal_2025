import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// componente useInactivityLogout
// Este hook maneja el cierre de sesión por inactividad del usuario.
const useInactivityLogout = (timeout = 2 * 60 * 1000) => {  // 2 minutos por defecto

  // Hook para redirigir al usuario a la página de login tras un periodo de inactividad
  // timeout: tiempo en milisegundos antes de cerrar sesión (5 minutos por defecto
  const navigate = useNavigate();

  // useEffect para manejar los eventos de inactividad
  // Se establece un temporizador que se reinicia con cada evento de actividad del usuario.
  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart', 'wheel'];
    let timer;

    // Función para reiniciar el temporizador
    // Si el usuario no interactúa durante el tiempo especificado, se cierra la sesión
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        localStorage.clear();
        alert('Tu sesión ha expirado por inactividad.');
        navigate('/login');
      }, timeout);
    };

    // Escuchar eventos
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer(); // Inicializar

    // Cleanup function para remover los listeners y limpiar el temporizador
    // Esto se ejecuta cuando el componente se desmonta o cuando cambia el timeout
    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      clearTimeout(timer);
    };
  }, [navigate, timeout]);
};

export default useInactivityLogout;

