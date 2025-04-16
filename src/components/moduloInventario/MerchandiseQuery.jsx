import { useState, useEffect } from 'react';
import Header from './Header';
import styles from '../styles/merchandisequery.module.css';
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
    onst [isSearching, setIsSearching] = useState(false);

    // Estado para almacenar el producto seleccionado (cuando hay solo un resultado)
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Estado para mostrar los datos del producto seleccionado en los inputs deshabilitados
    const [headerInputs, setHeaderInputs] = useState({
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
    }, [filters]);

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
}