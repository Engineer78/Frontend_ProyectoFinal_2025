import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { usePermisos } from "../../components/admin/PermisosContext"; 
import Header from "../Header";
import modalStyles from "../../styles/modalstyles.module.css";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import useInactivityLogout from "../../useInactivityLogout";
import useTokenAutoLogout from "../../useTokenAutoLogout";
import CloseIcon from '@mui/icons-material/Close';
import styles from "../../styles/inventoryregistration.module.css";
import api from "../../api"; // Importa la instancia de Axios configurada


// se crea el componente InventoryRegistration
const InventoryRegistration = () => {

    useInactivityLogout(); // Llama al hook para manejar el logout por inactividad
    useTokenAutoLogout();  // Hook para expiración de token


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

    // Se utiliza el hook usePermisos para obtener los permisos del usuario
    const { permisos } = usePermisos();
    // Se utiliza el hook usePermisos para verificar si el usuario tiene permisos específicos
    const { tienePermiso } = usePermisos();

    console.log("Permisos del usuario:", permisos);

    // Se utiliza el hook useLocation para obtener la ubicación actual
    const location = useLocation();
    // Se obtiene la ruta actual para determinar si una pestaña está activa
    const currentPath = location.pathname;
    const isActive = (path) => currentPath === path;
    const [showAccessModal, setShowAccessModal] = useState(false);

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


    // Función para guardar datos (proveedor y producto junto con la imagen)
    const handleSave = async () => {
        console.log("handleSave fue llamada");

        // Validaciones personalizadas
        const errores = [];

        // Validar campos requeridos
        if (!supplierName) errores.push("Nombre del proveedor es obligatorio.");

        const nitRegex = /^\d{7,10}-\d{1}$/;
        if (!supplierNIT || !nitRegex.test(supplierNIT)) errores.push("NIT inválido. Ej: 123456789-0");

        const phoneRegex = /^\d{10}$/;
        if (!supplierPhone || !phoneRegex.test(supplierPhone)) errores.push("Teléfono debe tener 10 dígitos.");

        if (!supplierAddress) errores.push("Dirección del proveedor es obligatoria.");
        if (!productCategory) errores.push("Categoría del producto es obligatoria.");
        if (!productCode) errores.push("Código del producto es obligatorio.");
        if (!productName) errores.push("Nombre del producto es obligatorio.");

        const quantity = parseInt(productQuantity, 10);
        if (!productQuantity || isNaN(quantity) || quantity <= 0) errores.push("Cantidad debe ser un número mayor que 0.");

        const unit = parseFloat(unitValue);
        if (!unitValue || isNaN(unit) || unit <= 0) errores.push("Valor unitario debe ser un número mayor que 0.");

        if (productImage && !['image/jpeg', 'image/png'].includes(productImage.type)) {
            errores.push("Solo se permiten imágenes JPEG o PNG.");
        }

        if (errores.length > 0) {
            alert("Errores encontrados:\n" + errores.join('\n'));
            return;
        }

        // Formatear código
        const codigoFormateado = productCode.padStart(5, '0');
        setProductCode(codigoFormateado);

        // Recuperar token
        const token = localStorage.getItem("token");

        try {
            console.log("Obteniendo proveedores...");

            const proveedores = await api.get('/proveedores', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("Proveedores obtenidos:", proveedores.data);

            const existingSupplier = proveedores.data.find(
                (sup) => sup.nitProveedor === supplierNIT
            );

            let supplierId;

            if (existingSupplier) {
                supplierId = existingSupplier.idProveedor;
                console.log("Proveedor existente encontrado, ID:", supplierId);
            } else {
                console.log("Proveedor no encontrado. Creando nuevo proveedor...");

                const newSupplier = {
                    direccionProveedor: supplierAddress,
                    nitProveedor: supplierNIT,
                    nombreProveedor: supplierName,
                    telefonoProveedor: supplierPhone,
                };

                const supplierResponse = await api.post('/proveedores', newSupplier, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                supplierId = supplierResponse.data.idProveedor;
                console.log("Nuevo proveedor creado, ID:", supplierId);
            }

            console.log("Obteniendo productos...");

            const productos = await api.get('/productos', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("Productos obtenidos:", productos.data);

            const existingProduct = productos.data.find(
                (prod) => prod.codigoProducto === productCode && prod.idProveedor === supplierId
            );

            if (existingProduct) {
                alert("El código del producto ya existe para este proveedor.");
                return;
            }

            console.log("El producto no existe, creando...");

            let productImageBase64 = null;
            if (productImage) {
                productImageBase64 = await procesarImagen(productImage);
                console.log("Imagen procesada en Base64:", productImageBase64);
            }

            const newProduct = {
                producto: {
                    codigoProducto: productCode,
                    nombreProducto: productName,
                    cantidad: parseInt(productQuantity, 10),
                    valorUnitarioProducto: parseFloat(unitValue),
                    valorTotalProducto: parseFloat(totalValue),
                    imagen: productImageBase64,
                },
                nombreCategoria: productCategory,
                nombreProveedor: supplierName,
                nitProveedor: supplierNIT,
                direccionProveedor: supplierAddress,
                telefonoProveedor: supplierPhone
            };

            console.log("Enviando petición POST a /api/productos:", newProduct);

            const productResponse = await api.post('/productos', newProduct, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (productResponse.status === 201) {
                alert(`Producto registrado exitosamente con ID: ${productResponse.data.idProducto}`);
            } else {
                alert("Se creó el producto, pero ocurrió un problema inesperado.");
            }

            handleClear();
            console.log("Formulario limpiado");

        } catch (error) {
            console.error("Error al guardar los datos:", error);
            if (error.response && error.response.status === 400) {
                const validationErrors = error.response.data;
                console.error("Errores de validación:", validationErrors);

                let errorMessage = "Error de validación:\n";
                for (const field in validationErrors) {
                    errorMessage += `${field}: ${validationErrors[field]}\n`;
                }
                alert(errorMessage);
            } else {
                alert("Hubo un error al guardar los datos. Por favor, inténtelo de nuevo.");
            }
        }
    };

    // Función para procesar la imagen y convertirla a Base64
    const procesarImagen = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result;
                console.log("Cadena Base64:", base64String);
                resolve(base64String);
            };
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    // Limpiar el formulario
    const handleClear = () => {
        setSupplierName("");
        setSupplierNIT("");
        setSupplierPhone("");
        setSupplierAddress("");
        setProductCategory("");
        setProductCode("");
        setProductName("");
        setProductQuantity("");
        setUnitValue("");
        setTotalValue("");
        setProductImage(null);
    };

    // Se utiliza el hook useEffect para establecer la pestaña activa al cargar el componente.
    useEffect(() => {
        setActiveTab("registro");
    }, []);


    // Verifica si el usuario tiene permiso para registrar inventario
    // Si no tiene permiso, se deshabilitan los campos y botones del formulario
    const estaDeshabilitado = !tienePermiso("inventario:registrar");

    // Si el usuario no tiene permiso para registrar inventario, se muestra un modal de acceso denegado
    // cuando se intenta acceder a la pestaña de registro.
    useEffect(() => {
        if (activeTab === "registro" && !tienePermiso("inventario:registrar")) {
            setShowAccessModal(true);
        }
    }, [activeTab, permisos]);



    // Se renderiza el componente
    return (
        <>
            <Header
                title="Módulo registro de inventario"
                subtitle="Hardware Store Inventory FFIG"
                showLogo={true}
                showHelp={true}
            />

            {/* Pestañas debajo del header */}
            <div className={styles.tabs}>
                <Link
                    to="/inventory-registration"
                    className={`${styles.tabButton} ${isActive("/inventory-registration") ? styles.active : ""} ${!tienePermiso("inventario:registrar") ? styles.disabledTab : ""}`}
                    onClick={() => handleTabClick("registro")}
                >
                    Registrar Inventario
                </Link>

                <Link
                    to="/merchandise-query"
                    className={`${styles.tabButton} ${activeTab === "consulta" ? styles.active : ""} ${!tienePermiso("inventario:registrar") ? styles.disabledTab : ""}`}
                    onClick={() => handleTabClick("consulta")}
                >
                    Consultar Inventario
                </Link>

                <Link
                    to="/update-merchandise"
                    className={`${styles.tabButton} ${isActive("/update-merchandise") ? styles.active : ""} ${!tienePermiso("inventario:editar") ? styles.disabledTab : ""}`}
                    onClick={() => handleTabClick("actualizar")}
                >
                    Actualizar Inventario
                </Link>

                <Link
                    to="/delete-merchandise"
                    className={`${styles.tabButton} ${isActive("/delete-merchandise") ? styles.active : ""} ${!tienePermiso("inventario:eliminar") ? styles.disabledTab : ""}`}
                    onClick={() => handleTabClick("eliminar")}
                >
                    Eliminar Inventario
                </Link>
            </div>

            {/* Contenido dependiendo de la pestaña activa */}
            {activeTab === "registro" && (
                <div className={styles.container}>
                    <h2 className={styles.title}>
                        Ingrese la información solicitada para crear el registro
                    </h2>

                    <div className={styles.formContainer}>
                        <form className={styles.formLeft}>
                            <label className={styles.inputLabel}>Nombre del Proveedor:</label>
                            <input
                                type="text"
                                placeholder="Nombre del Proveedor (Obligatorio)"
                                value={supplierName}
                                onChange={(e) => setSupplierName(e.target.value.trimStart())}
                                required
                                className={styles.input}
                                disabled={estaDeshabilitado}
                                style={{ fontStyle: 'italic' }}
                            />

                            <label className={styles.inputLabel}>NIT:</label>
                            <input
                                type="text"
                                placeholder="NIT ejemplo 123456789-1 (Obligatorio)"
                                value={supplierNIT}
                                onChange={(e) => setSupplierNIT(e.target.value)}
                                required
                                className={styles.input}
                                title="Ingrese un NIT válido de hasta 15 caracteres, incluyendo el guion y el dígito de verificación."
                                disabled={estaDeshabilitado}
                                style={{ fontStyle: 'italic' }}
                            />

                            <label className={styles.inputLabel}>Teléfono:</label>
                            <input
                                type="text"
                                placeholder="Teléfono (Obligatorio)"
                                value={supplierPhone}
                                onChange={(e) => setSupplierPhone(e.target.value)}
                                required
                                className={styles.input}
                                title="Ingrese un número de celular colombiano sin el código de país. Debe contener exactamente 10 dígitos numéricos."
                                disabled={estaDeshabilitado}
                                style={{ fontStyle: 'italic' }}
                            />

                            <label className={styles.inputLabel}>Dirección:</label>
                            <input
                                type="text"
                                placeholder="Dirección (Obligatorio)"
                                value={supplierAddress}
                                onChange={(e) => setSupplierAddress(e.target.value)}
                                required
                                className={styles.input}
                                disabled={estaDeshabilitado}
                                style={{ fontStyle: 'italic' }}
                            />

                            <label className={styles.inputLabel}>Crear Categoría del Producto:</label>
                            <input
                                type="text"
                                placeholder="Categoría del Producto (Obligatorio)"
                                value={productCategory}
                                onChange={(e) => setProductCategory(e.target.value)}
                                required
                                className={styles.input}
                                disabled={estaDeshabilitado}
                                style={{ fontStyle: 'italic' }}
                            />

                            <label className={styles.inputLabel}>Crear Código del Producto:</label>
                            <input
                                type="text"
                                placeholder="Código del Producto (Obligatorio)"
                                value={productCode}
                                onChange={(e) => setProductCode(e.target.value)}
                                required
                                className={styles.input}
                                title="El código del producto debe contener solo dígitos numéricos (entre 1 y 5 cifras). Se permiten ceros a la izquierda."
                                disabled={estaDeshabilitado}
                                style={{ fontStyle: 'italic' }}
                            />

                            <label className={styles.inputLabel}>Nombre del Producto:</label>
                            <input
                                type="text"
                                placeholder="Nombre del Producto (Obligatorio)"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                required
                                className={styles.input}
                                disabled={estaDeshabilitado}
                                style={{ fontStyle: 'italic' }}
                            />

                            <label className={styles.inputLabel}>Cantidad:</label>
                            <input
                                type="number"
                                placeholder="Cantidad (Obligatorio)"
                                value={productQuantity}
                                onChange={(e) => setProductQuantity(e.target.value)}
                                required
                                className={styles.input}
                                title="Ingrese una cantidad mayor o igual a cero. No se permiten valores negativos."
                                disabled={estaDeshabilitado}
                                style={{ fontStyle: 'italic' }}
                            />

                            <label className={styles.inputLabel}>Valor Unitario:</label>
                            <input
                                type="number"
                                placeholder="Valor Unitario (Obligatorio)"
                                value={unitValue}
                                onChange={(e) => setUnitValue(e.target.value)}
                                required
                                className={styles.input}
                                disabled={estaDeshabilitado}
                                style={{ fontStyle: 'italic' }}
                            />

                            <label className={styles.inputLabel}>Valor Total:</label>
                            <input
                                type="text"
                                placeholder="Valor Total"
                                value={totalValue}
                                className={styles.inputValorTotal}
                                disabled
                                style={{ fontStyle: 'italic' }}
                            />
                        </form>

                        <form className={styles.formRight}>
                            <label id="productImageLabel" className={styles.imageLabel}>
                                Imagen del Producto
                            </label>
                            <div className={styles.imageWrapper}>
                                <img
                                    src={
                                        productImage
                                            ? URL.createObjectURL(productImage)
                                            : "src/assets/placeholder-image.png" // Ruta relativa de la imagen local
                                    }
                                    alt="Vista previa"
                                    className={styles.image}
                                />
                                <input
                                    type="file"
                                    onChange={(e) => setProductImage(e.target.files[0])}
                                    className={styles.fileInput}
                                    id="fileInput"
                                    disabled={estaDeshabilitado}

                                />
                                <label htmlFor="fileInput" className={styles.customFileInput} disabled={estaDeshabilitado}
                                >
                                    Cargar Imagen <UploadFileIcon style={{ marginLeft: 8 }} />
                                </label>
                            </div>
                        </form>
                    </div>
                    <div className={styles.actionButtons}>
                        <button type="button" onClick={handleSave} className={styles.saveButton} disabled={estaDeshabilitado}
                        >
                            Guardar <SaveOutlinedIcon style={{ marginLeft: 8 }} />
                        </button>
                        <button type="button" onClick={handleClear} className={styles.clearButton} disabled={estaDeshabilitado}
                        >
                            Limpiar <CleaningServicesIcon style={{ marginLeft: 8 }} />
                        </button>
                        <button
                            type="button"
                            onClick={() => (window.location.href = "/menu-principal")}
                            className={styles.exitButton}
                        >
                            Salir <ExitToAppIcon style={{ marginLeft: 8 }} />
                        </button>
                    </div>
                </div>
            )}

            {/* Modal de mensaje para usuarios sin permiso de registrar */}
            {activeTab === "registro" && showAccessModal && !tienePermiso("inventario:registrar") && (
                <div className={modalStyles.modalOverlay}>
                    <div className={modalStyles.modalContent}>
                        <button
                            className={modalStyles.modalCloseButton}
                            onClick={() => setShowAccessModal(false)} // ✅ Solo cierra el modal
                        >
                            <CloseIcon />
                        </button>
                        <label className={modalStyles.title}>Acceso Denegado</label>

                        <div className={modalStyles.formGroup}>
                            <p>No tienes permisos para acceder a esta pestaña.</p>
                            <p>Por favor, dirígete a la sección de consulta.</p>
                        </div>

                        <div className={modalStyles.modalButtonGroup}>
                            {tienePermiso("inventario:consultar") && (
                                <button
                                    className={modalStyles.modalButtonExit}
                                    onClick={() => window.location.href = "/merchandise-query"} // ✅ Redirige al módulo
                                >
                                    Ir a Consultar
                                </button>
                            )};
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default InventoryRegistration;