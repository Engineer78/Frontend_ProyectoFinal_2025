import { jwtDecode } from "jwt-decode";

// ✅ Devuelve los datos del usuario logueado desde el token JWT
export const getLoggedUserData = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return {
      nombres: '',
      apellidoPaterno: '',
      rol: 'Invitado',
      idRol: null
    };
  }

  try {
    const decoded = jwtDecode(token);

    return {
      nombres: decoded.nombres || '',
      apellidoPaterno: decoded.apellidoPaterno || '',
      rol: decoded.rol || 'Invitado',
      idRol: decoded.idRol || null
    };
  } catch (error) {
    console.error("Token inválido o expirado:", error);
    return {
        nombres: '',
        apellidoPaterno: '',
        rol: 'Invitado',
        idRol: null

    };
  }
};

// ✅ Función para cerrar sesión
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userData");
  window.location.href = "/"; // Redirige al login
};
