import { jwtDecode } from 'jwt-decode';
import { useContext } from 'react';
import { PermisosContext } from '../components/admin/PermisosContext';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../authUtils';
import Header from '../components/Header';
import styles from '../styles/menupcpal.module.css';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import useInactivityLogout from '../useInactivityLogout';
import useTokenAutoLogout from '../useTokenAutoLogout';

// componente MenuPcpal
const MenuPcpal = () => {

  useInactivityLogout(); // Hook para manejar el cierre de sesión por inactividad
  useTokenAutoLogout(); // Hook para manejar el cierre de sesión automático al expirar el token

  const navigate = useNavigate();
  const { permisos } = useContext(PermisosContext);

  const token = localStorage.getItem('token');
  let rolUsuario = '';

  if (token) {
    try {
      const decoded = jwtDecode(token);
      rolUsuario = decoded.rol || '';
    } catch (error) {
      console.error('Error al decodificar el token:', error);
    }
  }

  // Función para validar permisos (desde contexto)
  const tienePermiso = (permiso) => permisos.includes(permiso);

  // Si NO es admin y NO tiene permiso para crear usuarios => deshabilitar
  const deshabilitarModuloUsuarios = !(
    rolUsuario?.toUpperCase() === 'ADMIN' || tienePermiso('CREAR_USUARIO')
  );

  // Si NO es admin y NO tiene permiso para crear productos
  const deshabilitarModuloInventario = !(
    rolUsuario?.toUpperCase() === 'ADMIN' ||
    tienePermiso('CREAR_PRODUCTO') ||
    tienePermiso('CONSULTAR_PRODUCTO') ||
    tienePermiso('ACTUALIZAR_PRODUCTO') ||
    tienePermiso('ELIMINAR_PRODUCTO')
  );

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem('user');
    logout();
    navigate('/login');
  };

  // Renderizar el componente
  return (
    <div>
      <Header
        title="Menú Principal"
        subtitle="Hardware Store Inventory FFIG"
        showLogo={true}
        showHelp={true}
      />

      <div className={styles['menu-principal']}>
        <div className={styles['menu-options']}>

          {/* Módulo registro usuarios */}
          <Link
            to={deshabilitarModuloUsuarios ? '#' : '/users-registration'}
            className={styles['menu-button']}
            style={{
              pointerEvents: deshabilitarModuloUsuarios ? 'none' : 'auto',
              opacity: deshabilitarModuloUsuarios ? 0.4 : 1
            }}
          >
            Módulo registro usuarios
            <span className="material-icons">person</span>
          </Link>

          {/* Módulo registro inventario */}
          <Link
            to={deshabilitarModuloInventario ? '#' : "/inventory-registration"}
            className={styles['menu-button']}
            style={{
              pointerEvents: deshabilitarModuloInventario ? 'none' : 'auto',
              opacity: deshabilitarModuloInventario ? 0.4 : 1
            }}
          >
            Módulo registro inventario
            <span className="material-icons">description</span>
          </Link>

        </div>

        <div className={styles['logout-button-container']}>
          <button className={styles['logout-button']} onClick={handleLogout}>
            Salir <ExitToAppIcon style={{ marginLeft: 8 }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuPcpal;
