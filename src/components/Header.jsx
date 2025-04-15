import { useState } from "react";
import PropTypes from "prop-types";
import styles from "../styles/header.module.css";
import logo from "../assets/Logo Sin Fondo_FFIG.png";

const Header = ({ title, subtitle, showLogo = true, showHelp = true }) => {
  console.log("Props recibidas en Header:", {
    title,
    subtitle,
    showLogo,
    showHelp,
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  console.log("Props recibidas en Header:", {
    title,
    subtitle,
    showLogo,
    showHelp,
  }); // Para verificar las props
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
      {showHelp && (
        <div className={styles["header-right"]}>
          <div className={styles.dropdown}>
            <button className={styles["help-button"]} onClick={toggleMenu}>
              Ayuda
            </button>
            {isMenuOpen && (
              <ul className={styles["dropdown-menu"]}>
                <li><a href="#faq">Acerca de</a></li>
                <li><a href="#contact">Manual de usuario</a></li>
              </ul>
            )}
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
