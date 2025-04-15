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
    
    return (
        <div>

        </div>
    );
};

export default DeleteMerchandise;
