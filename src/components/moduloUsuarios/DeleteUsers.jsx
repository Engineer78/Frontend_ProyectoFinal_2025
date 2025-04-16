import { useState, useEffect } from 'react';
import Header from '../Header';
import styles from '../../styles/deleteusers.module.css';
import { Link } from 'react-router-dom';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import axios from "axios"; // Importa axios

// Componente principal para eliminar usuarios
const DeleteUsers = () => {

    // Crear instancia de Axios con la base URL de la API
    const api = axios.create({ baseURL: 'http://localhost:8080/api' });

    // Estados para manejar pestañas, datos, filtros, selección y carga
    const [activeTab, setActiveTab] = useState('eliminar'); // Pestaña activa
    const [data, setData] = useState([]); // Datos filtrados para mostrar en la tabla
    const [fullUserList, setFullUserList] = useState([]); // Lista completa de usuarios desde el backend
    const [filters, setFilters] = useState({ numeroDocumento: '' }); // Filtros de búsqueda

    // Campos mostrados en los inputs deshabilitados al seleccionar un usuario
    const [disabledInputs, setDisabledInputs] = useState({
        correo: '',
        rol: '',
        nombresCompletos: '',
        telefono: '',
        direccion: '',
        contactoEmergencia: '',
        telefonoContacto: '',
    });

    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false); // Modal de confirmación
    const [isSearching, setIsSearching] = useState(false); // Estado de búsqueda activa
    const [selectedItems, setSelectedItems] = useState([]); // Usuario seleccionado para eliminar
    const [visibleItems, setVisibleItems] = useState(10); // Cantidad de usuarios visibles
    const [isLoadingMore, setIsLoadingMore] = useState(false); // Estado de carga adicional

    // Cargar usuarios desde la API
    const fetchUsers = async () => {
        try {
            const response = await api.get('/usuarios'); // Petición GET a la API
            setFullUserList(response.data); // Guardar respuesta en el estado
        } catch (error) {
            console.error('Error al cargar los usuarios:', error); // Manejo de errores
        }
    };

    // Cargar usuarios una vez al montar el componente
    useEffect(() => {
        fetchUsers();
    }, []);

    // Filtrar usuarios por número de documento
    useEffect(() => {
        const hasActiveFilters = filters.numeroDocumento.trim() !== ''; // Verificar si hay filtros activos

        // Si no hay filtro, limpiar los datos y los campos visibles
        if (!hasActiveFilters) {
            setData([]);
            setDisabledInputs({ 
                correo: '',
                rol: '',
                nombresCompletos: '',
                telefono: '',
                direccion: '',
                contactoEmergencia: '',
                telefonoContacto: '',
            }); // Vaciar todos los campos
            return;
        }

        // Filtrar usuarios que coincidan con el número de documento
        const filtered = fullUserList.filter((item) =>
            item.numeroDocumento.toString().includes(filters.numeroDocumento)
        );

        const itemsToShow = filtered.slice(0, visibleItems); // Aplicar paginación
        setData(itemsToShow); // Guardar datos filtrados

        // Si hay resultados, mostrar el primero en los campos deshabilitados
        if (hasActiveFilters && itemsToShow.length > 0) {
            const firstItem = itemsToShow[0];
            setDisabledInputs({
                correo: firstItem.correo || '',
                rol: firstItem.rol || '',
                nombresCompletos: firstItem.nombresCompletos || '',
                telefono: firstItem.telefono || '',
                direccion: firstItem.direccion || '',
                contactoEmergencia: firstItem.contactoEmergencia || '',
                telefonoContacto: firstItem.telefonoContacto || '',
            });
        } else {
            setDisabledInputs({
                correo: '',
                rol: '',
                nombresCompletos: '',
                telefono: '',
                direccion: '',
                contactoEmergencia: '',
                telefonoContacto: '',
            }); // Limpiar si no hay coincidencias
        }

        if (hasActiveFilters && itemsToShow.length > 0 && !isSearching) {
            setIsSearching(true); // Activar estado de búsqueda
        }
    }, [filters, visibleItems, fullUserList]);

    // Manejo del cambio en el input de búsqueda
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));

        // Si se limpia el campo, reiniciar datos y campos visibles
        if (name === 'numeroDocumento' && value === '') {
            setData([]);
            setDisabledInputs({
                correo: '',
                rol: '',
                nombresCompletos: '',
                telefono: '',
                direccion: '',
                contactoEmergencia: '',
                telefonoContacto: '',
            });
        }

        if (!isSearching) setIsSearching(true);
    };

