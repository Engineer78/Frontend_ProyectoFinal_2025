import React from 'react'
import Header from '../Header';
import styles from '../../styles/usersquery.module.css';
import { Link } from 'react-router-dom';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import SearchIcon from '@mui/icons-material/Search';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

function UsersQuery() {
    // Renderiza la vista principal del módulo de consulta de usuarios:
  // Incluye el header reutilizable, pestañas de navegación, tabla con filtros,
  return (
    <div  className={styles.scrollContainer}>
        {/*Reutilizando el componenete Header.jsx de forma dinamica mediante routes-Dom.js*/}
        <Header
        title="Módulo registro de usuarios"
        subtitle="Hardware Store Inventory FFIG"
        showLogo={true}
        showHelp={true}
        />
        {/* Pestañas debajo del header */}
        <div className={styles.tabs}>
                {/*
                <Link
                to="/users-registration"
                className={`${styles.tabButton} ${activeTab === 'registro' ? styles.active : ''
                    }`}
                onClick={() => handleTabClick('registro')}
                >
                Registro de Usuarios
                </Link>

                <Link
                to="/users-query"
                className={`${styles.tabButton} ${activeTab === 'consulta' ? styles.active : ''
                    }`}
                onClick={() => handleTabClick('consulta')}
                >
                Consulta de Usuarios
                </Link>

                <Link
                to="/update-users"
                className={`${styles.tabButton} ${activeTab === 'actualizar' ? styles.active : ''
                    }`}
                onClick={() => handleTabClick('actualizar')}
                >
                Actualizar Usuarios
                </Link>

                <Link
                to="/delete-users"
                className={`${styles.tabButton} ${activeTab === 'eliminar' ? styles.active : ''
                    }`}
                onClick={() => handleTabClick('eliminar')}
                >
                Eliminar Usuarios
                </Link> 
                */}
            </div>
    </div>
  )
}

export default UsersQuery