// src/utils/userUtils.js
import { obtenerIniciales } from './obtenerIniciales';

// Simulación de usuario logueado (en el futuro vendrá del backend o localStorage)
export const getLoggedUserData = () => {
  const usuario = {
    nombres: 'Sergio',
    primerApellido: 'Mendoza',
    nombreUsuario: 'sergio@example.com',
    rol: 'AdministradorIT'
  };

  const iniciales = obtenerIniciales(usuario.nombres, usuario.primerApellido);

  return {
    nombreCompleto: `${usuario.nombres} ${usuario.primerApellido}`,
    rol: usuario.rol,
    iniciales
  };
};
