import { useState, useEffect } from 'react';
import { usePermisos } from "../../components/admin/PermisosContext";
import Header from '../Header';
import { Link } from 'react-router-dom';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import useInactivityLogout from '../../useInactivityLogout';
import useTokenAutoLogout from '../../useTokenAutoLogout';
import styles from '../../styles/deletemerchandise.module.css';
import api from "../../api"; // Imnportar la instancia de axios configurada


// Componente DeleteMerchandise
const DeleteMerchandise = () => {

    useInactivityLogout(); // Llama al hook para manejar el logout por inactividad
    useTokenAutoLogout();  // Hook para expiración de token

    // Estados locales para manejar la pestaña activa, datos, filtros y otros estados
    const [activeTab, setActiveTab] = useState('eliminar');
    // Almacena los datos combinados y filtrados
    const [data, setData] = useState([]);
    // Almacena la lista completa de productos
    const [fullProductList, setFullProductList] = useState([]);
    const [filters, setFilters] = useState({
        codigo: '',
    });

    const [disabledInputs, setDisabledInputs] = useState({
        categoria: '',
        nombre: '',
        existencias: '',
        valorUnitario: '',
        valorTotal: '',
        proveedor: '',
        nitProveedor: '',
    });

<<<<<<< HEAD
    // Este estado se usa para mostrar una imagen en un modal cuando se hace clic en "
    const [modalImage, setModalImage] = useState(null);

    // Este estado se usa para mostrar un modal de confirmación antes de eliminar un producto
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
=======
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false); // Modal confirmación eliminación
    const [isSearching, setIsSearching] = useState(false); // Control búsqueda activa
    const [selectedItems, setSelectedItems] = useState([]); // Registros seleccionados
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;
>>>>>>> cd3f5be33869ab9d53e3e670a21974ec3fbc8b61

    // Este estado se usa para controlar si se está buscando productos y para manejar la paginación
    const [isSearching, setIsSearching] = useState(false);

    // Este estado se usa para almacenar los productos seleccionados para eliminar
    const [selectedItems, setSelectedItems] = useState([]);

    // Este estado se usa para controlar la página actual y el número de filas por página
    const [currentPage, setCurrentPage] = useState(1);

    // Este valor se usa para determinar cuántos registros mostrar por página
    const rowsPerPage = 5;

    // Este hook permite verificar si el usuario tiene permisos para realizar ciertas acciones
    const { tienePermiso } = usePermisos();

    // Función para manejar el clic en las pestañas
    // Esta función cambia la pestaña activa cuando se hace clic en una de las pestañas
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    // Función para abrir el modal de confirmación de eliminación
    // Esta función se llama cuando se hace clic en el botón de eliminar
    const openDeleteConfirmationModal = () => {
        setIsDeleteConfirmationOpen(true);
    };

    // Función para cerrar el modal de confirmación de eliminación
    // Esta función se llama cuando se cierra el modal de confirmación
    const closeDeleteConfirmationModal = () => {
        setIsDeleteConfirmationOpen(false);
    };
<<<<<<< HEAD

