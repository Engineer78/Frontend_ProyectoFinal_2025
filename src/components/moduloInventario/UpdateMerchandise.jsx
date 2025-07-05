import { useRef, useState, useEffect } from "react";
import { usePermisos } from "../../components/admin/PermisosContext";
import { actualizarProveedor } from "../../api";
import { Link } from "react-router-dom";
import Header from "../Header";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SearchIcon from "@mui/icons-material/Search";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloseIcon from '@mui/icons-material/Close';
import EditNoteIcon from '@mui/icons-material/EditNote';
import useInactivityLogout from "../../useInactivityLogout";
import useTokenAutoLogout from "../../useTokenAutoLogout";
import styles from "../../styles/updatemerchandise.module.css";
import api from "../../api"; // Importa tu instancia de API


// Componente para actualizar productos del inventario
const UpdateMerchandise = () => {

    useInactivityLogout(); // Llama al hook para manejar el logout por inactividad
    useTokenAutoLogout();  // Hook para expiración de token

    // Estados para manejar los datos del formulario
    // Estos estados almacenan la información del proveedor y del producto a actualizar
    const [supplierId, setSupplierId] = useState("");
    const [supplierName, setSupplierName] = useState("");
    const [supplierNIT, setSupplierNIT] = useState("");
    const [supplierPhone, setSupplierPhone] = useState("");
    const [supplierAddress, setSupplierAddress] = useState("");
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

    // Estados para el Modal de edición de proveedor
    const [isProveedorModalOpen, setProveedorModalOpen] = useState(false);
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
    const [nuevoNombreProveedor, setNuevoNombreProveedor] = useState("");
    const [proveedorFiltro, setProveedorFiltro] = useState("");

    // Estados para el Modal de edición de categoría
    const [isCategoriaModalOpen, setCategoriaModalOpen] = useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const [nuevoNombreCategoria, setNuevoNombreCategoria] = useState("");
    const [categoriaFiltro, setCategoriaFiltro] = useState("");

    // Hook para manejar permisos de usuario
    // Este hook permite verificar si el usuario tiene permisos para realizar ciertas acciones
    const { tienePermiso } = usePermisos();


    // Función para convertir un valor a número entero
    const number = (value) => parseInt(value, 10);

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
            .then(res => {
                console.log("📦 Proveedores cargados:", res.data);
                setSuppliers(res.data); // ✅ Asegúrate que sea setSuppliers
            })
            .catch(err => console.error("Error cargando proveedores", err));
    }, []);

    const categoriasCargadas = useRef(false);

    // Cargar categorías al iniciar el componente
    useEffect(() => {
        api.get('/categorias')
            .then(res => {
                setCategories(res.data);
                categoriasCargadas.current = true;
            })
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
            setSelectedCategoryId(product.idCategoria);

            // Verificar si las categorías ya fueron cargadas antes de buscar el ID
            if (categoriasCargadas.current) {
                // Buscar el ID de la categoría basado en el nombre
                const categoriaEncontrada = categories.find(
                    (cat) => cat.nombreCategoria === product.nombreCategoria
                );

                if (categoriaEncontrada) {
                    setSelectedCategoryId(categoriaEncontrada.idCategoria);
                } else {
                    console.warn("⚠️ Categoría no encontrada en la lista.");
                    setSelectedCategoryId(""); // Vacía si no coincide
                }
            } else {
                console.warn("⏳ Categorías aún no estaban cargadas al buscar.");
                setSelectedCategoryId(""); // Previene fallos si aún no hay categorías
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

    // Maneja el cambio de proveedor seleccionado en el formulario
    const handleSupplierChange = (e) => {
        const selectedId = parseInt(e.target.value);
        setSupplierId(selectedId);

        const selectedSupplier = suppliers.find((s) => s.idProveedor === selectedId);
        if (selectedSupplier) {
            setSupplierName(selectedSupplier.nombreProveedor || "");
            setSupplierNIT(selectedSupplier.nitProveedor || "");
            setSupplierPhone(selectedSupplier.telefonoProveedor || "");
            setSupplierAddress(selectedSupplier.direccionProveedor || "");
            console.log("Proveedor seleccionado:", selectedSupplier); // Para verificar
        }
    };


    // Maneja la actualización del producto tras validar los campos, procesar la imagen y enviar los datos al backend
    const handleSave = async () => {
        if (!validateFields()) {
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
                nombreProveedor: supplierName,
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
        if (!supplierName) {
            alert("Por favor, seleccione un proveedor.");
            return false;
        }
        if (!supplierNIT) {
            alert("Por favor, ingrese el NIT del proveedor.");
            return false;
        }
        if (!supplierPhone) {
            alert("Por favor, ingrese el número de teléfono del proveedor.");
            return false;
        }
        if (!supplierAddress) {
            alert("Por favor, ingrese la dirección del proveedor.");
            return false;
        }
        if (!selectedCategoryId) {
            alert("Por favor, seleccione una categoría para el producto.");
            return false;
        }
        if (!productName) {
            alert("Por favor, ingrese el nombre del producto.");
            return false;
        }
        if (!productQuantity) {
            alert("Por favor, ingrese la cantidad del producto.");
            return false;
        }
        if (!unitValue) {
            alert("Por favor, ingrese el valor unitario del producto.");
            return false;
        }

        return true;
    };


    // Limpia todos los campos del formulario y restablece el estado inicial
    const handleClear = () => {
        setSupplierId("");
        setSupplierName("");
        setSupplierNIT("");
        setSupplierPhone("");
        setSupplierAddress("");
        setSelectedCategoryId("");
        setSelectedCategoryId("");
        setProductCode("");
        setProductName("");
        setProductQuantity("");
        setUnitValue("");
        setTotalValue("");
        setProductImage(null);
        setProductImageUrl("");
        setIsCodeDisabled(false); // Permite volver a escribir otro código
        setProveedorFiltro("");
        setProveedorSeleccionado(null);
        setNuevoNombreProveedor("");
        setCategoriaFiltro("");
        setCategoriaSeleccionada(null);
        setNuevoNombreCategoria("");
    };

    // Maneja la actualización del proveedor seleccionado en el modal
    const handleActualizarProveedor = async () => {
        if (!proveedorSeleccionado) {
            alert("Por favor, seleccione un proveedor para actualizar.");
            return;
        }

        if (!nuevoNombreProveedor.trim()) {
            alert("Por favor, ingrese un nuevo nombre para el proveedor.");
            return;
        }

        const proveedorOriginal = suppliers.find(p => p.idProveedor === proveedorSeleccionado);

        if (!proveedorOriginal) {
            alert("Proveedor no encontrado en la lista.");
            return;
        }

        try {
            const response = await actualizarProveedor(proveedorSeleccionado, {
                idProveedor: proveedorOriginal.idProveedor,
                nombreProveedor: nuevoNombreProveedor.trim(),
                nitProveedor: proveedorOriginal.nitProveedor,
                direccionProveedor: proveedorOriginal.direccionProveedor,
                telefonoProveedor: proveedorOriginal.telefonoProveedor
            });

            if (response.status === 200) {
                alert("Proveedor actualizado correctamente.");
                setProveedorFiltro("");
                setProveedorSeleccionado(null);
                setNuevoNombreProveedor("");
                setProveedorModalOpen(false);
            } else {
                alert("No se pudo actualizar el proveedor.");
            }
        } catch (error) {
            console.error("Error al actualizar el proveedor:", error);
            alert("Ocurrió un error inesperado al actualizar el proveedor.");
        }
    };

    // Maneja la actualización de la categoría seleccionada en el modal
    const handleActualizarCategoria = async () => {
        if (!categoriaSeleccionada) {
            alert("Por favor, seleccione una categoría para actualizar.");
            return;
        }

        if (!nuevoNombreCategoria.trim()) {
            alert("Por favor, ingrese un nuevo nombre para la categoría.");
            return;
        }

        try {
            const response = await api.put(`/categorias/${categoriaSeleccionada}`, {
                idCategoria: categoriaSeleccionada,
                nombreCategoria: nuevoNombreCategoria.trim()
            });

            if (response.status === 200) {
                alert("Categoría actualizada correctamente.");

                // Limpiar estados
                setCategoriaFiltro("");
                setCategoriaSeleccionada(null);
                setNuevoNombreCategoria("");
                setCategoriaModalOpen(false);
            } else {
                alert("No se pudo actualizar la categoría.");
            }
        } catch (error) {
            console.error("Error al actualizar la categoría:", error);
            alert("Ocurrió un error inesperado al actualizar la categoría.");
        }
    };


    // Establece la pestaña activa en 'actualizar' al cargar el componente
    useEffect(() => {
        setActiveTab('actualizar');
    }, []);


    // Renderiza el componente de actualización de inventario
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
                    to={tienePermiso("inventario:registrar") ? "/inventory-registration" : "#"}
                    className={`${styles.tabButton} ${activeTab === "registro" ? styles.active : ""} ${!tienePermiso("inventario:registrar") ? styles.disabledTab : ""}`}
                    onClick={(e) => {
                        if (!tienePermiso("inventario:registrar")) e.preventDefault();
                        else handleTabClick("registro");
                    }}
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
                    to={tienePermiso("inventario:editar") ? "/update-merchandise" : "#"}
                    className={`${styles.tabButton} ${activeTab === "actualizar" ? styles.active : ""} ${!tienePermiso("inventario:editar") ? styles.disabledTab : ""}`}
                    onClick={(e) => {
                        if (!tienePermiso("inventario:editar")) e.preventDefault();
                        else handleTabClick("actualizar");
                    }}
                >
                    Actualizar Inventario
                </Link>

                <Link
                    to={tienePermiso("inventario:eliminar") ? "/delete-merchandise" : "#"}
                    className={`${styles.tabButton} ${activeTab === "eliminar" ? styles.active : ""} ${!tienePermiso("inventario:eliminar") ? styles.disabledTab : ""}`}
                    onClick={(e) => {
                        if (!tienePermiso("inventario:eliminar")) e.preventDefault();
                        else handleTabClick("eliminar");
                    }}
                >
                    Eliminar Inventario
                </Link>
            </div>

            {/* Pestaña de actualización */}
            {activeTab === "actualizar" && (
                <div className={styles.container}>
                    <h2 className={styles.title}>
                        Ingrese el código del Producto para buscar y actualizar el registro
                    </h2>

                    <div className={styles.formContainer}>
                        <form className={styles.formLeft}>
                            <label className={styles.inputLabel}>Código del Producto:</label>
                            <input
                                type="text"
                                placeholder="Código del Producto (Obligatorio)"
                                value={productCode}
                                onChange={(e) => setProductCode(e.target.value)}
                                required
                                className={styles.input}
                                title="El código del producto debe contener solo dígitos numéricos (entre 1 y 5 cifras). Se permiten ceros a la izquierda."
                                disabled={isCodeDisabled} // Deshabilita el input si se busca un producto
                                style={{ fontStyle: 'italic' }}
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
                                onChange={handleSupplierChange}
                                className={styles.input}
                                style={{ fontStyle: 'italic' }}
                            >
                                <option value="">Seleccione un Proveedor</option>
                                {suppliers.map((proveedor) => (
                                    <option key={proveedor.idProveedor} value={proveedor.idProveedor}>
                                        {proveedor.nombreProveedor}
                                    </option>
                                ))}
                            </select>

                            <label className={styles.inputLabel}>NIT:</label>
                            <input
                                type="text"
                                placeholder="NIT (Obligatorio)"
                                value={supplierNIT}
                                onChange={(e) => setSupplierNIT(e.target.value)}
                                className={styles.input}
                                title="Ingrese un NIT válido de hasta 15 caracteres, incluyendo el guion y el dígito de verificación."
                                style={{ fontStyle: 'italic' }}
                            />

                            <label className={styles.inputLabel}>Teléfono:</label>
                            <input
                                type="text"
                                placeholder="Teléfono (Obligatorio)"
                                value={supplierPhone}
                                onChange={(e) => setSupplierPhone(e.target.value)}
                                className={styles.input}
                                title="Ingrese un número de celular colombiano sin el código de país. Debe contener exactamente 10 dígitos numéricos."
                                style={{ fontStyle: 'italic' }}
                            />

                            <label className={styles.inputLabel}>Dirección:</label>
                            <input
                                type="text"
                                placeholder="Dirección (Obligatorio)"
                                value={supplierAddress}
                                onChange={(e) => setSupplierAddress(e.target.value)}
                                className={styles.input}
                                style={{ fontStyle: 'italic' }}
                            />

                            <label className={styles.inputLabel}>Categoría:</label>
                            <select
                                className={styles.input}
                                value={selectedCategoryId}
                                onChange={(e) => setSelectedCategoryId(number(e.target.value))}
                                style={{ fontStyle: 'italic' }}
                            >
                                <option value="">Seleccione una Categoría</option>
                                {categories.map((cat) => (
                                    <option key={cat.idCategoria} value={cat.idCategoria}>
                                        {cat.nombreCategoria}
                                    </option>
                                ))}
                            </select>

                            <label className={styles.inputLabel}>Nombre del Producto:</label>
                            <input
                                type="text"
                                placeholder="Nombre del Producto (Obligatorio)"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                className={styles.input}
                                style={{ fontStyle: 'italic' }}
                            />

                            <label className={styles.inputLabel}>Cantidad:</label>
                            <input
                                type="number"
                                placeholder="Cantidad (Obligatorio)"
                                value={productQuantity}
                                onChange={(e) => setProductQuantity(e.target.value)}
                                className={styles.input}
                                title="Ingrese una cantidad mayor o igual a cero. No se permiten valores negativos."
                                style={{ fontStyle: 'italic' }}
                            />

                            <label className={styles.inputLabel}>Valor Unitario:</label>
                            <input
                                type="number"
                                placeholder="Valor Unitario (Obligatorio)"
                                value={unitValue}
                                onChange={(e) => setUnitValue(e.target.value)}
                                className={styles.input}
                                style={{ fontStyle: 'italic' }}
                            />

                            <label className={styles.inputLabel}>Valor Total:</label>
                            <input
                                type="text"
                                value={totalValue}
                                className={styles.input}
                                disabled
                                style={{ fontStyle: 'italic' }}
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
                                    Cargar Imagen <UploadFileIcon style={{ marginLeft: 8 }} />
                                </label>
                            </div>
                        </form>
                    </div>

                    {/* Botones de acción pata guardar, limpiar o salir */}
                    <div className={styles.actionButtons}>
                        <button className={styles.saveButton} onClick={handleSave}>
                            Guardar <SaveOutlinedIcon style={{ marginLeft: 8 }} />
                        </button>
                        <button className={styles.clearButton} onClick={handleClear}>
                            Limpiar <CleaningServicesIcon style={{ marginLeft: 8 }} />
                        </button>
                        <button
                            type="button"
                            onClick={() => (window.location.href = "/menu-principal")}
                            className={styles.exitButton} >
                            Salir <ExitToAppIcon style={{ marginLeft: 8 }} />
                        </button>
                    </div>
                </div>
            )}

            {/*Boton de acción para editar proveedor */}
            <div className={styles.actionButtonsEdit}>
                {tienePermiso("inventario:categoria") && (
                    <button
                        className={styles.editButton}
                        type="button"
                        onClick={() => {
                            setProveedorSeleccionado({
                                idProveedor: supplierId,
                                nombreProveedor: supplierName,
                            });
                            setNuevoNombreProveedor(supplierName);
                            setProveedorModalOpen(true);
                        }}
                    >
                        Editar Prov. < EditNoteIcon style={{ marginLeft: 8 }} />
                    </button>
                )}

                {tienePermiso("inventario:categoria") && (
                    <button
                        className={styles.editButton}
                        type="button"
                        onClick={() => {
                            setCategoriaSeleccionada({
                                idCategoria: selectedCategoryId,
                                nombreCategoria: categories.find(cat => cat.idCategoria === selectedCategoryId)?.nombreCategoria || ""
                            });
                            setNuevoNombreCategoria(
                                categories.find(cat => cat.idCategoria === selectedCategoryId)?.nombreCategoria || ""
                            );
                            setCategoriaModalOpen(true);
                        }}
                    >
                        Editar Cat. <EditNoteIcon style={{ marginLeft: 8 }} />
                    </button>
                )}
            </div>

            {/* Modal para editar proveedor */}
            {isProveedorModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <button
                            className={styles.modalCloseButton}
                            onClick={() => {
                                setProveedorModalOpen(false);
                                handleClear();
                            }}
                        >
                            <CloseIcon />
                        </button>

                        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Editar Proveedor</h2>

                        {/* Filtro de búsqueda */}
                        <div className={styles.modalFormGroup}>
                            <label htmlFor="BuscarProveedor" className={styles.labelModal}>Buscar Proveedor</label>
                            <input
                                type="text"
                                id="BuscarProveedor"
                                placeholder="Escriba para buscar un proveedor"
                                value={proveedorFiltro}
                                onChange={(e) => setProveedorFiltro(e.target.value)}
                                className={styles.input}
                            />
                        </div>

                        {/* Lista de coincidencias */}
                        {proveedorFiltro.trim() !== "" && (
                            <ul className={styles.listaResultados}>
                                {suppliers
                                    .filter((prov) =>
                                        prov.nombreProveedor.toLowerCase().includes(proveedorFiltro.toLowerCase())
                                    )
                                    .map((prov) => (
                                        <li
                                            key={prov.idProveedor}
                                            onClick={() => {
                                                console.log("Seleccionado:", prov);
                                                setProveedorSeleccionado(prov.idProveedor);
                                                setNuevoNombreProveedor(prov.nombreProveedor);
                                            }}
                                        >
                                            {prov.nombreProveedor}
                                        </li>
                                    ))}
                            </ul>
                        )}

                        {/* Input editable */}
                        <div className={styles.modalFormGroup}>
                            <label htmlFor="NombreProveedor" className={styles.labelModal}>
                                Nombre del Proveedor (Obligatorio)
                            </label>
                            <input
                                type="text"
                                id="NombreProveedor"
                                placeholder="Nombre del Proveedor"
                                value={nuevoNombreProveedor}
                                onChange={(e) => setNuevoNombreProveedor(e.target.value)}
                                className={styles.input}
                            />
                        </div>

                        {/* Botones */}
                        <div className={styles.modalButtonsEditar}>
                            <button className={styles.modalButtonSave} onClick={handleActualizarProveedor}>
                                Actualizar <SaveOutlinedIcon style={{ marginLeft: 8 }} />
                            </button>
                            <button className={styles.clearButtonModal} onClick={handleClear}>
                                Limpiar <CleaningServicesIcon style={{ marginLeft: 8 }} />
                            </button>
                            <button
                                className={styles.modalButtonExit}
                                onClick={() => {
                                    setProveedorModalOpen(false);
                                    handleClear();
                                }}
                            >
                                Salir <ExitToAppIcon style={{ marginLeft: 8 }} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para editar categoría */}
            {isCategoriaModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <button
                            className={styles.modalCloseButton}
                            onClick={() => {
                                setCategoriaModalOpen(false);
                                handleClear();
                            }}
                        >
                            <CloseIcon />
                        </button>

                        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Editar Categoría</h2>

                        {/* Filtro de búsqueda */}
                        <div className={styles.modalFormGroup}>
                            <label htmlFor="BuscarCategoria" className={styles.labelModal}>Buscar Categoría</label>
                            <input
                                type="text"
                                id="BuscarCategoria"
                                placeholder="Escriba para buscar una categoría"
                                value={categoriaFiltro}
                                onChange={(e) => setCategoriaFiltro(e.target.value)}
                                className={styles.input}
                            />
                        </div>

                        {/* Lista de coincidencias */}
                        {categoriaFiltro.trim() !== "" && (
                            <ul className={styles.listaResultados}>
                                {categories
                                    .filter((cat) =>
                                        cat.nombreCategoria.toLowerCase().includes(categoriaFiltro.toLowerCase())
                                    )
                                    .map((cat) => (
                                        <li
                                            key={cat.idCategoria}
                                            onClick={() => {
                                                setCategoriaSeleccionada(cat.idCategoria);
                                                setNuevoNombreCategoria(cat.nombreCategoria);
                                            }}
                                        >
                                            {cat.nombreCategoria}
                                        </li>
                                    ))}
                            </ul>
                        )}

                        {/* Input editable */}
                        <div className={styles.modalFormGroup}>
                            <label htmlFor="NombreCategoria" className={styles.labelModal}>
                                Nombre de la Categoría (Obligatorio)
                            </label>
                            <input
                                type="text"
                                id="NombreCategoria"
                                placeholder="Nombre de la Categoría"
                                value={nuevoNombreCategoria}
                                onChange={(e) => setNuevoNombreCategoria(e.target.value)}
                                className={styles.input}
                            />
                        </div>

                        {/* Botones */}
                        <div className={styles.modalButtonsEditar}>
                            <button className={styles.modalButtonSave} onClick={handleActualizarCategoria}>
                                Actualizar <SaveOutlinedIcon style={{ marginLeft: 8 }} />
                            </button>
                            <button
                                className={styles.clearButtonModal}
                                onClick={() => {
                                    setCategoriaFiltro("");
                                    setCategoriaSeleccionada(null);
                                    setNuevoNombreCategoria("");
                                }}
                            >
                                Limpiar <CleaningServicesIcon style={{ marginLeft: 8 }} />
                            </button>
                            <button
                                className={styles.modalButtonExit}
                                onClick={() => {
                                    setCategoriaModalOpen(false);
                                    handleClear();
                                }}
                            >
                                Salir <ExitToAppIcon style={{ marginLeft: 8 }} />
                            </button>
                        </div>
                    </div>
                </div >
            )}
        </>
    );
}

export default UpdateMerchandise;