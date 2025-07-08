import { getLoggedUserData } from '../authUtils.js';
import { obtenerIniciales } from '../obtenerIniciales';


// Este componente muestra una insignia de usuario con su nombre completo,
// rol y las iniciales del usuario.
const UserBadge = () => {

  const { rol, nombres, apellidoPaterno } = getLoggedUserData();

  const nombreCompleto = `${nombres} ${apellidoPaterno}`;
  const iniciales = obtenerIniciales(nombres, apellidoPaterno);

  // Renderizar el componente
  return (
    <div className="user-badge">
      <div className="user-info">
        <strong>{nombreCompleto}</strong>
        <p>{rol}</p>
      </div>
      <div className="user-initials">
        {iniciales}
      </div>
    </div>
  );
};

export default UserBadge