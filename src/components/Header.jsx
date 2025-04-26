import { useState } from "react";
import PropTypes from "prop-types";
import styles from "../styles/header.module.css";
import logo from "../assets/Logo Sin Fondo_FFIG.png";
import { getLoggedUserData } from "../authUtils";
import { obtenerIniciales } from "../obtenerIniciales";
import { useLocation } from "react-router-dom";

const Header = ({ title, subtitle, showLogo = true }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/"; // Redirige al login
  };

  const { nombres, apellidoPaterno, rol } = getLoggedUserData();
  const iniciales = obtenerIniciales(nombres, apellidoPaterno);
  const nombreCompleto = `${nombres} ${apellidoPaterno}`;

  const location = useLocation();
  const isLoginPage = location.pathname === '/' || location.pathname === '/login';
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' && !isLoginPage;

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
      {isLoggedIn && (
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

          {isUserMenuOpen && (
            <ul className={styles["dropdown-menu"]}>
              <li><a href="#perfil">Mi perfil</a></li>
              <li><a href="#faq">Acerca de</a></li>
              <li><a href="#contact">Manual de usuario</a></li>
              <li onClick={handleLogout}><a>Cerrar sesión</a></li>
            </ul>
          )}
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
