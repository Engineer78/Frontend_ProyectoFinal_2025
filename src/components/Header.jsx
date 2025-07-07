import { useState } from "react";
import { getLoggedUserData } from "../authUtils";
import { obtenerIniciales } from "../obtenerIniciales";
import { useLocation } from "react-router-dom";
import { logout } from "../authUtils";
import { usePermisos } from "../components/admin/PermisosContext";
import PropTypes from "prop-types";
import logo from "../assets/Logo Sin Fondo_FFIG.png";
import PermissionManager from "../components/admin/PermissionManager";
import ChangePasswordModal from "../components/admin/ChangePasswordModal";
import ReadOnlyPermissionModal from "../components/admin/ReadOnlyPermissionModal";
import AboutModal from './AboutModal';
import CloseIcon from '@mui/icons-material/Close';
import ExitToAppIcon from '@mui/icons-material/ExitToAppOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import styles from "../styles/header.module.css";
import modalStyles from "../styles/modalstyles.module.css";
import api from "../api";

// Componente Header
const Header = ({ title, subtitle, showLogo, isLogin = false }) => {

  // Estado para el menú de usuario
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  // Función para alternar el menú de usuario
  // Esta función se llama cuando el usuario hace clic en el badge del usuario
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  // Función para manejar el cierre de sesión
  // Limpia el localStorage y redirige al usuario a la página de login
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/"; // Redirige al login
    logout(); // Función para cerrar sesión
  };

  // Obtener datos del usuario logueado
  const { nombres, apellidoPaterno, rol } = getLoggedUserData();
  console.log("Rol detectado:", rol);

  // Obtener las iniciales del usuario y el nombre completo
  const iniciales = obtenerIniciales(nombres, apellidoPaterno);
  const nombreCompleto = `${nombres} ${apellidoPaterno}`;

  // Obtener la ubicación actual para determinar si estamos en la página de login
  // y si el usuario está logueado
  const location = useLocation();
  const isLoginPage = location.pathname === '/' || location.pathname === '/login';
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' && !isLoginPage;
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [isPerfilMenuOpen, setIsPerfilMenuOpen] = useState(false);
  const [showReadOnlyPermissionModal, setShowReadOnlyPermissionModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [openManuals, setOpenManuals] = useState(false);
  const { tienePermiso } = usePermisos();

  // Estados para el submenú de Backup y los modales de exportación e importación
  // Estos estados controlan la visibilidad de los submenús y modales
  const [isBackupSubMenuOpen, setIsBackupSubMenuOpen] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Estado para el modal de respaldo exitoso
  // Este estado se utiliza para mostrar un modal cuando la exportación de la base de datos
  const [modalBackupVisible, setModalBackupVisible] = useState(false);


  // Función para manejar la exportación de la base de datos
  const handleExport = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.get("/backup/exportar", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Mostrar modal de éxito
      setModalBackupVisible(true);
    } catch (error) {
      console.error("Error al exportar:", error);
      alert("Ocurrió un error al exportar la base de datos.");
    }
  };

  // Función para manejar la selección de archivo para importación
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Función para manejar la importación de la base de datos
  const handleImport = async () => {
    if (!selectedFile) {
      alert("Por favor selecciona un archivo .sql para importar.");
      return;
    }

    const formData = new FormData();
    formData.append("archivo", selectedFile);

    // Verificar el valor de tipo_movimiento
    console.log("Tipo de movimiento:", "IMPORTAR");

    try {
      const token = localStorage.getItem("token");

      const response = await api.post("/backup/importar", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Importación exitosa: " + response.data);
      setShowImportModal(false);
      setSelectedFile(null); // Limpiar archivo
    } catch (error) {
      console.error("❌ Error al importar:", error);
      alert("❌ Error al importar la base de datos. Revisa la consola o el backend.");
    }
  };

  const [selectedFile, setSelectedFile] = useState(null);
  console.log("Submenú de Backup abierto:", isBackupSubMenuOpen);

  // renderiza el componente Header
  return (
    <header className={styles.header}>
      {showLogo && (
        <div className={styles["header-left"]}>
          <img src={logo} alt="Logo" className={styles.logo} />
        </div>
      )}
      <div className={styles["header-center"]}>
        <h1>{title}</h1>
        {subtitle && <h2>{subtitle}</h2>}
      </div>

      {/* Menú de usuario */}
      {!isLogin && isLoggedIn ? (
        <div className={styles["user-menu"]}>
          <div className={styles["user-badge"]} onClick={toggleUserMenu}>
            <div className={styles["user-info"]}>
              <strong>{nombreCompleto}</strong>
              <span>{rol}</span>
            </div>
            <div className={styles["user-actions"]}>
              <div className={styles["user-initials"]}>{iniciales}</div>
              <span className={styles["user-arrow"]}>
                <span className="material-icons">
                  {isUserMenuOpen ? "keyboard_arrow_up" : "keyboard_arrow_down"}
                </span>
              </span>
            </div>
          </div>

          {/* Menú desplegable de usuario */}
          {isUserMenuOpen && (
            <ul className={styles["dropdown-menu"]}>

              {/* MI PERFIL */}
              {tienePermiso("insignia:verMiPerfil") && (
                <li
                  onMouseEnter={() => setIsPerfilMenuOpen(true)}
                  onMouseLeave={() => setIsPerfilMenuOpen(false)}
                >
                  <span className={styles["submenu-title"]}>
                    Mi perfil {isPerfilMenuOpen ? "▾" : "▸"}
                  </span>

                  {/* Submenú de perfil */}
                  {isPerfilMenuOpen && (
                    <ul className={styles["submenu"]}>
                      <li onClick={() => setShowChangePasswordModal(true)}>
                        <a href="#">Cambiar contraseña</a>
                      </li>
                      {rol?.toUpperCase().includes("ADMIN") && (
                        <li onClick={() => setShowPermissionModal(true)}>
                          <a href="#">Gestionar permisos</a>
                        </li>
                      )}
                      {!rol?.toUpperCase().includes("ADMIN") && (
                        <li onClick={() => setShowReadOnlyPermissionModal(true)}>
                          <a href="#">¡Lo que puedo hacer!</a>
                        </li>
                      )}
                    </ul>
                  )}
                </li>
              )}

              {/* GESTIONAR BASE DE DATOS */}
              {tienePermiso("backup:gestionar") && (
                <li
                  onMouseEnter={() => setIsBackupSubMenuOpen(true)}
                  onMouseLeave={() => setIsBackupSubMenuOpen(false)}
                >
                  <span className={styles["submenu-title"]}>
                    Gestionar base de datos {isBackupSubMenuOpen ? "▾" : "▸"}
                  </span>

                  {/* Submenú de gestión de base de datos */}
                  {isBackupSubMenuOpen && (
                    <ul className={styles["submenu"]}>
                      {(rol?.toUpperCase().includes("ADMIN") || tienePermiso("backup:exportar")) && (
                        <li onClick={() => setShowExportModal(true)}>
                          <a href="#">Exportar base de datos</a>
                        </li>
                      )}
                      {(rol?.toUpperCase().includes("ADMIN") || tienePermiso("backup:importar")) && (
                        <li onClick={() => setShowImportModal(true)}>
                          <a href="#">Importar base de datos</a>
                        </li>
                      )}

                    </ul>
                  )}
                </li>
              )}

              {/* MANUALES */}
              {tienePermiso("manuales:ver") && (
                <li
                  onMouseEnter={() => setOpenManuals(true)}
                  onMouseLeave={() => setOpenManuals(false)}
                >
                  <span className={styles["submenu-title"]}>
                    Manuales {openManuals ? "▾" : "▸"}
                  </span>

                  {openManuals && (
                    <ul className={styles["submenu"]}>
                      {tienePermiso("documentacion:casosAmbiente") && (
                        <li>
                          <a href="/manuales/diseñar_casos_y_ambiente_pruebas_software.pdf" target="_blank" rel="noopener noreferrer">Casos y Ambiente de Pruebas</a>
                        </li>
                      )}
                      {tienePermiso("documentacion:modulos") && (
                        <li>
                          <a href="/manuales/documentacion_tecnica_modulos_integrados.pdf" target="_blank" rel="noopener noreferrer">Doc. Téc. Módulos Integrados</a>
                        </li>
                      )}
                      {tienePermiso("documentacion:manualTecnico") && (
                        <li>
                          <a href="/manuales/manual_tecnico_hardware_store_inventory.pdf" target="_blank" rel="noopener noreferrer">Manual Técnico Del Sistema</a>
                        </li>
                      )}
                      {tienePermiso("documentacion:manualUsuario") && (
                        <li>
                          <a href="/manuales/manual_usuario.pdf" target="_blank" rel="noopener noreferrer">Manual de Usuario</a>
                        </li>
                      )}
                      {tienePermiso("documentacion:planPruebas") && (
                        <li>
                          <a href="/manuales/plan_pruebas_software.pdf" target="_blank" rel="noopener noreferrer">Plan de Pruebas</a>
                        </li>
                      )}
                    </ul>
                  )}
                </li>
              )}


              {/* ACERCA DE */}
              {tienePermiso("insignia:verAcercaDe") && (
                <li onClick={() => setShowAboutModal(true)}>Acerca de</li>
              )}

              {/* CERRAR SESIÓN */}
              <li onClick={handleLogout}>
                <a href="#">Cerrar sesión</a>
              </li>
            </ul>
          )}

        </div>
      ) : (
        <div style={{ width: '150px', height: '50px' }}></div> // Espacio vacío solo en login
      )}

      {/* Modal de permisos */}
      {showPermissionModal && (
        <PermissionManager onClose={() => setShowPermissionModal(false)} />
      )}

      {/* Modal de cambio de contraseña */}
      {showChangePasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowChangePasswordModal(false)}
          onChangePassword={(actual, nueva) => {
            // Aquí llamas a tu API para cambiar la contraseña
            console.log("Cambiar contraseña de:", actual, "a:", nueva);
          }}
        />
      )}

      {/* Modal de información para el usuario */}
      {showReadOnlyPermissionModal && (
        <ReadOnlyPermissionModal onClose={() => setShowReadOnlyPermissionModal(false)} />
      )}

      {/* Modal acerca de */}
      <AboutModal isOpen={showAboutModal} onClose={() => setShowAboutModal(false)} />

      {showExportModal && (
        <div className={modalStyles.modalOverlay}>
          <div className={modalStyles.modalContent}>
            <button
              className={modalStyles.modalCloseButton}
              onClick={() => setShowExportModal(false)}
            >
              <CloseIcon />
            </button>

            <h2 className={modalStyles.title}>Exportar Base de Datos</h2>
            <div className={modalStyles.moodalText}>
              <p >
                ¿Deseas exportar una copia de seguridad?
              </p>
            </div>

            <div className={modalStyles.modalButtonGroup}>
              <button
                type="button"
                onClick={handleExport}
                className={modalStyles.modalButtonExport}
              >
                Exportar <FileUploadOutlinedIcon style={{ marginLeft: 8 }} />
              </button>

              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className={modalStyles.modalButtonExit}
              >
                Salir <ExitToAppIcon style={{ marginLeft: 8 }} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de importación */}
      {showImportModal && (
        <div className={modalStyles.modalOverlay}>
          <div className={modalStyles.modalContent}>
            <button
              className={modalStyles.modalCloseButton}
              onClick={() => setShowImportModal(false)}
            >
              <CloseIcon />
            </button>

            <h2 className={modalStyles.title}>Importar Base de Datos</h2>
            <div className={modalStyles.moodalText}>
              <p>Selecciona un archivo .sql para importar una copia de seguridad:</p>
            </div>
            <input
              type="file"
              accept=".sql"
              onChange={handleFileChange}
              style={{ marginTop: "10px", marginBottom: "20px" }}
            />

            <div className={modalStyles.modalButtonGroup}>
              <button
                type="button"
                onClick={handleImport}
                className={modalStyles.modalButtonImport}
              >
                Importar <FileDownloadOutlinedIcon style={{ marginLeft: 8 }} />
              </button>

              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className={modalStyles.modalButtonExit}
              >
                Salir <ExitToAppIcon style={{ marginLeft: 8 }} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de respaldo exitoso */}
      {modalBackupVisible && (
        <div className={modalStyles.modalOverlay}>
          <div className={modalStyles.modalContent}>
            <button
              className={modalStyles.modalCloseButton}
              onClick={() => setModalBackupVisible(false)}
            >
              <CloseIcon />
            </button>
            <h2 className={modalStyles.title}>✅ Respaldo Exitoso</h2>

            <div className={modalStyles.moodalText}>
              <p>
                El archivo de respaldo fue generado correctamente y se guardó en la carpeta de <strong>BackupsDB.</strong>
              </p>
            </div>
            <div className={modalStyles.modalButtonGroup}>
              <button
                className={modalStyles.modalButtonExit}
                onClick={() => setModalBackupVisible(false)}
              >
                Salir <ExitToAppIcon style={{ marginLeft: 8 }} />
              </button>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};
Header.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  showLogo: PropTypes.bool,
  showHelp: PropTypes.bool,
};

Header.defaultProps = {
  showLogo: true,
  showHelp: true,
};

export default Header;
