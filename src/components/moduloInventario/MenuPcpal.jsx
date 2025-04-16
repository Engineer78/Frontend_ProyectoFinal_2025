import { Link, useNavigate } from 'react-router-dom'; // Importa useNavigate
import Header from '../components/Header';
import styles from '../styles/menupcpal.module.css';

// Inicializa la navegación programática con useNavigate
const navigate = useNavigate();

// Obtiene el usuario almacenado en localStorage
const storedUser = JSON.parse(localStorage.getItem('user'));

// Verifica si el usuario tiene permisos para acceder al módulo de usuarios
// Solo usuarios distintos a 'admin@gmail.com' están autorizados
const isUserAllowed = storedUser && storedUser.username !== 'admin@gmail.com';

// Función para cerrar sesión del usuario
const handleLogout = () => {
    localStorage.removeItem('user'); // Elimina al usuario del localStorage al hacer logout
    navigate('/login'); // Redirige a la pantalla de login sin recargar la página
    };
