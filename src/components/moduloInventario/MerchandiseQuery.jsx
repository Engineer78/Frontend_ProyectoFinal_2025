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
}