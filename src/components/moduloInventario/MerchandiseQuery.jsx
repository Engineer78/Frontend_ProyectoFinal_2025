import { useState, useEffect } from 'react';
import Header from '../Header';
import styles from '../../styles/merchandisequery.module.css';
import { Link } from 'react-router-dom';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import SearchIcon from '@mui/icons-material/Search';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import axios from 'axios';

// Configura instancia de axios para conectarse al backend
const api = axios.create({
    baseURL: 'http://localhost:8080/api'
});

// Componente principal del módulo de consulta de productos
const MerchandiseQuery = () => {

    // Estado para controlar la pestaña activa
    const [activeTab, setActiveTab] = useState('consulta');

    // Estado que contiene los datos obtenidos desde el backend
    const [data, setData] = useState([]);

    // Estado con los filtros de búsqueda ingresados por el usuario
    const [filters, setFilters] = useState({
        codigoProducto: '',
        nombreCategoria: '',
        nombreProducto: '',
        nitProveedor: '',
        nombreProveedor: '',
        cantidad: '',
        valorUnitarioProducto: '',
        valorTotalProducto: '',
    });

    // Estado para controlar la imagen mostrada en modal
    const [modalImage, setModalImage] = useState(null);

    // Estado para controlar apertura/cierre del modal de búsqueda avanzada
    const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);

    // Estado que indica si el usuario ha iniciado una búsqueda
    const [isSearching, setIsSearching] = useState(false);

    // Estado para almacenar el producto seleccionado (cuando hay solo un resultado)
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Estado para mostrar los datos del producto seleccionado en los inputs deshabilitados
    const [setHeaderInputs] = useState({
        nombreCategoria: '',
        nombreProducto: '',
        cantidad: '',
        valorUnitarioProducto: '',
        valorTotalProducto: '',
        nombreProveedor: '',
        nitProveedor: '',
    });

    // Cambia la pestaña activa al hacer clic en una opción
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    // useEffect que se activa al cambiar los filtros de búsqueda.
    // Realiza una consulta al backend (excepto por código de producto, que se filtra en frontend),
    // actualiza los datos de la tabla y muestra automáticamente la información si hay un solo resultado.
    useEffect(() => {
        console.log('Filtros:', filters); // Muestra los filtros en la consola para depuración 
        const fetchFilteredData = async () => {
            const {
                codigoProducto,
                nombreProducto,
                nombreCategoria,
                nitProveedor,
                nombreProveedor,
                cantidad,
                valorUnitarioProducto,
                valorTotalProducto,
            } = filters;

            setSelectedProduct(null);

            // Verifica si todos los filtros están vacíos
            const noFilters =
                !codigoProducto &&
                !nombreProducto &&
                !nombreCategoria &&
                !nitProveedor &&
                !nombreProveedor &&
                !cantidad &&
                !valorUnitarioProducto &&
                !valorTotalProducto;

            // Si no hay filtros, limpia la tabla y los inputs superiores
            if (noFilters) {
                setData([]);
                setHeaderInputs({
                    nombreCategoria: '',
                    nombreProducto: '',
                    cantidad: '',
                    valorUnitarioProducto: '',
                    valorTotalProducto: '',
                    nombreProveedor: '',
                    nitProveedor: '',
                });
                return;
            }

            try {
                // Llama al backend con los filtros (excepto códigoProducto)
                const response = await api.get('/productos/buscar', {
                    params: {
                        // codigoProducto se filtra en frontend, no se envía
                        nombreProducto: nombreProducto || null,
                        nombreCategoria: nombreCategoria || null,
                        nitProveedor: nitProveedor || null,
                        nombreProveedor: nombreProveedor || null,
                        cantidad: cantidad || null,
                        valorUnitarioProducto: valorUnitarioProducto || null,
                        valorTotalProducto: valorTotalProducto || null,
                    },
                });

                // Resultado de la API
                let filteredData = response.data;

                // Filtro parcial por código de producto (solo frontend)
                if (codigoProducto) {
                    filteredData = filteredData.filter((producto) =>
                        producto.codigoProducto.toString().includes(codigoProducto)
                    );
                }

                setData(filteredData);

                // Si solo hay un resultado, mostrarlo en los inputs superiores
                if (filteredData.length === 1) {
                    setSelectedProduct(filteredData[0]);
                    setHeaderInputs({
                        nombreCategoria: filteredData[0].nombreCategoria || '',
                        nombreProducto: filteredData[0].nombreProducto || '',
                        cantidad: filteredData[0].cantidad || '',
                        valorUnitarioProducto: filteredData[0].valorUnitarioProducto || '',
                        valorTotalProducto: filteredData[0].valorTotalProducto || '',
                        nombreProveedor: filteredData[0].nombreProveedor || '',
                        nitProveedor: filteredData[0].nitProveedor || '',
                    });
                }
            } catch (error) {
                console.error('Error al obtener datos filtrados:', error);
                setData([]);
                setHeaderInputs({
                    nombreCategoria: '',
                    nombreProducto: '',
                    cantidad: '',
                    valorUnitarioProducto: '',
                    valorTotalProducto: '',
                    nombreProveedor: '',
                    nitProveedor: '',
                });
            }
        };

        fetchFilteredData();
    }, [filters, setHeaderInputs]);


    // useEffect para la búsqueda avanzada: se activa al abrir el modal y al cambiar los filtros.
    // Realiza una consulta al backend con los filtros de búsqueda avanzada y actualiza los datos de la tabla.
    useEffect(() => {
        const fetchAdvancedSearchData = async () => {
            const {
                nitProveedor,
                nombreProveedor,
                cantidad,
                valorUnitarioProducto,
                valorTotalProducto,
            } = filters;

            // Si no hay filtros de búsqueda avanzada, no hacer la consulta
            const noFilters =
                !nitProveedor &&
                !nombreProveedor &&
                !cantidad &&
                !valorUnitarioProducto &&
                !valorTotalProducto;

            if (noFilters) return;

            try {
                const response = await api.get('/productos/busqueda-avanzada', {
                    params: {
                        nitProveedor: nitProveedor || null,
                        nombreProveedor: nombreProveedor || null,
                        cantidad: cantidad || null,
                        valorUnitarioProducto: valorUnitarioProducto || null,
                        valorTotalProducto: valorTotalProducto || null,
                    },
                });

                setData(response.data);
            } catch (error) {
                console.error('Error en búsqueda avanzada:', error);
                setData([]);
            }
        };

        if (isAdvancedSearchOpen) {
            fetchAdvancedSearchData();
        }
    }, [
        filters.nitProveedor,
        filters.nombreProveedor,
        filters.cantidad,
        filters.valorUnitarioProducto,
        filters.valorTotalProducto,
        filters, isAdvancedSearchOpen,
    ]);


    // Limpia los filtros, los campos de entrada del encabezado y la tabla de resultados.
    // También reinicia el estado de búsqueda.
    const handleClear = () => {
        setFilters({
            codigoProducto: '',
            nombreCategoria: '',
            nombreProducto: '',
            nitProveedor: '',
            nombreProveedor: '',
            cantidad: '',
            valorUnitarioProducto: '',
            valorTotalProducto: '',
        });
        setIsSearching(false);
        setHeaderInputs({
            nombreCategoria: '',
            nombreProducto: '',
            cantidad: '',
            valorUnitarioProducto: '',
            valorTotalProducto: '',
            nombreProveedor: '',
            nitProveedor: '',
        });
    };

    // Actualiza los filtros al escribir en los inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
        if (!isSearching) setIsSearching(true);
    };

    // Controla la visualización del modal de imagen del producto: abrir con la URL seleccionada y cerrar limpiando el estado.
    const handleImageClick = (imageUrl) => {
        setModalImage(imageUrl);
    };

    // Cierra el modal de imagen
    const closeModal = () => {
        setModalImage(null);
    };

    // Controla la visibilidad del modal de búsqueda avanzada: abrir y cerrar mediante el estado correspondiente.
    const openAdvancedSearchModal = () => {
        setIsAdvancedSearchOpen(true);
    };

    // Cierra el modal de búsqueda avanzada
    const closeAdvancedSearchModal = () => {
        setIsAdvancedSearchOpen(false);
    };

    // Limpia los filtros aplicados desde el modal de búsqueda avanzada y reinicia los estados relacionados.
    const handleClearModalFilters = () => {
        setFilters({
            codigoProducto: '',
            nombreCategoria: '',
            nombreProducto: '',
            nitProveedor: '',
            nombreProveedor: '',
            cantidad: '',
            valorUnitarioProducto: '',
            valorTotalProducto: '',
        });
        setIsSearching(false);
        setHeaderInputs({
            nombreCategoria: '',
            nombreProducto: '',
            cantidad: '',
            valorUnitarioProducto: '',
            valorTotalProducto: '',
            nombreProveedor: '',
            nitProveedor: '',
        });
    };

    // Carga los datos del producto seleccionado en los filtros e inputs
    const handleRowClick = (producto) => {
        setFilters({
            codigoProducto: producto.codigoProducto || '',
            nombreCategoria: producto.nombreCategoria || '',
            nombreProducto: producto.nombreProducto || '',
            nitProveedor: producto.nitProveedor || '',
            nombreProveedor: producto.nombreProveedor || '',
            cantidad: producto.cantidad || '',
            valorUnitarioProducto: producto.valorUnitarioProducto || '',
            valorTotalProducto: producto.valorTotalProducto || '',
        });

        setHeaderInputs({
            nombreCategoria: producto.nombreCategoria || '',
            nombreProducto: producto.nombreProducto || '',
            cantidad: producto.cantidad || '',
            valorUnitarioProducto: producto.valorUnitarioProducto || '',
            valorTotalProducto: producto.valorTotalProducto || '',
            nombreProveedor: producto.nombreProveedor || '',
            nitProveedor: producto.nitProveedor || '',
        });
    };

    // Renderiza la vista principal del módulo de consulta de productos:
    // Incluye el header reutilizable, pestañas de navegación, tabla con filtros,
    // modales para búsqueda avanzada e imagen del producto, y botones de acción.
    return (
        <div className={styles.scrollContainer}>
            {/*Reutilizando el componenete Header.jsx de forma dinamica mediante routes-Dom.js*/}
            <Header
                title="Módulo registro de inventario"
                subtitle="Hardware Store Inventory FFIG"
                showLogo={true}
                showHelp={true}
            />

            {/* Pestañas debajo del header */}
            <div className={styles.tabs}>
                <Link
                    to="/inventory-registration"
                    className={`${styles.tabButton} ${activeTab === 'registro' ? styles.active : ''
                        }`}
                    onClick={() => handleTabClick('registro')}
                >
                    Registro de Producto
                </Link>

                <Link
                    to="/merchandise-query"
                    className={`${styles.tabButton} ${activeTab === 'consulta' ? styles.active : ''
                        }`}
                    onClick={() => handleTabClick('consulta')}
                >
                    Consulta de Producto
                </Link>

                <Link
                    to="/update-merchandise"
                    className={`${styles.tabButton} ${activeTab === 'actualizar' ? styles.active : ''
                        }`}
                    onClick={() => handleTabClick('actualizar')}
                >
                    Actualizar Producto
                </Link>

                <Link
                    to="/delete-merchandise"
                    className={`${styles.tabButton} ${activeTab === 'eliminar' ? styles.active : ''
                        }`}
                    onClick={() => handleTabClick('eliminar')}
                >
                    Eliminar Producto
                </Link>
            </div>

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
                            Código
                            <input
                                type="text"
                                name="codigoProducto"
                                value={filters.codigoProducto} // Vincula el valor con el estado de los filtros
                                onChange={handleInputChange}
                                placeholder="Buscar"
                                style={{ fontStyle: 'italic' }} // Esto aplica directamente el estilo en línea
                            />
                        </th>
                        <th>
                            Categoría
                            <input
                                type="text"
                                name="nombreCategoria"
                                value={filters.nombreCategoria} // Vincula el valor con el estado de los filtros
                                onChange={handleInputChange}
                                placeholder="Buscar"
                                style={{ fontStyle: 'italic' }} // Esto aplica directamente el estilo en línea
                            />
                        </th>
                        <th>
                            Nom. del producto
                            <input
                                type="text"
                                name="nombreProducto"
                                value={filters.nombreProducto} // Vincula el valor con el estado de los filtros
                                onChange={handleInputChange}
                                placeholder="Buscar"
                                style={{ fontStyle: 'italic' }} // Esto aplica directamente el estilo en línea
                            />
                        </th>
                        <th>
                            Existencias
                            <input
                                type="text"
                                name="cantidad"
                                value={selectedProduct ? selectedProduct.cantidad : ''}
                                disabled
                                placeholder="Buscar"
                                style={{ fontStyle: 'italic' }}
                            />
                        </th>
                        <th>
                            Valor Unitario
                            <input
                                type="text"
                                name="valorUnitarioProducto"
                                value={selectedProduct ? selectedProduct.valorUnitarioProducto : ''}
                                disabled
                                placeholder="Buscar"
                                style={{ fontStyle: 'italic' }}
                            />
                        </th>
                        <th>
                            Valor Total prod.
                            <input
                                type="text"
                                name="valorTotalProducto"
                                value={selectedProduct ? selectedProduct.valorTotalProducto : ''}
                                disabled
                                placeholder="Buscar"
                                style={{ fontStyle: 'italic' }}
                            />
                        </th>
                        <th>
                            Proveedor
                            <input
                                type="text"
                                name="nombreProveedor"
                                value={selectedProduct ? selectedProduct.nombreProveedor : ''}
                                disabled
                                placeholder="Buscar"
                                style={{ fontStyle: 'italic' }}
                            />
                        </th>
                        <th>
                            NIT Proveedor
                            <input
                                type="text"
                                name="nitProveedor"
                                value={selectedProduct ? selectedProduct.nitProveedor : ''}
                                disabled
                                placeholder="Buscar"
                                style={{ fontStyle: 'italic' }}
                            />
                        </th>
                        <th>Imagen</th>
                    </tr>
                </thead>
                <tbody>
                    {isSearching ? (
                        data.length > 0 ? (
                            data.map((item, index) => (
                                <tr key={index} onClick={() => handleRowClick(item)} style={{ cursor: 'pointer' }}>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td>{item.codigoProducto}</td>
                                    <td>{item.nombreCategoria}</td>
                                    <td>{item.nombreProducto}</td>
                                    <td>{item.cantidad}</td>
                                    <td>{item.valorUnitarioProducto}</td>
                                    <td>{item.valorTotalProducto}</td>
                                    <td>{item.nombreProveedor}</td>
                                    <td>{item.nitProveedor}</td>
                                    <td>
                                        {item.imagen ? (
                                            <a href="#" onClick={() => handleImageClick(item.imagen)}>
                                                Ver Imagen
                                            </a>
                                        ) : (
                                            'No disponible'
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10">No se encontraron resultados</td>
                            </tr>
                        )
                    ) : (
                        <tr>
                            <td colSpan="10">Realiza una búsqueda para ver los registros</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Modal para mostrar la imagen */}
            {modalImage && (
                <div className={styles.modal} onClick={closeModal}>
                    <div
                        className={styles.modalContent}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Verificamos si la imagen tiene una URL válida antes de renderizar */}
                        {modalImage.startsWith('data:image') ? (
                            <img
                                src={modalImage}
                                alt="Imagen no disponible"
                                className={styles.modalImage}
                            />
                        ) : (
                            <p>Imagen no disponible</p>
                        )}
                        <button className={styles.closeButton} onClick={closeModal}>
                            Cerrar X
                        </button>
                    </div>
                </div>
            )}

            {/* Modal de búsqueda avanzada */}
            {isAdvancedSearchOpen && (
                <div
                    className={styles['advanced-search-modal']}
                    onClick={closeAdvancedSearchModal}

                >
                    <div
                        className={styles['modalContent-advance']}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>Búsqueda Avanzada</h3>

                        {/* Botón de limpiar ventana modal búsqueda avanzada */}
                        <div className={styles['advanced-search-modal-controls']}>
                            <button
                                className={styles['advanced-search-clear-button']}
                                onClick={handleClearModalFilters}
                            >
                                Limpiar <CleaningServicesIcon style={{ marginLeft: 8 }} />
                            </button>
                            {/*Botón para cerrar la ventana modal Búsqueda avanzada*/}
                            <button
                                onClick={closeAdvancedSearchModal}
                                className={styles['close-button']}
                            >
                                X
                            </button>
                        </div>

                        <form className="advance-form">
                            <label htmlFor="nit">NIT</label>
                            <input
                                type="text"
                                id="nit"
                                name="nitProveedor"
                                value={filters.nitProveedor}
                                onChange={handleInputChange}
                                placeholder="Buscar por NIT"
                                style={{ fontStyle: 'italic' }}
                            />
                            <label htmlFor="proveedor">Nombre del proveedor</label>
                            <input
                                type="text"
                                id="proveedor"
                                name="nombreProveedor"
                                value={filters.nombreProveedor}
                                onChange={handleInputChange}
                                placeholder="Buscar por nombre proveedor"
                                style={{ fontStyle: 'italic' }}
                            />
                            <label htmlFor="existencia">Existencias</label>
                            <input
                                type="text"
                                id="existencia"
                                name="cantidad"
                                value={filters.cantidad}
                                onChange={handleInputChange}
                                placeholder="Buscar por existencias"
                                style={{ fontStyle: 'italic' }}
                            />
                            <label htmlFor="valorUnitario">Valor unitario</label>
                            <input
                                type="text"
                                id="valorUnitario"
                                name="valorUnitarioProducto"
                                value={filters.valorUnitarioProducto}
                                onChange={handleInputChange}
                                placeholder="Buscar por valor unitario"
                                style={{ fontStyle: 'italic' }}
                            />
                            <label htmlFor="valorTotal">Valor total</label>
                            <input
                                type="text"
                                id="valorTotal"
                                name="valorTotalProducto"
                                value={filters.valorTotalProducto}
                                onChange={handleInputChange}
                                placeholder="Buscar por valor total"
                                style={{ fontStyle: 'italic' }}
                            />
                        </form>
                    </div>
                </div>
            )}

            {/* Botones de acción */}
            <div className={styles.buttons}>
                {/* Botón para abrir el modal búsqueda avanzada */}
                <button
                    type="button"
                    onClick={openAdvancedSearchModal} // Abre el modal de búsqueda avanzada
                    className={styles.button}
                    title="Haz clic para realizar una búsqueda avanzada" // Tooltip que aparece al pasar el cursor
                >
                    Buscar <SearchIcon style={{ marginLeft: 8 }} />
                </button>

                <button type="button" onClick={handleClear} className={styles.button}>
                    Limpiar <CleaningServicesIcon style={{ marginLeft: 8 }} />
                </button>

                <button
                    type="button"
                    onClick={() => (window.location.href = '/menu-principal')}
                    className={styles.button}
                >
                    Salir <ExitToAppIcon style={{ marginLeft: 8 }} />
                </button>
            </div>
        </div>
    );
};

export default MerchandiseQuery;