=======
>>>>>>> cd3f5be33869ab9d53e3e670a21974ec3fbc8b61
    // Función para cargar los productos desde la API
    const fetchProducts = async () => {
        try {
            const response = await api.get('/productos');
            setFullProductList(response.data);
        } catch (error) {
            console.error('Error al cargar los productos:', error);
        }
    };

    // Función para manejar los checkbox
    const handleCheckboxChange = (e, item) => {
        if (e.target.checked) {
            setSelectedItems((prev) => [...prev, item]);

            // ✅ Actualiza los inputs deshabilitados con los datos del producto seleccionado
            setDisabledInputs({
                categoria: item.nombreCategoria || '',
                nombre: item.nombreProducto || '',
                existencias: item.cantidad || '',
                valorUnitario: item.valorUnitarioProducto || '',
                valorTotal: item.valorTotalProducto || '',
                proveedor: item.nombreProveedor || '',
                nitProveedor: item.nitProveedor || '',
                telefonoProveedor: item.telefonoProveedor || '',
                direccionProveedor: item.direccionProveedor || ''
            });
        } else {
            setSelectedItems((prev) => prev.filter((selected) => selected.codigoProducto !== item.codigoProducto));
        }
    };

    // Elimina el producto seleccionado
    const handleDeleteItems = async () => {
        if (selectedItems.length === 0) {
            alert('Por favor, selecciona al menos un registro para eliminar.');
            return;
        }

        try {
            const idProducto = selectedItems[0].idProducto;
            const confirm = window.confirm('¿Estás seguro que deseas eliminar el producto seleccionado?');
            if (!confirm) return;

            await api.delete(`http://localhost:8080/api/productos/${idProducto}`);

            closeDeleteConfirmationModal(); // Cierra el modal de confirmación

            // Limpiar estados filtros e inputs
            setSelectedItems([]);
            setFilters({ codigo: '' });
            setDisabledInputs({
                categoria: '',
                nombre: '',
                existencias: '',
                valorUnitario: '',
                valorTotal: '',
                proveedor: '',
                nitProveedor: '',
                telefonoProveedor: '',
                direccionProveedor: ''
            });

            // Limpiar la lista de productos y el estado de búsqueda
            setData([]);
            setIsSearching(false);

            fetchProducts();

            // Mostrar mensaje de éxito después de un breve retraso
            setTimeout(() => {
                alert('Producto eliminado exitosamente');
            }, 150);

        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            alert('Hubo un error al intentar eliminar el producto.');
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Aplica el filtro por código dinámicamente
    useEffect(() => {
        const hasActiveFilters = filters.codigo.trim() !== '';

        if (!hasActiveFilters) {
            setData([]); // ✅ Evita mostrar toda la BD si no hay filtro
            setDisabledInputs({
                categoria: '',
                nombre: '',
                existencias: '',
                valorUnitario: '',
                valorTotal: '',
                proveedor: '',
                nitProveedor: '',
                telefonoProveedor: '',
                direccionProveedor: ''
            });
            return; // No sigas con filtrado
        }

        // Filtra los productos por el código ingresado
        // Convierte el código a string y lo rellena con ceros a la izquierda para que tenga 5 dígitos
        const filtered = fullProductList.filter((item) =>
            item.codigoProducto.toString().padStart(5, '0').includes(filters.codigo)
        );

<<<<<<< HEAD

        // Si no hay resultados, limpia los datos y los inputs deshabilitados
=======
>>>>>>> cd3f5be33869ab9d53e3e670a21974ec3fbc8b61
        const itemsToShow = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
        setData(itemsToShow);

        if (hasActiveFilters && itemsToShow.length > 0) {
            const firstItem = itemsToShow[0];
            setDisabledInputs({
                categoria: firstItem.nombreCategoria || '',
                nombre: firstItem.nombreProducto || '',
                existencias: firstItem.cantidad || '',
                valorUnitario: firstItem.valorUnitarioProducto || '',
                valorTotal: firstItem.valorTotalProducto || '',
                proveedor: firstItem.nombreProveedor || '',
                nitProveedor: firstItem.nitProveedor || '',
                telefonoProveedor: firstItem.telefonoProveedor || '',
                direccionProveedor: firstItem.direccionProveedor || ''
            });
        } else {
            setDisabledInputs({
                categoria: '',
                nombre: '',
                existencias: '',
                valorUnitario: '',
                valorTotal: '',
                proveedor: '',
                nitProveedor: '',
                telefonoProveedor: '',
                direccionProveedor: ''
            });
        }

        // Si hay filtros activos y hay elementos para mostrar, activa la búsqueda
        // y establece el estado de búsqueda en verdadero
        if (hasActiveFilters && itemsToShow.length > 0 && !isSearching) {
            setIsSearching(true);
        }
    }, [filters, currentPage, fullProductList, isSearching]);

    // Maneja el cambio en los inputs de filtro
    // Esta función se encarga de actualizar los filtros y manejar la validación del input de código
    // También reinicia la página actual cuando se cambia el filtro
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // ✅ Validación SOLO para el input de código
        if (name === 'codigo' && value && !/^\d*$/.test(value)) {
            alert('El código solo permite números enteros.');
            return;
        }

        setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));

        setCurrentPage(1); // 🔄 Reinicia la página cuando se cambia el filtro

        if (name === 'codigo' && value === '') {
            setData([]);
            setDisabledInputs({
                categoria: '',
                nombre: '',
                existencias: '',
                valorUnitario: '',
                valorTotal: '',
                proveedor: '',
                nitProveedor: '',
                telefonoProveedor: '',
                direccionProveedor: ''
            });
        }

        if (!isSearching) setIsSearching(true);
    };

    // Esta función se encarga de limpiar los filtros y los inputs deshabilitados
    const handleClear = () => {
        setFilters({ codigo: '' });
        setDisabledInputs({
            categoria: '',
            nombre: '',
            existencias: '',
            valorUnitario: '',
            valorTotal: '',
            proveedor: '',
            nitProveedor: '',
            telefonoProveedor: '',
            direccionProveedor: ''
        });
        setData([]);
        setIsSearching(false);
    };

    // Esta función se encarga de abrir un modal con la imagen del producto cuando se hace
    const handleImageClick = (imageUrl) => {
        setModalImage(imageUrl);
    };

    // Cierra el modal de la imagen
    // Esta función se encarga de cerrar el modal de la imagen cuando se hace clic en
    const closeModal = () => {
        setModalImage(null);
    };

    // Renderiza el componente DeleteMerchandise
    // Este componente muestra un header, pestañas para navegar entre diferentes acciones de inventario,
    return (
        <div className={styles.scrollContainer}>
            <Header
                title="Módulo registro de inventario"
                subtitle="Hardware Store Inventory FFIG"
                showLogo={true}
                showHelp={true}
            />

            {/* Pestañas debajo del header */}
            <div className={styles.tabs}>
                <Link
                    to={tienePermiso("inventario:registrar") ? "/inventory-registration" : "#"}
                    className={`${styles.tabButton} ${activeTab === "registro" ? styles.active : ""} ${!tienePermiso("inventario:registrar") ? styles.disabledTab : ""}`}
                    onClick={(e) => {
                        if (!tienePermiso("inventario:registrar")) e.preventDefault();
                        else handleTabClick("registro");
                    }}
                >
                    Registrar Inventario
                </Link>

                <Link
                    to="/merchandise-query"
                    className={`${styles.tabButton} ${activeTab === "consulta" ? styles.active : ""}${!tienePermiso("inventario:registrar") ? styles.disabledTab : ""}`}
                    onClick={() => handleTabClick("consulta")}
                >
                    Consultar Inventario
                </Link>

                <Link
                    to={tienePermiso("inventario:editar") ? "/update-merchandise" : "#"}
                    className={`${styles.tabButton} ${activeTab === "actualizar" ? styles.active : ""} ${!tienePermiso("inventario:editar") ? styles.disabledTab : ""}`}
                    onClick={(e) => {
                        if (!tienePermiso("inventario:editar")) e.preventDefault();
                        else handleTabClick("actualizar");
                    }}
                >
                    Actualizar Inventario
                </Link>

                <Link
                    to={tienePermiso("inventario:eliminar") ? "/delete-merchandise" : "#"}
                    className={`${styles.tabButton} ${activeTab === "eliminar" ? styles.active : ""} ${!tienePermiso("inventario:eliminar") ? styles.disabledTab : ""}`}
                    onClick={(e) => {
                        if (!tienePermiso("inventario:eliminar")) e.preventDefault();
                        else handleTabClick("eliminar");
                    }}
                >
                    Eliminar Inventario
                </Link>
            </div>

            <div className={styles.container}>
                <h2 className={styles.title}>
                    Ingrese un código de producto y seleccione el registro que desea eliminar
                </h2>
            </div>
<<<<<<< HEAD

            {/*  Etiqueta de paginación con total de registros y filas por página */}
=======
            {/*  {/* Etiqueta de paginación con total de registros y filas por página */}
>>>>>>> cd3f5be33869ab9d53e3e670a21974ec3fbc8b61
            <div className={styles.topTableRow}>
                <p className={styles.labelPagination}>
                    Total registros: {data.length} | Filas por página:  {rowsPerPage}
                </p>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Selección
                            <input
                                type="checkbox"
                                disabled />
                        </th>
                        <th>Código
                            <input
                                type="text"
                                name="codigo"
                                value={filters.codigo}
                                onChange={handleInputChange}
                                placeholder="Buscar"
                                style={{ fontStyle: 'italic' }} />
                        </th>
                        <th>Categoría
                            <input
                                type="text"
                                name="categoria"
                                value={disabledInputs.categoria}
                                placeholder="..."
                                disabled
                                style={{ fontStyle: 'italic' }}
                            />
                        </th>
                        <th>Producto
                            <input
                                type="text"
                                name="nombre"
                                value={disabledInputs.nombre}
                                placeholder="..."
                                disabled
                                style={{ fontStyle: 'italic' }}
                            />
                        </th>
                        <th>Existencias
                            <input
                                type="text"
                                name="existencia"
                                value={disabledInputs.existencias}
                                placeholder="..."
                                disabled
                                style={{ fontStyle: 'italic' }}
                            />
                        </th>
                        <th>Valor Unit.
                            <input
                                type="text"
                                name="valorUnitario"
                                value={disabledInputs.valorUnitario}
                                placeholder="..."
                                disabled
                                style={{ fontStyle: 'italic' }}
                            />
                        </th>
                        <th>Valor Tot.
                            <input
                                type="text"
                                name="valorTotal"
                                value={disabledInputs.valorTotal}
                                placeholder="..."
                                disabled
                                style={{ fontStyle: 'italic' }}
                            />
                        </th>
                        <th>Proveedor
                            <input
                                type="text"
                                name="proveedor"
                                value={disabledInputs.proveedor}
                                placeholder="..."
                                disabled
                                style={{ fontStyle: 'italic' }}
                            />
                        </th>
                        <th>NIT Prov.
                            <input
                                type="text"
                                name="nitProveedor"
                                value={disabledInputs.nitProveedor}
                                placeholder="..."
                                disabled
                                style={{ fontStyle: 'italic' }}
                            />
                        </th>
                        <th>Tel. Prov.
                            <input
                                type="text"
                                value={disabledInputs.telefonoProveedor || ''}
                                disabled
                                placeholder="..."
                                style={{ fontStyle: 'italic' }}
                            />
                        </th>
                        <th>Dir. Prov.
                            <input
                                type="text"
                                value={disabledInputs.direccionProveedor || ''}
                                disabled
                                placeholder="..."
                                style={{ fontStyle: 'italic' }}
                            />
                        </th>
                        <th>Img.</th>
                    </tr>
                </thead>

                <tbody>
                    {/* Renderiza los datos filtrados y paginados */}
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
                                    <td>{item.codigoProducto.toString().padStart(5, '0')}</td>
                                    <td>{item.nombreCategoria}</td>
                                    <td>{item.nombreProducto}</td>
                                    <td>{item.cantidad}</td>
                                    <td>{item.valorUnitarioProducto}</td>
                                    <td>{item.valorTotalProducto}</td>
                                    <td>{item.nombreProveedor}</td>
                                    <td>{item.nitProveedor}</td>
                                    <td>{item.telefonoProveedor}</td>
                                    <td>{item.direccionProveedor}</td>
                                    <td>
                                        {item.imagen && item.imagen.length > "data:image/png;base64,".length ? (
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
                                <td colSpan="12">No se encontraron resultados</td>
                            </tr>
                        )
                    ) : (
                        <tr>
                            <td colSpan="12">Realiza una búsqueda para ver los registros</td>
                        </tr>
                    )}
                </tbody>
            </table>
