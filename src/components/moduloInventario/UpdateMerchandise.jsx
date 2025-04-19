import { useState, useEffect } from "react";
import Header from "../Header";
import styles from "../../styles/updatemerchandise.module.css";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
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
    };

    // Carga la lista de proveedores al montar el componentee
    useEffect(() => {
        api.get('/proveedores')
            .then(res => setSuppliers(res.data))  // ✅ Asegúrate que sea setSuppliers
            .catch(err => console.error("Error cargando proveedores", err));
    }, []);

    // Cargar categorías al iniciar el componente
    useEffect(() => {
        api.get('/categorias')
        .then(res => setCategories(res.data))
        .catch(err => console.error("Error cargando categorías", err));
    }, []);

    // Busca un producto por su código y llena el formulario con los datos del producto encontrado
    const handleSearch = async () => {
        const trimmedProductCode = productCode.trim();
    
        if (!trimmedProductCode) {
            alert("Por favor, ingrese el Código del Producto para buscar.");
            return;
        }
    
        try {
            const response = await api.get(`/productos/codigo/${trimmedProductCode}`);
    
            if (!response.data) {
                alert("No se encontraron datos para el Código del Producto proporcionado.");
                setOriginalProductIndex(-1);
                handleClear();
                return;
            }
    
            // Si se encuentra el producto, llenar el formulario con los datos
            const product = response.data;
            setOriginalProductIndex(product.idProducto);
            setSupplierId(Number(product.idProveedor) || "");
            setSupplierName(product.nombreProveedor || "");
            setSupplierNIT(product.nitProveedor || "");
            setSupplierPhone(product.telefonoProveedor || "");
            setSupplierAddress(product.direccionProveedor || "");
            setProductCategory(product.nombreCategoria || "");
    
            // Buscar el ID de la categoría basado en el nombre
            const categoriaEncontrada = categories.find(
                (cat) => cat.nombreCategoria === product.nombreCategoria
            );
            if (categoriaEncontrada) {
                setSelectedCategoryId(categoriaEncontrada.idCategoria);
            }
        
            setProductCode(product.codigoProducto || "");
            setIsCodeDisabled(true);
            setProductName(product.nombreProducto || "");
            setProductQuantity(product.cantidad || "");
            setUnitValue(product.valorUnitarioProducto || "");
    
            // Validar y asignar correctamente la imagen
            console.log("Imagen recibida:", product.imagen);
            const imagenConPrefijo =
                product.imagen && !product.imagen.startsWith("data:image")
                ? `data:image/png;base64,${product.imagen}`
                : product.imagen || "";
        
            setProductImageUrl(imagenConPrefijo);

            console.log("Producto recibido:", response.data);
        
            alert("Datos encontrados. Puede actualizarlos ahora.");
        } catch (error) {
            console.error("Error al buscar el producto:", error);
            alert("Hubo un error al buscar el producto. Por favor, inténtelo de nuevo.");
            setOriginalProductIndex(-1);
            handleClear();
        }
    };

    // Maneja la actualización del producto tras validar los campos, procesar la imagen y enviar los datos al backend
    const handleSave = async () => {
        if (!validateFields()) {
            alert("Por favor, complete todos los campos obligatorios.");
            return;
        }
    
        if (originalProductIndex === -1) {
            alert("No se encontró el producto para actualizar. Realice una búsqueda primero.");
            return;
        }
    
        try {
            // Procesar la imagen si se ha cargado una nueva imagen
            let productImageBase64 = productImageUrl; // Inicializar con el valor actual de la URL
            if (productImage) { // Solo procesar si hay una nueva imagen
                productImageBase64 = await procesarImagen(productImage);
                console.log("Imagen procesada en Base64:", productImageBase64);
            }
    
            const categoriaSeleccionada = categories.find(cat => cat.idCategoria === parseInt(selectedCategoryId));
            const nombreCategoria = categoriaSeleccionada ? categoriaSeleccionada.nombreCategoria : "";
        
            // Construir el objeto con los datos actualizados del producto
            const updatedProduct = {
                idProducto: originalProductIndex,
                codigoProducto: parseInt(productCode),
                nombreProducto: productName,
                cantidad: parseInt(productQuantity),
                valorUnitarioProducto: parseFloat(unitValue),
                imagen: productImageBase64,
                nombreCategoria: nombreCategoria,
                idProveedor: supplierId, // ya es número, no necesitas parseInt
                nitProveedor: supplierNIT,
                direccionProveedor: supplierAddress,
                telefonoProveedor: supplierPhone
            };
        
            console.log("Datos a enviar:", updatedProduct);
        
            // Hacer la llamada a la API para actualizar el producto
            const response = await api.put(`/productos/${originalProductIndex}`, updatedProduct);
        
            if (response.status === 200) {
                alert("Producto actualizado exitosamente.");
        
            // Actualizar la interfaz con los datos nuevos que retorna el backend
                const updated = response.data;
                setSupplierName(updated.nombreProveedor || "");
                setSupplierNIT(updated.nitProveedor || "");
                setSupplierPhone(updated.telefonoProveedor || "");
                setSupplierAddress(updated.direccionProveedor || "");
                setProductCategory(updated.nombreCategoria || "");
                setProductName(updated.nombreProducto || "");
                setProductQuantity(updated.cantidad || "");
                setUnitValue(updated.valorUnitarioProducto || "");
                setTotalValue((updated.cantidad * updated.valorUnitarioProducto).toFixed(2));
                setProductImageUrl(updated.imagen || "");
        
                // Limpiar solo el estado de imagen si se desea
                setProductImage(null);
        
                handleClear(); // Limpiar los campos del formulario
            }
            else {
                alert("Hubo un error al actualizar el producto. Por favor, inténtelo de nuevo.");
            }
        
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            if (error.response) {
                console.log("Respuesta del servidor:", error.response.data);
            }
            alert("Hubo un error al actualizar el producto. Por favor, inténtelo de nuevo.");
        }
    };

    // Función para procesar la imagen y convertirla a Base64
    const procesarImagen = (file) => {
        return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result;
            console.log("Cadena Base64:", base64String); // Agrega esto
            resolve(base64String);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
        });
    };

      // Valida que todos los campos obligatorios del formulario estén completos antes de guardar
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

     // Limpia todos los campos del formulario y restablece el estado inicial
    const handleClear = () => {
        setSupplierId("");
        setSupplierName("");
        setSupplierNIT("");
        setSupplierPhone("");
        setSupplierAddress("");
        setSelectedCategoryId("");
        setProductCategory("");
        setProductCode("");
        setProductName("");
        setProductQuantity("");
        setUnitValue("");
        setTotalValue("");
        setProductImage(null);
        setProductImageUrl("");
        setIsCodeDisabled(false); // Permite volver a escribir otro código
    };

    // Establece la pestaña activa en 'actualizar' al cargar el componente
    useEffect(() => {
        setActiveTab('actualizar');
    }, []);

     // Componente para actualizar productos del inventario.
    // Incluye navegación entre pestañas, formulario de búsqueda y edición de producto,
    // carga de imagen, y botones para guardar, limpiar o salir.
    return (
        <>
            <Header
                title="Módulo registro de inventario"
                subtitle="Hardware Store Inventory FFIG"
                showLogo={true}
                showHelp={true}
            />

            <div className={styles.tabs}>
                <Link
                    to="/inventory-registration"
                    className={`${styles.tabButton} ${activeTab === "registro" ? styles.active : ""}`}
                    onClick={() => handleTabClick("registro")}
                >
                    Registro de Producto
                </Link>

                <Link
                    to="/merchandise-query"
                    className={`${styles.tabButton} ${activeTab === "consulta" ? styles.active : ""}`}
                    onClick={() => handleTabClick("consulta")}
                >
                    Consulta de Producto
                </Link>

                <Link
                    to="/update-merchandise"
                    className={`${styles.tabButton} ${activeTab === "actualizar" ? styles.active : ""}`}
                    onClick={() => handleTabClick("actualizar")}
                >
                    Actualizar Producto
                </Link>

                <Link
                    to="/delete-merchandise"
                    className={`${styles.tabButton} ${activeTab === "eliminar" ? styles.active : ""}`}
                    onClick={() => handleTabClick("eliminar")}
                >
                    Eliminar Producto
                </Link>
            </div>

            {activeTab === "actualizar" && (
                <div className={styles.container}>
                    <h2 className={styles.title}>
                        Ingrese el Código del Producto para buscar y actualizar el registro
                    </h2>

                    <div className={styles.formContainer}>
                        <form className={styles.formLeft}>
                            <label className={styles.inputLabel}>Código del Producto:</label>
                            <input
                                type="text"
                                placeholder="Código del producto (Obligatorio)"
                                value={productCode}
                                onChange={(e) => setProductCode(e.target.value)}
                                required
                                className={styles.input}
                                disabled={isCodeDisabled} // Deshabilita el input si se busca un producto
                            />

                            <button
                                type="button"
                                onClick={handleSearch}
                                className={styles.searchButton}
                            >
                                Buscar <SearchIcon style={{ marginLeft: 5 }} />
                            </button>

                            <label className={styles.inputLabel}>Nombre del Proveedor:</label>
                            <select
                                value={supplierId}
                                onChange={(e) => setSupplierId(Number(e.target.value))} //Con esto se asegura que el valor sea un númer
                                className={styles.input}
                                style={{ fontStyle: 'italic' }}
                            >
                                <option value="">Seleccione un proveedor</option>
                                {suppliers.map((proveedor) => (
                                <option key={proveedor.idProveedor} value={proveedor.idProveedor}>
                                    {proveedor.nombreProveedor}
                                </option>
                                ))}
                            </select>

                            <label className={styles.inputLabel}>NIT:</label>
                            <input
                                type="text"
                                placeholder="NIT"
                                value={supplierNIT}
                                onChange={(e) => setSupplierNIT(e.target.value)}
                                className={styles.input}
                            />

                            <label className={styles.inputLabel}>Teléfono:</label>
                            <input
                                type="text"
                                placeholder="Teléfono"
                                value={supplierPhone}
                                onChange={(e) => setSupplierPhone(e.target.value)}
                                className={styles.input}
                            />

                            <label className={styles.inputLabel}>Dirección:</label>
                            <input
                                type="text"
                                placeholder="Dirección"
                                value={supplierAddress}
                                onChange={(e) => setSupplierAddress(e.target.value)}
                                className={styles.input}
                            />

                            <label className={styles.inputLabel}>Categoría:</label>
                            <select
                                className={styles.input}
                                value={selectedCategoryId}
                                onChange={(e) => setSelectedCategoryId(number(e.target.value))}
                                style={{ fontStyle: 'italic' }}
                            >
                                <option value="">Seleccione una categoría</option>
                                {categories.map((cat) => (
                                <option key={cat.idCategoria} value={cat.idCategoria}>
                                    {cat.nombreCategoria}
                                </option>
                                ))}
                            </select>

                            <label className={styles.inputLabel}>Nombre del Producto:</label>
                            <input
                                type="text"
                                placeholder="Nombre del Producto"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                className={styles.input}
                            />

                            <label className={styles.inputLabel}>Cantidad:</label>
                            <input
                                type="number"
                                placeholder="Cantidad"
                                value={productQuantity}
                                onChange={(e) => setProductQuantity(e.target.value)}
                                className={styles.input}
                            />

                            <label className={styles.inputLabel}>Valor Unitario:</label>
                            <input
                                type="number"
                                placeholder="Valor Unitario"
                                value={unitValue}
                                onChange={(e) => setUnitValue(e.target.value)}
                                className={styles.input}
                            />

                            <label className={styles.inputLabel}>Valor Total:</label>
                            <input
                                type="text"
                                value={totalValue}
                                className={styles.input}
                                disabled
                            />
                        </form>

                        <form className={styles.formRight}>
                            <label id="productImageLabel" className={styles.imageLabel}>
                                Imagen del Producto
                            </label>
                            <div className={styles.imageWrapper}>
                                {getImageSource() && (
                                    <img
                                        src={getImageSource()}
                                        alt="Vista previa"
                                        className={styles.image}
                                    />
                                )}
                                <input
                                    type="file"
                                    onChange={(e) => setProductImage(e.target.files[0])}
                                    className={styles.fileInput}
                                    id="fileInput"
                                />
                                <label htmlFor="fileInput" className={styles.customFileInput}>
                                    Cargar Imagen <UploadFileIcon style={{ marginLeft: 5 }} />
                                </label>
                            </div>
                        </form>
                    </div>

                    <div className={styles.actionButtons}>
                        <button className={styles.updateButton} onClick={handleSave}>
                            Guardar <SaveIcon />
                        </button>
                        <button className={styles.clearButton} onClick={handleClear}>
                            Limpiar <CleaningServicesIcon />
                        </button>
                        <button
                            type="button"
                            onClick={() => (window.location.href = "/menu-principal")}
                            className={styles.exitButton} >
                            Salir <ExitToAppIcon /> </button>
                    </div>
                </div>
            )}
        </>
    );
};

    export default UpdateMerchandise;