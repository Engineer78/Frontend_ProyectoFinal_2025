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
}  