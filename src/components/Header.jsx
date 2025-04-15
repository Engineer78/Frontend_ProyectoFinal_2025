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
  return <header></header>;
};

export default Header;
