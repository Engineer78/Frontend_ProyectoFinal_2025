import { useState, useEffect } from "react";
import Header from "../Header";
import styles from "../../styles/deleteusers.module.css";
import { Link } from "react-router-dom";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import axios from "axios"; // Importa Axios para realizar peticiones HTTP

// Componente principal para eliminar usuarios
const DeleteUsers = () => {
  // Crear instancia de Axios con la base URL de la API
  const api = axios.create({ baseURL: "http://localhost:8080/api" });

  // Estados para manejar pestañas, datos, filtros, selección y carga
  const [activeTab, setActiveTab] = useState("eliminar"); // Pestaña activa
  const [data, setData] = useState([]); // Datos filtrados para mostrar en la tabla
  const [fullEmployeeList, setFullEmployeeList] = useState([]); // Lista completa de empleados desde el backend
  const [filters, setFilters] = useState({ numeroDocumento: "" }); // Filtros de búsqueda

  // Campos mostrados en los inputs deshabilitados al seleccionar un emepleado
  const [disabledInputs, setDisabledInputs] = useState({
    tipoDocumento: "",
    nombreUsuario: "",
    rol: "",
    nombresCompletos: "",
    telefono: "",
    direccion: "",
    contactoEmergencia: "",
    telefonoContacto: "",
  });

  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false); // Modal de confirmación
  const [isSearching, setIsSearching] = useState(false); // Estado de búsqueda activa
  const [selectedItems, setSelectedItems] = useState([]); // Empleado seleccionado para eliminar
  const [visibleItems, setVisibleItems] = useState(10); // Cantidad de empleados visibles
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Estado de carga adicional

  // Cargar usuarios desde la API
  const fetchEmployees = async () => {
    try {
      const response = await api.get("/empleados");
      console.log("Datos recibidos:", response.data); // Petición GET a la API
      setFullEmployeeList(response.data); // Guardar respuesta en el estado
    } catch (error) {
      console.error("Error al cargar los usuarios:", error); // Manejo de errores
    }
  };

  // Cargar empleados Inmediatamente  al montar el componente
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Filtrar empleados por número de documento
  useEffect(() => {
    const hasActiveFilters = filters.numeroDocumento.trim() !== ""; // Verificar si hay filtros activos

    // Si no hay filtro, limpiar los datos y los campos visibles
    if (!hasActiveFilters) {
      setData([]);
      setDisabledInputs({
        tipoDocumento: "",
        nombreUsuario: "",
        rol: "",
        nombresCompletos: "",
        telefono: "",
        direccion: "",
        contactoEmergencia: "",
        telefonoContacto: "",
      }); // Vaciar todos los campos
      return;
    }

    // Filtrar empleados que coincidan con el número de documento
    const filtered = fullEmployeeList.filter((item) =>
      item.numeroDocumento.toString().includes(filters.numeroDocumento)
    );

    const itemsToShow = filtered.slice(0, visibleItems); // Aplicar paginación
    setData(itemsToShow); // Guardar datos filtrados

    // Si hay resultados, mostrar el primero en los campos deshabilitados
    if (hasActiveFilters && itemsToShow.length > 0) {
      const firstItem = itemsToShow[0];
      setDisabledInputs({
        tipoDocumento: firstItem.nombreTipoDocumento || "",
        nombreUsuario: firstItem.nombreUsuario || "",
        rol: firstItem.nombreRol || "",
        nombresCompletos:
          `${firstItem.nombres} ${firstItem.apellidoPaterno} ${firstItem.apellidoMaterno}`.trim() ||
          "",
        telefono: firstItem.telefonoMovil || "",
        direccion: firstItem.direccionResidencia || "",
        contactoEmergencia: firstItem.contactoEmergencia || "",
        telefonoContacto: firstItem.telefonoContacto || "",
      });
    } else {
      setDisabledInputs({
        tipoDocumento: "",
        nombreUsuario: "",
        rol: "",
        nombresCompletos: "",
        telefono: "",
        direccion: "",
        contactoEmergencia: "",
        telefonoContacto: "",
      }); // Limpiar si no hay coincidencias
    }

    if (hasActiveFilters && itemsToShow.length > 0 && !isSearching) {
      setIsSearching(true); // Activar estado de búsqueda
    }
  }, [filters, visibleItems, fullEmployeeList, isSearching]);

  // Manejo del cambio en el input de búsqueda
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));

    // Si se limpia el campo, reiniciar datos y campos visibles
    if (name === "numeroDocumento" && value === "") {
      setData([]);
      setDisabledInputs({
        tipoDocumento: "",
        nombreUsuario: "",
        rol: "",
        nombresCompletos: "",
        telefono: "",
        direccion: "",
        contactoEmergencia: "",
        telefonoContacto: "",
      });
    }

    if (!isSearching) setIsSearching(true);
  };

  // Manejo del checkbox de selección
  const handleCheckboxChange = (e, item) => {
    if (e.target.checked) {
      setSelectedItems([item]); // Solo permitir seleccionar una vez 
      setDisabledInputs({
        tipoDocumento: item.nombreTipoDocumento || "",
        nombreUsuario: item.nombreUsuario || "",
        rol: item.nombreRol || "",
        nombresCompletos:
          `${item.nombres} ${item.apellidoPaterno} ${item.apellidoMaterno}`.trim(),
        telefono: item.telefonoMovil || "",
        direccion: item.direccionResidencia || "",
        contactoEmergencia: item.contactoEmergencia || "",
        telefonoContacto: item.telefonoContacto || "",
      });
    } else {
      setSelectedItems([]);
      setDisabledInputs({
        tipoDocumento: "",
        nombreUsuario: "",
        rol: "",
        nombresCompletos: "",
        telefono: "",
        direccion: "",
        contactoEmergencia: "",
        telefonoContacto: "",
      });
    }
  };

  // Lógica para mostrar u ocultar el modal de confirmación
  const openDeleteConfirmationModal = () => {
    setIsDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmationModal = () => {
    setIsDeleteConfirmationOpen(false);
  };

  //Eliminar empleado
  const handleDeleteItems = async () => {
    if (selectedItems.length === 0) {
      alert("Por favor, selecciona un empleado para eliminar.");
      return;
    }

    try {
      const confirm = window.confirm(
        "¿Estás seguro que deseas eliminar los empleados seleccionados?"
      );
      if (!confirm) return;

      // Recorrer todos los empleados seleccionados y eliminar
      for (const item of selectedItems) {
        await api.delete(`/empleados/${item.idEmpleado}`);
      }

      closeDeleteConfirmationModal();
      setSelectedItems([]);
      setFilters({ numeroDocumento: "" });
      setDisabledInputs({
        tipoDocumento: "",
        nombreUsuario: "",
        rol: "",
        nombresCompletos: "",
        telefono: "",
        direccion: "",
        contactoEmergencia: "",
        telefonoContacto: "",
      });
      setData([]);
      setIsSearching(false);

      fetchEmployees();
      setTimeout(() => {
        alert("Empleados eliminados exitosamente");
      }, 150);
    } catch (error) {
      console.error("Error al eliminar los empleados:", error);
      alert("Hubo un error al intentar eliminar los empleados.");
    }
  };

  // Cargar más resultados (paginación)
  const handleLoadMore = () => {
    if (!isLoadingMore) {
      setIsLoadingMore(true);
      setVisibleItems((prev) => prev + 30);
      setIsLoadingMore(false);
    }
  };

  // Limpiar búsqueda y estados
  const handleClear = () => {
    setFilters({ numeroDocumento: "" });
    setDisabledInputs({
      tipoDocumento: "",
      nombreUsuario: "",
      rol: "",
      nombresCompletos: "",
      telefono: "",
      direccion: "",
      contactoEmergencia: "",
      telefonoContacto: "",
    });
    setData([]);
    setIsSearching(false);
  };

  // Manejo del clic en pestañas
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  // Contenedor principal con scroll y cabecera
  return (
    <div className={styles.scrollContainer}>
      {/* Encabezado con título, subtítulo y botones de ayuda/logo */}
      <Header
        title="Módulo registro de usuarios"
        subtitle="Hardware Store Inventory FFIG"
        showLogo={true}
        showHelp={true}
      />

      {/* Pestañas de navegación entre vistas del módulo de usuarios */}
      <div className={styles.tabs}>
        <Link
          to="/users-registration"
          className={`${styles.tabButton} ${
            activeTab === "registro" ? styles.active : ""
          }`}
          onClick={() => handleTabClick("registro")}
        >
          Registrar Usuarios
        </Link>

        <Link
          to="/users-query"
          className={`${styles.tabButton} ${
            activeTab === "consulta" ? styles.active : ""
          }`}
          onClick={() => handleTabClick("consulta")}
        >
          Consultar Usuarios
        </Link>

        <Link
          to="/update-users"
          className={`${styles.tabButton} ${
            activeTab === "actualizar" ? styles.active : ""
          }`}
          onClick={() => handleTabClick("actualizar")}
        >
          Actualizar Usuarios
        </Link>

        <Link
          to="/delete-users"
          className={`${styles.tabButton} ${
            activeTab === "eliminar" ? styles.active : ""
          }`}
          onClick={() => handleTabClick("eliminar")}
        >
          Eliminar Usuarios
        </Link>
      </div>

      {/* Instrucción para el usuario sobre el proceso de eliminación */}
      <div className={styles.container}>
        <h2 className={styles.title}>
          Ingrese Número de Identificación y seleccione el registro que desea
          eliminar
        </h2>
      </div>

      {/* Tabla de resultados con filtros por documento, campos deshabilitados y selección */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>
              Selección
              <input type="checkbox" disabled />
            </th>
            <th>
              N° de Documento
              <input
                type="text"
                name="numeroDocumento"
                value={filters.numeroDocumento}
                onChange={handleInputChange}
                placeholder="Buscar"
                style={{ fontStyle: "italic" }}
              />
            </th>
            <th>
              Tipo de Documento
              <input
                type="text"
                name="tipoDocuemto"
                value={disabledInputs.tipoDocumento}
                placeholder="..."
                disabled
                style={{ fontStyle: "italic" }}
              />
            </th>
            <th>
              Nombre de Usuario
              <input
                type="text"
                name="nombreUsuario"
                value={disabledInputs.nombreUsuario}
                placeholder="..."
                disabled
                style={{ fontStyle: "italic" }}
              />
            </th>
            <th>
              Rol
              <input
                type="text"
                name="rol"
                value={disabledInputs.rol}
                placeholder="..."
                disabled
                style={{ fontStyle: "italic" }}
              />
            </th>
            <th>
              Nombre(s) Completos
              <input
                type="text"
                name="nombresCompletos"
                value={disabledInputs.nombresCompletos}
                placeholder="..."
                disabled
                style={{ fontStyle: "italic" }}
              />
            </th>
            <th>
              Teléfono
              <input
                type="text"
                name="telefono"
                value={disabledInputs.telefono}
                placeholder="..."
                disabled
                style={{ fontStyle: "italic" }}
              />
            </th>
            <th>
              Dirección
              <input
                type="text"
                name="direccion"
                value={disabledInputs.direccion}
                placeholder="..."
                disabled
                style={{ fontStyle: "italic" }}
              />
            </th>
            <th>
              Contacto de Emergencia
              <input
                type="text"
                name="contactoEmergencia"
                value={disabledInputs.contactoEmergencia}
                placeholder="..."
                disabled
                style={{ fontStyle: "italic" }}
              />
            </th>
            <th>
              Teléfono de Contacto
              <input
                type="text"
                name="telefonoContacto"
                value={disabledInputs.telefonoContacto}
                placeholder="..."
                disabled
                style={{ fontStyle: "italic" }}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Renderizado de filas si hay resultados */}
          {isSearching ? (
            data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      onChange={(e) => handleCheckboxChange(e, item)}
                    />
                  </td>
                  <td>{item.numeroDocumento}</td>
                  <td>{item.nombreTipoDocumento}</td>
                  <td>{item.nombreUsuario}</td>
                  {/* nombre del tipo de documento */}
                  <td>{item.nombreRol}</td> {/* nombre del rol */}
                  <td>{`${item.nombres} ${item.apellidoPaterno} ${item.apellidoMaterno}`}</td>{" "}
                  {/* nombre completo */}
                  <td>{item.telefonoMovil}</td> {/* teléfono móvil */}
                  <td>{item.direccionResidencia}</td> {/* dirección */}
                  <td>{item.contactoEmergencia}</td>
                  <td>{item.telefonoContacto}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">No se encontraron resultados</td>
              </tr>
            )
          ) : (
            <tr>
              <td colSpan="10">Realiza una búsqueda para ver los registros</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Botón para cargar más resultados si existen */}
      {data.length > visibleItems && !isLoadingMore && (
        <div className={styles["load-more-container"]}>
          <button
            className={styles["load-more-button"]}
            onClick={handleLoadMore}
          >
            Cargar más
          </button>
        </div>
      )}

      {/* Indicador de carga mientras se obtienen más usuarios */}
      {isLoadingMore && (
        <div className={styles["loading-spinner"]}>
          <p>Cargando más usuarios...</p>
        </div>
      )}

      {/* Modal de confirmación antes de eliminar */}
      {isDeleteConfirmationOpen && (
        <div
          className={styles["delete-confirmation-modal"]}
          onClick={closeDeleteConfirmationModal}
        >
          <div
            className={styles["modalContent-delete"]}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Confirmar Eliminación</h3>
            <p>
              ¿Estás seguro de que deseas eliminar los usuarios seleccionados?
            </p>
            <div className={styles["delete-confirmation-modal-controls"]}>
              <button
                onClick={handleDeleteItems}
                className={styles["delete-button"]}
              >
                Eliminar <DeleteOutlineIcon style={{ marginLeft: 1 }} />
              </button>
              <button
                onClick={closeDeleteConfirmationModal}
                className={styles["close-button"]}
              >
                Cancelar X
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botones inferiores para eliminar, limpiar o salir */}
      <div className={styles.actionButtons}>
        <button
          type="button"
          onClick={openDeleteConfirmationModal}
          className={styles.buttonEliminar}
        >
          Eliminar <DeleteOutlineIcon style={{ marginLeft: 8 }} />
        </button>
        <button
          type="button"
          onClick={handleClear}
          className={styles.clearButton}
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
  );
};

export default DeleteUsers;
