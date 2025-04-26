// Simulación de usuario logueado (en el futuro vendrá del backend o localStorage)
export const getLoggedUserData = () => {
  const usuario = {
    nombres: 'Sergio',
    prime: {
      nombreRol: 'AdministradorIT'
    }
  };

  return {
    nombres: usuario.nombres,
    apellidoPaterno: 'Gonzalez',
    rol: usuario.prime.nombreRol
  };
};
