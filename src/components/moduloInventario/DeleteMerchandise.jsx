import { useState, useEffect } from 'react';
import Header from '../Header';
import styles from '../../styles/deletemerchandise.module.css';
import { Link } from 'react-router-dom';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import axios from "axios"; // Importa axios

const api = axios.create({ // Crea una instancia de axios
    baseURL: 'http://localhost:8080/api'
});

const DeleteMerchandise = () => {
    const [activeTab, setActiveTab] = useState('eliminar');
    const [data, setData] = useState([]); // Almacena los datos combinados y filtrados
    const [fullProductList, setFullProductList] = useState([]); // Almacena la lista completa de productos
    const [filters, setFilters] = useState({
        codigo: '',
    }); // Filtros del usuario

    const [disabledInputs, setDisabledInputs] = useState({
        categoria: '',
        nombre: '',
        existencias: '',
        valorUnitario: '',
        valorTotal: '',
        proveedor: '',
        nitProveedor: '',
    });
    const [modalImage, setModalImage] = useState(null); // Estado para la imagen de la ventana flotante

    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false); // Modal confirmación eliminación
    const [isSearching, setIsSearching] = useState(false); // Control búsqueda activa
    const [selectedItems, setSelectedItems] = useState([]); // Registros seleccionados
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 6;

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const openDeleteConfirmationModal = () => {
        setIsDeleteConfirmationOpen(true);
    };

    const closeDeleteConfirmationModal = () => {
        setIsDeleteConfirmationOpen(false);
    };
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

            await axios.delete(`http://localhost:8080/api/productos/${idProducto}`);

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
            });
            return; // No sigas con filtrado
        }

        const filtered = fullProductList.filter((item) =>
            item.codigoProducto.toString().includes(filters.codigo)
        );

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
            });
        }
        // Si hay filtros activos y hay elementos para mostrar, activa la búsqueda
        // y establece el estado de búsqueda en verdadero
        if (hasActiveFilters && itemsToShow.length > 0 && !isSearching) {
            setIsSearching(true);
        }
    }, [filters, currentPage, fullProductList, isSearching]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
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
            });
        }

        if (!isSearching) setIsSearching(true);
    };

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
        });
        setData([]);
        setIsSearching(false);
    };

    const handleImageClick = (imageUrl) => {
        setModalImage(imageUrl);
    };

    const closeModal = () => {
        setModalImage(null);
    };
    return (
        <div className={styles.scrollContainer}>
            <Header
                title="Módulo registro de inventario"
                subtitle="Hardware Store Inventory FFIG"
                showLogo={true}
                showHelp={true}
            />

            <div className={styles.tabs}>
                <Link
                    to="/inventory-registration"
                    className={`${styles.tabButton} ${activeTab === 'registro' ? styles.active : ''
                        }`}
                    onClick={() => handleTabClick('registro')}
                >
                    Registrar Inventario
                </Link>
                <Link
                    to="/merchandise-query"
                    className={`${styles.tabButton} ${activeTab === 'consulta' ? styles.active : ''
                        }`}
                    onClick={() => handleTabClick('consulta')}
                >
                    Consultar Inventario
                </Link>
                <Link
                    to="/update-merchandise"
                    className={`${styles.tabButton} ${activeTab === 'actualizar' ? styles.active : ''
                        }`}
                    onClick={() => handleTabClick('actualizar')}
                >
                    Actualizar Inventario
                </Link>
                <Link
                    to="/delete-merchandise"
                    className={`${styles.tabButton} ${activeTab === 'eliminar' ? styles.active : ''
                        }`}
                    onClick={() => handleTabClick('eliminar')}
                >
                    Eliminar Inventario
                </Link>
            </div>

            <div className={styles.container}>
                <h2 className={styles.title}>
                    Ingrese un código de producto y seleccione el registro que desea eliminar
                </h2>
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
                        <th>Nom. del Producto
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
                        <th>Valor Unitario
                            <input
                                type="text"
                                name="valorUnitario"
                                value={disabledInputs.valorUnitario}
                                placeholder="..."
                                disabled
                                style={{ fontStyle: 'italic' }}
                            />
                        </th>
                        <th>Valor Total Prod.
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
                        <th>NIT Proveedor
                            <input
                                type="text"
                                name="nitProveedor"
                                value={disabledInputs.nitProveedor}
                                placeholder="..."
                                disabled
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
                                <tr key={index}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            onChange={(e) => handleCheckboxChange(e, item)}
                                        />
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
