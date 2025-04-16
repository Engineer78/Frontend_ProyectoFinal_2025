import { useState} from 'react';
import Header from '../Header';
import styles from '../../styles/usersquery.module.css';
import { Link } from 'react-router-dom';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import SearchIcon from '@mui/icons-material/Search';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

function UsersQuery() {

    // Estado para controlar la pestaña activa
    const [activeTab, setActiveTab] = useState('consulta');
    // Cambia la pestaña activa al hacer clic en una opción
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };
    // Estado que indica si el usuario ha iniciado una búsqueda
    const [setIsSearching] = useState(false);
    // Estado con los filtros de búsqueda ingresados por el usuario
    const [setFilters] = useState({
        numeroDocumento: '',
        rol: '',
        nombreCompletos: '',
        telefono: '',
        direccion: '',
        contactoEmergencia: '',
        telefonoContacto: '',
    });
    // Estado para mostrar los datos del producto seleccionado en los inputs deshabilitados
    const [HeaderInputs, setHeaderInputs] = useState({
            numeroDocumento: '',
            rol: '',
            nombreCompletos: '',
            telefono: '',
            direccion: '',
            contactoEmergencia: '',
            telefonoContacto: '',
    });
    // Limpia los filtros, los campos de entrada del encabezado y la tabla de resultados.
    // También reinicia el estado de búsqueda.
    const handleClear = () => {
        setFilters({
            numeroDocumento: '',
            rol: '',
            nombreCompletos: '',
            telefono: '',
            direccion: '',
            contactoEmergencia: '',
            telefonoContacto: '',
        });
        setIsSearching(false);
        setHeaderInputs({
            numeroDocumento: '',
            rol: '',
            nombreCompletos: '',
            telefono: '',
            direccion: '',
            contactoEmergencia: '',
            telefonoContacto: '',
        });
    };

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
                {/* Contenido dependiendo de la pestaña activa */}
                <div className={styles.container}>
                    <h2 className={styles.title}>
                    Ingrese un dato en la casilla correspondiente para realizar la
                    consulta
                    </h2>
                </div>
                {/* Tabla de consulta de mercancía */}
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>
                    Selección
                    <input type="checkbox" disabled />
                    </th>

                    <th>
                    Nº de Documento
                    <input
                        type="text"
                        name="nuemroDocumento"
                        /*value={filters.numeroDocumento} */// Vincula el valor con el estado de los filtros
                        /*onChange={handleInputChange}*/
                        placeholder="Buscar"
                        style={{ fontStyle: 'italic' }} // Esto aplica directamente el estilo en línea
                    />
                    </th>

                    <th>
                    Rol
                    <input
                        type="text"
                        name="rol"
                        /*value={selectedUser ? selectedUser.cantidad : ''}*/
                        disabled
                        placeholder="Buscar"
                        style={{ fontStyle: 'italic' }}
                    />
                    </th>

                    <th>
                    Nombre(s) Completos
                    <input
                        type="text"
                        name="nombreCompletos"
                        /*value={selectedUser ? selectedUser.cantidad : ''}*/
                        disabled
                        placeholder="Buscar"
                        style={{ fontStyle: 'italic' }}
                    />
                    </th>

                    <th>
                    Teléfono
                    <input
                        type="text"
                        name="telefono"
                        /*value={selectedUser  ? selectedUser.cantidad : ''}*/
                        disabled
                        placeholder="Buscar"
                        style={{ fontStyle: 'italic' }}
                    />
                    </th>


                    <th>
                    Dirección
                    <input
                        type="text"
                        name="direccion"
                        /*value={selectedUser ? selectedUser.valorUnitarioProducto : ''}*/
                        disabled
                        placeholder="Buscar"
                        style={{ fontStyle: 'italic' }}
                    />
                    </th>

                    <th>
                    Contacto de emergencia 
                    <input
                        type="text"
                        name="contactoEmergencia"
                        /*value={selectedUser  ? selectedUser.nombreProveedor : ''}*/
                        disabled
                        placeholder="Buscar"
                        style={{ fontStyle: 'italic' }}
                    />
                    </th>

                    <th>
                    Teléfono de Contacto
                    <input
                        type="text"
                        name="telefonoContacto"
                        /*value={selectedUser ? selectedUser.nitProveedor : ''}*/
                        disabled
                        placeholder="Buscar"
                        style={{ fontStyle: 'italic' }}
                    />
                    </th>                  
                </tr>
                </thead>
            </table>
            </div>
            {/* Botones de acción */}
            <div className={styles.buttons}>
                {/*Botón para limpiar los inputs */}
                <button type="button" onClick={handleClear} className={styles.button}>
                Limpiar <CleaningServicesIcon style={{ marginLeft: 8 }} />
                </button>
                {/*Botón para salir al modulo principal */}
                <button
                type="button"
                onClick={() => (window.location.href = '/menu-principal')}
                className={styles.button}
                >
                Salir <ExitToAppIcon style={{ marginLeft: 8 }} />
                </button>
        </div>
    </div>
  )
}

export default UsersQuery