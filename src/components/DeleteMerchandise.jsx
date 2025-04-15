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

    return (
        <div>

        </div>
    );
};

export default DeleteMerchandise;
