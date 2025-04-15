import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Header from "./Header";
import styles from "../styles/inventoryregistration.module.css";
import SaveIcon from '@mui/icons-material/Save';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import axios from "axios";

// se crea el componente InventoryRegistration
const InventoryRegistration = () => {

    // Se instancia axios para realizar las peticiones a la API
    // Se define la URL base de la API
    const api = axios.create({
        baseURL: 'http://localhost:8080/api'
    });

    // Se definen los estados para los campos del formulario
    const [supplierName, setSupplierName] = useState("");
    const [supplierNIT, setSupplierNIT] = useState("");
    const [supplierPhone, setSupplierPhone] = useState("");
    const [supplierAddress, setSupplierAddress] = useState("");
    const [productCategory, setProductCategory] = useState("");
    const [productCode, setProductCode] = useState("");
    const [productName, setProductName] = useState("");
    const [productQuantity, setProductQuantity] = useState("");
    const [unitValue, setUnitValue] = useState("");
    const [totalValue, setTotalValue] = useState("");
    const [productImage, setProductImage] = useState(null);
    const [activeTab, setActiveTab] = useState("registro");

    // Manejar cambio de pestaña
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    // Calcular valor total automáticamente
    // cuando cambian la cantidad del producto o el valor unitario
    // Se utiliza el hook useEffect para calcular el valor total.
    useEffect(() => {
        if (productQuantity && unitValue) {
            const total = parseFloat(productQuantity) * parseFloat(unitValue);
            setTotalValue(total.toFixed(2));
        }
    }, [productQuantity, unitValue]);

    // Se define una función para validar los campos vacios del formulario.
    const validateFields = () => {
        return (
            supplierName &&
            supplierNIT &&
            supplierPhone &&
            supplierAddress &&
            productCategory &&
            productCode &&
            productName &&
            productQuantity &&
            unitValue
        );
    };


    return (
        <div>InventoryRegistration</div>
    )
}

export default InventoryRegistration