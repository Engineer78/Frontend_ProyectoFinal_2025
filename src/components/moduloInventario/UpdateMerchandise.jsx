import { useState, useEffect } from "react";
import Header from "./Header";
import styles from "../styles/updatemerchandise.module.css";
import SaveIcon from "@mui/icons-material/Save";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SearchIcon from "@mui/icons-material/Search";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Link } from "react-router-dom";
import axios from "axios"; // Importa axios
import { number } from "yup";

const api = axios.create({ // Crea una instancia de axios
    baseURL: 'http://localhost:8080/api'
});

const UpdateMerchandise = () => {
    const [supplierId, setSupplierId] = useState("");
    const [supplierName, setSupplierName] = useState("");
    const [supplierNIT, setSupplierNIT] = useState("");
    const [supplierPhone, setSupplierPhone] = useState("");
    const [supplierAddress, setSupplierAddress] = useState("");
    const [productCategory, setProductCategory] = useState("");
    const [suppliers, setSuppliers] = useState([]);
    const [productCode, setProductCode] = useState("");
    const [productName, setProductName] = useState("");
    const [productQuantity, setProductQuantity] = useState("");
    const [unitValue, setUnitValue] = useState("");
    const [totalValue, setTotalValue] = useState("");
    const [productImage, setProductImage] = useState(null);
    const [productImageUrl, setProductImageUrl] = useState("");
    const [originalProductIndex, setOriginalProductIndex] = useState(-1);
    const [activeTab, setActiveTab] = useState('actualizar');
    const [selectedCategoryId, setSelectedCategoryId] = useState(""); // ID de la categoría seleccionada
    const [categories, setCategories] = useState([]); // Lista completa de categorías
    const [isCodeDisabled, setIsCodeDisabled] = useState(false);

     // Cambia la pestaña activa del componente según la opción seleccionada
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

  // Calcula el valor total automáticamente cuando cambian la cantidad o el valor unitario
    useEffect(() => {
        if (productQuantity && unitValue) {
            const total = parseFloat(productQuantity) * parseFloat(unitValue);
            setTotalValue(total.toFixed(2));
        }
    }, [productQuantity, unitValue]);

     // Función para obtener la fuente de la imagen
    // Esta función se encarga de determinar la fuente de la imagen a mostrar
    const getImageSource = () => {
        if (productImage) {
            return URL.createObjectURL(productImage);
        }

        if (
            productImageUrl &&
            productImageUrl.startsWith("data:image/") &&
            productImageUrl.includes("base64")
        ) {
            return productImageUrl;
        }

        return "src/assets/placeholder-image.png";

    // Carga la lista de proveedores al montar el componentee
    useEffect(() => {
        api.get('/proveedores')
            .then(res => setSuppliers(res.data))  // ✅ Asegúrate que sea setSuppliers
            .catch(err => console.error("Error cargando proveedores", err));
    }, []);
    };

    // Cargar categorías al iniciar el componente
    useEffect(() => {
        api.get('/categorias')
        .then(res => setCategories(res.data))
        .catch(err => console.error("Error cargando categorías", err));
    }, []);
}  