// Contenedor principal con scroll y cabecera   
return (
    <div className={styles.scrollContainer}>
        {/* Encabezado con título, subtítulo y botones de ayuda/logo */}
        <Header
            title="Módulo registro de usuarios"
            subtitle="Hardware Store Inventory FFIG"
            showLogo={true}
            showHelp={true}
        />

        {/* Pestañas de navegación entre vistas del módulo de usuarios */}
        <div className={styles.tabs}>
            <Link to="/user-registration" className={`${styles.tabButton} ${activeTab === 'registro' ? styles.active : ''}`} onClick={() => handleTabClick('registro')}>
                Registrar Usuario
            </Link>
            <Link to="/user-query" className={`${styles.tabButton} ${activeTab === 'consulta' ? styles.active : ''}`} onClick={() => handleTabClick('consulta')}>
                Consultar Usuario
            </Link>
            <Link to="/update-user" className={`${styles.tabButton} ${activeTab === 'actualizar' ? styles.active : ''}`} onClick={() => handleTabClick('actualizar')}>
                Actualizar Usuario
            </Link>
            <Link to="/delete-user" className={`${styles.tabButton} ${activeTab === 'eliminar' ? styles.active : ''}`} onClick={() => handleTabClick('eliminar')}>
                Eliminar Usuario
            </Link>
        </div>

        {/* Instrucción para el usuario sobre el proceso de eliminación */}
        <div className={styles.container}>
            <h2 className={styles.title}>
                Ingrese Número de Documento del usuario para buscar. Luego seleccione el usuario que desea eliminar.
            </h2>
        </div>

        {/* Tabla de resultados con filtros por documento, campos deshabilitados y selección */}
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>Selección <input type="checkbox" disabled /></th>
                    <th>N° de Documento
                        <input type="text" name="numeroDocumento" value={filters.numeroDocumento} onChange={handleInputChange} placeholder="Buscar" />
                    </th>
                    <th>Correo
                        <input type="text" name="correo" value={disabledInputs.correo} disabled />
                    </th>
                    <th>Rol
                        <input type="text" name="rol" value={disabledInputs.rol} disabled />
                    </th>
                    <th>Nombre(s) Completos
                        <input type="text" name="nombresCompletos" value={disabledInputs.nombresCompletos} disabled />
                    </th>
                    <th>Teléfono
                        <input type="text" name="telefono" value={disabledInputs.telefono} disabled />
                    </th>
                    <th>Dirección
                        <input type="text" name="direccion" value={disabledInputs.direccion} disabled />
                    </th>
                    <th>Contacto Emergencia
                        <input type="text" name="contactoEmergencia" value={disabledInputs.contactoEmergencia} disabled />
                    </th>
                    <th>Teléfono
                        <input type="text" name="telefonoContacto" value={disabledInputs.telefonoContacto} disabled /> 
                    </th>
                </tr>
            </thead>
            <tbody>
                 {/* Renderizado de filas si hay resultados */}
                {isSearching ? (
                    data.length > 0 ? (
                        data.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <input
                                        type="checkbox"
                                        onChange={(e) => handleCheckboxChange(e, item)}
                                    />
                                </td>
                                <td>{item.numeroDocumento}</td>
                                <td>{item.correo}</td>
                                <td>{item.rol}</td>
                                <td>{item.nombresCompletos}</td>
                                <td>{item.telefono}</td>
                                <td>{item.direccion}</td>
                                <td>{item.contactoEmergencia}</td>
                                <td>{item.telefonoContacto}</td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="10">No se encontraron resultados</td></tr>
                    )
                ) : (
                    <tr><td colSpan="10">Realiza una búsqueda para ver los registros</td></tr>
                )}
            </tbody>
        </table>

        {/* Botón para cargar más resultados si existen */}
        {data.length > visibleItems && !isLoadingMore && (
            <div className={styles['load-more-container']}>
                <button className={styles['load-more-button']} onClick={handleLoadMore}>Cargar más</button>
            </div>
        )}

        {/* Indicador de carga mientras se obtienen más usuarios */}
        {isLoadingMore && (
            <div className={styles['loading-spinner']}>
                <p>Cargando más usuarios...</p>
            </div>
        )}

         {/* Modal de confirmación antes de eliminar */}
        {isDeleteConfirmationOpen && (
            <div className={styles['delete-confirmation-modal']} onClick={closeDeleteConfirmationModal}>
                <div className={styles['modalContent-delete']} onClick={(e) => e.stopPropagation()}>
                    <h3>Confirmar Eliminación</h3>
                    <p>¿Estás seguro de que deseas eliminar los usuarios seleccionados?</p>
                    <div className={styles['delete-confirmation-modal-controls']}>
                        <button onClick={handleDeleteItems} className={styles['delete-button']}>
                            Eliminar <DeleteOutlineIcon style={{ marginLeft: 1 }} />
                        </button>
                        <button onClick={closeDeleteConfirmationModal} className={styles['close-button']}>
                            Cancelar X
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Botones inferiores para eliminar, limpiar o salir */}
        <div className={styles.buttons}>
            <button type="button" onClick={openDeleteConfirmationModal} className={styles.buttonEliminar}>
                Eliminar <DeleteOutlineIcon style={{ marginLeft: 8 }} />
            </button>
            <button type="button" onClick={handleClear} className={styles.button}>
                Limpiar <CleaningServicesIcon style={{ marginLeft: 8 }} />
            </button>
            <button type="button" onClick={() => (window.location.href = '/menu-principal')} className={styles.button}>
                Salir <ExitToAppIcon style={{ marginLeft: 8 }} />
            </button>
        </div>
    </div>
);
};

export default DeleteUsers;
