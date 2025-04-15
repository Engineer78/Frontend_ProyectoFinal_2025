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
    



  return (
    <div>InventoryRegistration</div>
  )
}

export default InventoryRegistration