<<<<<<< HEAD

            {/* Paginación Tabla */}
            {isSearching && data.length > 0 && (
                <div className={styles.pagination}>
                    <button
                        className={styles.circleButton}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        &#x276E;
                    </button>

=======
            {/* Paginación Tabla */}
            {isSearching && data.length > 0 && (
                <div className={styles.pagination}>
                    <button
                        className={styles.circleButton}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        &#x276E;
                    </button>

>>>>>>> cd3f5be33869ab9d53e3e670a21974ec3fbc8b61
                    {Array.from({
                        length: Math.ceil(fullProductList.filter(item =>
                            item.codigoProducto.toString().includes(filters.codigo)).length / rowsPerPage)
                    }, (_, i) => i + 1)
                        .map(pageNum => (
                            <button
                                key={pageNum}
                                className={`${styles.pageNumber} ${currentPage === pageNum ? styles.activePage : ''}`}
                                onClick={() => setCurrentPage(pageNum)}
                            >
                                {pageNum}
                            </button>
                        ))}

                    <button
                        className={styles.circleButton}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        disabled={currentPage === Math.ceil(fullProductList.filter(item =>
                            item.codigoProducto.toString().includes(filters.codigo)).length / rowsPerPage)}
                    >
                        &#x276F;
                    </button>
                </div>
            )}

            {/* Modal para mostrar la imagen */}
            {modalImage && (
                <div className={styles.modal} onClick={closeModal}>
                    <div
                        className={styles.modalContent}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {modalImage.startsWith('data:image') ? (
                            <img
                                src={modalImage}
                                alt="Producto"
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

            {/* Modal de confirmación de eliminación */}
            {isDeleteConfirmationOpen && (
                <div
                    className={styles['delete-confirmation-modal']}
                    onClick={closeDeleteConfirmationModal}
                >
                    <div
                        className={styles['modalContent-delete']}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>Confirmar Eliminación</h3>
                        <p>¿Estás seguro de que desea eliminar los registros seleccionados?</p>

                        <div className={styles['delete-confirmation-modal-controls']}>
                            <button
                                onClick={handleDeleteItems}
                                className={styles['delete-button']}
                            >
                                Eliminar <DeleteOutlineIcon style={{ marginLeft: 1 }} />
                            </button>
                            <button
                                onClick={closeDeleteConfirmationModal}
                                className={styles['close-button']}
                            >
                                Cancelar X
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Botones de acción */}
            <div className={styles.actionButtons}>
                <button
                    type="button"
                    onClick={openDeleteConfirmationModal} // Abre el modal de confirmación de eliminación
                    className={styles.buttonEliminar}
                >
                    Eliminar <DeleteOutlineIcon style={{ marginLeft: 8 }} />
                </button>

                <button type="button" onClick={handleClear} className={styles.clearButton}>
                    Limpiar <CleaningServicesIcon style={{ marginLeft: 8 }} />
                </button>

                <button
                    type="button"
                    onClick={() => (window.location.href = '/menu-principal')}
                    className={styles.exitButton}
                >
                    Salir <ExitToAppIcon style={{ marginLeft: 8 }} />
                </button>
            </div>
        </div>
    );
};

export default DeleteMerchandise;
