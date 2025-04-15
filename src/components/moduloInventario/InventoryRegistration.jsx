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

    // Función para guardar datos (proveedor y producto junto con la imagen)
    const handleSave = async () => {
        console.log("handleSave fue llamada"); // Paso 1

        // Validar si los campos están completos antes de proceder
        if (!validateFields()) {
            console.log("Validación fallida: faltan campos obligatorios");
            alert("Por favor, complete todos los campos obligatorios.");
            return; // Salir si hay campos vacíos
        }

        console.log("Los campos están completos y validados"); // Paso 2

        try {
            // Paso 1: Verificar si el proveedor ya existe en la API
            console.log("Obteniendo proveedores..."); // Paso 3
            const proveedores = await api.get('/proveedores'); // Obtener proveedores desde la API
            console.log("Proveedores obtenidos:", proveedores.data);
            const existingSupplier = proveedores.data.find(
                (sup) => sup.nitProveedor === supplierNIT // Buscar proveedor por NIT
            );
            let supplierId;

            if (existingSupplier) {
                // Si el proveedor ya existe, usar su ID
                supplierId = existingSupplier.idProveedor;
                console.log("Proveedor existente encontrado, ID:", supplierId); // Paso 4
            } else {
                console.log("Proveedor encontrado:", existingSupplier);
                // Si no existe, crearlo en la API
                console.log("Creando nuevo proveedor..."); // Paso 5
                const newSupplier = {
                    direccionProveedor: supplierAddress,
                    nitProveedor: supplierNIT,
                    nombreProveedor: supplierName,
                    telefonoProveedor: supplierPhone,
                };
                const supplierResponse = await api.post('/proveedores', newSupplier); // Guardar proveedor
                supplierId = supplierResponse.data.idProveedor; // Obtener el ID generado
                console.log("Nuevo proveedor creado, ID:", supplierId); // Paso 6
            }

            // Paso 2: Verificar si el producto ya existe en la API
            console.log("Obteniendo productos..."); // Paso 7
            const productos = await api.get('/productos'); // Obtener productos desde la API
            console.log("Productos obtenidos:", productos.data);
            const existingProduct = productos.data.find(
                (prod) => prod.codigoProducto === productCode && prod.idProveedor === supplierId
            );

            if (existingProduct) {
                // Si el producto ya existe, mostrar alerta y salir
                alert("El código del producto ya existe para este proveedor.");
                return; // Salir si hay duplicados
            }

            console.log("El producto no existe, creando..."); // Paso 8

            // Paso 3: Procesar la imagen si se ha cargado
            let productImageBase64 = null;
            if (productImage) {
                productImageBase64 = await procesarImagen(productImage); // Convertir imagen a Base64
                console.log("Imagen procesada en Base64:", productImageBase64);
            }

            // Paso 4: Crear el producto con la imagen y guardarlo en la API
            const newProduct = {
                producto: {
                    codigoProducto: productCode,
                    nombreProducto: productName,
                    cantidad: parseInt(productQuantity, 10),
                    valorUnitarioProducto: parseFloat(unitValue),
                    valorTotalProducto: parseFloat(totalValue), // Incluir el valor total
                    imagen: productImageBase64, // Incluir imagen codificada en Base64
                },
                nombreCategoria: productCategory,
                nombreProveedor: supplierName,
                nitProveedor: supplierNIT,
                direccionProveedor: supplierAddress,
                telefonoProveedor: supplierPhone
            };
            console.log("Datos enviados al backend:", JSON.stringify(newProduct, null, 2)); // Paso 11
            console.log("Enviando petición POST a /api/productos:", newProduct); // Paso 9
            const productResponse = await api.post('/productos', newProduct); // Guardar producto en la API

            // Confirmar creación exitosa
            if (productResponse.status === 201) {
                alert(`Producto registrado exitosamente con ID: ${productResponse.data.idProducto}`);
            } else {
                alert("Se creó el producto, pero ocurrió un problema inesperado.");
            }

            handleClear(); // Limpiar formulario después del guardado exitoso
            console.log("Formulario limpiado"); // Paso 10

        } catch (error) {
            console.error("Error al guardar los datos:", error);
            if (error.response && error.response.status === 400) {
                // Error de validación
                const validationErrors = error.response.data;
                console.error("Errores de validación:", validationErrors);

                // Muestra los errores al usuario (ejemplo)
                let errorMessage = "Error de validación:\n";
                for (const field in validationErrors) {
                    errorMessage += `${field}: ${validationErrors[field]}\n`;
                }
                alert(errorMessage);
            } else {
                // Otro tipo de error
                alert("Hubo un error al guardar los datos. Por favor, inténtelo de nuevo.");
            }
        }
    };


    return (
        <div>InventoryRegistration</div>
    )
}

export default InventoryRegistration