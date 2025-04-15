import { useState, useEffect } from 'react';
import Header from './Header';
import styles from '../styles/deletemerchandise.module.css';
import { Link } from 'react-router-dom';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import axios from "axios"; // Importa axios
import { divide } from 'lodash';

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

    const [visibleItems, setVisibleItems] = useState(10); // Control paginado de productos
    const [isLoadingMore, setIsLoadingMore] = useState(false); // Indicador de carga

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
    const handleLoadMore = () => {
        if (!isLoadingMore) {
            setIsLoadingMore(true);
            setVisibleItems((prev) => prev + 30);
            setIsLoadingMore(false);
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

        const itemsToShow = filtered.slice(0, visibleItems);
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
    }, [filters, visibleItems, fullProductList]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));

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
        <div>

        </div>
    );
};

export default DeleteMerchandise;
