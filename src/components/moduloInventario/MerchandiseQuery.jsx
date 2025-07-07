import { useState, useEffect } from 'react';
import { usePermisos } from "../../components/admin/PermisosContext";
import { saveAs } from 'file-saver';
import { Link } from 'react-router-dom';
import Header from '../Header';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import SearchIcon from '@mui/icons-material/Search';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import TrackChangesOutlinedIcon from '@mui/icons-material/TrackChangesOutlined';
import useInactivityLogout from '../../useInactivityLogout';
import useTokenAutoLogout from '../../useTokenAutoLogout';
import styles from '../../styles/merchandisequery.module.css';
import api from '../../api'; // Importa la instancia de Axios configurada


// Componente MerchandiseQuery
const MerchandiseQuery = () => {

  useInactivityLogout(); // Hook para manejar el logout por inactividad
  useTokenAutoLogout();  // Hook para expiración de token

  // Estados principales
  const [activeTab, setActiveTab] = useState('consulta');
  const [filters, setFilters] = useState({
    codigoProducto: '',
    nombreCategoria: '',
    nombreProducto: '',
    nitProveedor: '',
    nombreProveedor: '',
    telefonoProveedor: '',
    direccionProveedor: '',
    cantidad: '',
    valorUnitarioProducto: '',
    valorTotalProducto: '',
  });
  const [data, setData] = useState([]);                  // Población de la tabla
  const [selectedProduct, setSelectedProduct] = useState(null); // Fila única o clickeada
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [searchMode, setSearchMode] = useState('normal');  // 'normal' o 'advanced'
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
<<<<<<< HEAD
  const [isTraceabilityModalOpen, setIsTraceabilityModalOpen] = useState(false);
  const [traceData, setTraceData] = useState([]);
  const [tracePage, setTracePage] = useState(1);
  const [traceRowsPerPage] = useState(5);
  const [traceFilters, setTraceFilters] = useState({
    keyword: '',
    tipoMovimiento: '',
    fechaInicio: '',
    fechaFin: ''
  });
  const [isTraceabilityCleared, setIsTraceabilityCleared] = useState(false);
  const [isSearchingTrace, setIsSearchingTrace] = useState(false);
  const { tienePermiso } = usePermisos();
=======

>>>>>>> cd3f5be33869ab9d53e3e670a21974ec3fbc8b61



  // Manejo de pestañas
  const handleTabClick = (tab) => setActiveTab(tab);

  // Efecto combinado para fetch dinámico según modo de búsqueda
  useEffect(() => {
    const noFilters = Object.values(filters).every(v => !v);
    if (!isSearching || noFilters) {
      setData([]);
      setSelectedProduct(null);
      return;
    }

    const fetchData = async () => {
      try {
        let resp;

<<<<<<< HEAD
        if (searchMode === 'normal') {
=======
        // 4) Si los filtros principales están llenos, usar búsqueda normal
        if (filters.codigoProducto || filters.nombreCategoria || filters.nombreProducto) {
>>>>>>> cd3f5be33869ab9d53e3e670a21974ec3fbc8b61
          resp = await api.get('/productos/buscar', {
            params: {
              nombreCategoria: filters.nombreCategoria || null,
              nombreProducto: filters.nombreProducto || null,
              nitProveedor: filters.nitProveedor || null,
              nombreProveedor: filters.nombreProveedor || null,
              telefonoProveedor: filters.telefonoProveedor || null,
              direccionProveedor: filters.direccionProveedor || null,
              cantidad: filters.cantidad || null,
              valorUnitarioProducto: filters.valorUnitarioProducto || null,
              valorTotalProducto: filters.valorTotalProducto || null,
              registrar: false, // No registrar trazabilidad en búsqueda normal
            }
          });
        } else {
          // Búsqueda avanzada
          resp = await api.get('/productos/busqueda-avanzada', {
            params: {
              nitProveedor: filters.nitProveedor || null,
              nombreProveedor: filters.nombreProveedor || null,
              cantidad: filters.cantidad || null,
              valorUnitarioProducto: filters.valorUnitarioProducto || null,
              valorTotalProducto: filters.valorTotalProducto || null,
              registrar: false, // No registrar trazabilidad en búsqueda avanzada
            }
          });
        }

        let lista = resp.data || [];

<<<<<<< HEAD
=======
        // 6) Filtrado adicional por código en frontend si es necesario
>>>>>>> cd3f5be33869ab9d53e3e670a21974ec3fbc8b61
        if (filters.codigoProducto) {
          const codigoSinCeros = filters.codigoProducto.replace(/^0+/, '');
          lista = lista.filter(p =>
            p.codigoProducto.toString().includes(codigoSinCeros)
          );
        }

        setData(lista);
<<<<<<< HEAD
        setCurrentPage(1);
        setSelectedProduct(lista.length > 0 ? lista[0] : null);

=======

        setCurrentPage(1); // Reinicia la paginación al hacer una búsqueda nueva


        // 7) Siempre tomar el primer resultado
        if (lista.length > 0) {
          setSelectedProduct(lista[0]);
        } else {
          setSelectedProduct(null);
        }
>>>>>>> cd3f5be33869ab9d53e3e670a21974ec3fbc8b61
      } catch (error) {
        console.error('Error al obtener datos:', error);
        setData([]);
        setSelectedProduct(null);
      }
    };
<<<<<<< HEAD
=======

>>>>>>> cd3f5be33869ab9d53e3e670a21974ec3fbc8b61

    fetchData();
  }, [filters, isSearching, searchMode]);


  // Este useEffect controla si el usuario ha comenzado a buscar para la trazabilidad
  useEffect(() => {
    const tieneFiltros = Object.values(traceFilters).some(v => v);
    if (tieneFiltros) {
      setIsSearchingTrace(true);
    } else if (isTraceabilityCleared) {
      setIsSearchingTrace(false);
    }
  }, [traceFilters, isTraceabilityCleared]);

  // Handlers para manejar cambios en los inputs de búsqueda
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validaciones por campo
    if (name === 'codigoProducto') {
      if (value && !/^\d*$/.test(value)) {
        alert('El código solo permite números enteros.');
        return;
      }
    }

    if (name === 'cantidad') {
      if (value && !/^\d*$/.test(value)) {
        alert('La cantidad solo permite números enteros.');
        return;
      }
    }

    if (name === 'nitProveedor') {
      if (value && !/^[0-9-]*$/.test(value)) {
        alert('El NIT solo permite números y guiones.');
        return;
      }
    }

    if (name === 'valorUnitarioProducto' || name === 'valorTotalProducto') {
      if (value && !/^\d*\.?\d*$/.test(value)) {
        alert('Solo se permiten números.');
        return;
      }
    }

    // Si pasa validaciones, actualiza el filtro
    setFilters(prev => ({ ...prev, [name]: value }));

    if (!isSearching) setIsSearching(true);
  };

  // Registrar búsqueda de trazabilidad
  const registrarBusquedaTrazabilidad = async () => {
    const etiquetas = {
      codigoProducto: "Código",
      nombreProducto: "Nombre",
      nombreCategoria: "Categoría",
      nitProveedor: "NIT",
      nombreProveedor: "Proveedor",
      cantidad: "Existencias",
      valorUnitarioProducto: "Valor Unitario",
      valorTotalProducto: "Valor Total"
    };

    // Armar detalle solo con filtros con valores reales
    const filtrosActivos = Object.entries(filters)
      .filter(([, v]) => v?.toString().trim().length > 0)
      .map(([k, v]) => `${etiquetas[k] || k}: ${v}`)
      .join(" | ");

    console.log("🚨 Estado actual de filters al hacer clic:", filters);
    console.log("🧪 Detalle generado:", filtrosActivos);

    if (filtrosActivos.trim() === "") {
      alert("No hay filtros activos para registrar.");
      return;
    }

    // Detecta si es búsqueda avanzada
    const isAdvanced = searchMode === "advanced";
    const mensaje = isAdvanced
      ? `Búsqueda avanzada de productos desde el modal: ${filtrosActivos}`
      : `Búsqueda básica de productos con filtros: ${filtrosActivos}`;

    try {
      await api.post("/movimientos", {
        tipoMovimiento: "CONSULTAR",
        entidadAfectada: "Producto",
        detalleMovimiento: mensaje
      });
      alert("Búsqueda registrada correctamente.");
    } catch (error) {
      console.error("Error al registrar la trazabilidad:", error);
      alert("No se pudo registrar la búsqueda.");
    }
  };

  const handleRowClick = (item) => {
    setSelectedProduct(item);
    // Cerrar modal avanzado
    setIsAdvancedSearchOpen(false);
  };

  // Limpiar filtros
  const handleClear = () => {
    setFilters({
      codigoProducto: '',
      nombreCategoria: '',
      nombreProducto: '',
      nitProveedor: '',
      nombreProveedor: '',
      telefonoProveedor: '',
      direccionProveedor: '',
      cantidad: '',
      valorUnitarioProducto: '',
      valorTotalProducto: '',
    });
    setIsSearching(false);
    setSearchMode('normal');
    setSelectedProduct(null);
  };

  // Abrir modal de búsqueda avanzada
  const openAdvancedSearchModal = () => {
    setSearchMode('advanced');
    setIsSearching(true);
    setIsAdvancedSearchOpen(true);
  };

  // Cerrar modal de búsqueda avanzada
  const closeAdvancedSearchModal = () => setIsAdvancedSearchOpen(false);
  const closeModalImage = () => setModalImage(null);
  const handleImageClick = (url) => setModalImage(url);

  // Funciones de trazabilidad
  const openTraceabilityModal = async () => {
    try {
      const resp = await api.get('/movimientos');
      setTraceData(resp.data || []);
      setIsTraceabilityCleared(true);
      setIsTraceabilityModalOpen(true);
    } catch (err) {
      console.error('Error al obtener movimientos:', err);
      alert('Error al obtener movimientos');
    }
  };

  // Cerrar modal de trazabilidad
  const closeTraceabilityModal = () => setIsTraceabilityModalOpen(false);

  // Filtrar y paginar los movimientos de trazabilidad
  const filteredTrace = traceData.filter((mov) => {
    const fecha = new Date(mov.fechaHoraMovimiento);
    const desde = traceFilters.fechaInicio ? new Date(traceFilters.fechaInicio) : null;
    const hasta = traceFilters.fechaFin ? new Date(traceFilters.fechaFin) : null;
    const coincideFecha = (!desde || fecha >= desde) && (!hasta || fecha <= hasta);
    const coincideTexto = Object.values(mov).some(v =>
      v?.toString().toLowerCase().includes(traceFilters.keyword.toLowerCase())
    );
    const coincideTipo = !traceFilters.tipoMovimiento || mov.tipoMovimiento === traceFilters.tipoMovimiento;
    return coincideFecha && coincideTexto && coincideTipo;
  });

  // Paginación de movimientos filtrados
  const paginatedTrace = filteredTrace.slice((tracePage - 1) * traceRowsPerPage, tracePage * traceRowsPerPage);

  // Manejo de cambios en los filtros de trazabilidad
  const handleTraceFilterChange = (e) => {
    const { name, value } = e.target;
    setTraceFilters(prev => ({ ...prev, [name]: value }));
    setTracePage(1);
    setIsTraceabilityCleared(false); // 🧼 Se reactivó un filtro, mostrar tabla
    setIsSearchingTrace(true); // Marcar que ya comenzó una búsqueda
  };

  // Exportar a Excel
  const exportToExcel = () => {
    const data = filteredTrace.map(mov => ({
      Fecha: mov.fechaHoraMovimiento,
      Tipo: mov.tipoMovimiento,
      Entidad: mov.entidadAfectada,
      ID_Entidad: mov.idEntidadAfectada || '',
      Nombre_Entidad: mov.nombreEntidadAfectada || '',
      Detalle: mov.detalleMovimiento,
      Empleado: mov.nombreEmpleadoResponsable
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Movimientos');
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, 'MovimientosInventario.xlsx');
  };

  // Exportar a PDF
  const exportToPDF = () => {
    if (!filteredTrace.length) {
      alert('No hay movimientos para exportar.');
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Trazabilidad del Inventario', 14, 15);

    const columns = [
      { header: 'Detalle', dataKey: 'detalleMovimiento' },
      { header: 'Entidad', dataKey: 'entidadAfectada' },
      { header: 'Fecha', dataKey: 'fechaHoraMovimiento' },
      { header: 'Tipo', dataKey: 'tipoMovimiento' },
      { header: 'Empleado', dataKey: 'nombreEmpleadoResponsable' }
    ];

    const rows = filteredTrace.map(mov => ({
      detalleMovimiento: mov.detalleMovimiento,
      entidadAfectada: mov.entidadAfectada,
      fechaHoraMovimiento: mov.fechaHoraMovimiento,
      tipoMovimiento: mov.tipoMovimiento,
      nombreEmpleadoResponsable: mov.nombreEmpleadoResponsable
    }));

    autoTable(doc, {
      headStyles: { fillColor: [41, 128, 185] },
      columns,
      body: rows,
      startY: 25
    });

    doc.save('trazabilidad-inventario.pdf');
  };

  // Limpiar filtros de trazabilidad
  const handleClearTraceabilityFilters = () => {
    setTraceFilters({
      keyword: '',
      tipoMovimiento: '',
      fechaInicio: '',
      fechaFin: ''
    });
    setTracePage(1);
    setIsTraceabilityCleared(true); // ✅ Marcar que se ha limpiado
    setIsSearchingTrace(false);
  };

  // Calcular total de páginas para trazabilidad
  const totalPages = Math.ceil(filteredTrace.length / traceRowsPerPage);

  // Render del componente MerchandiseQuery
  return (
    <div className={styles.scrollContainer}>
      <Header
        title="Módulo registro de inventario"
        subtitle="Hardware Store Inventory FFIG"
        showLogo
        showHelp
      />

      {/* Pestañas debajo del header */}
      <div className={styles.tabs}>
        <Link
<<<<<<< HEAD
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
          className={`${styles.tabButton} ${activeTab === "consulta" ? styles.active : ""} `}
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
=======
          to="/inventory-registration"
          className={`${styles.tabButton} ${activeTab === 'registro' ? styles.active : ''}`}
          onClick={() => handleTabClick('registro')}
        >Registrar Inventario</Link>
        <Link
          to="/merchandise-query"
          className={`${styles.tabButton} ${activeTab === 'consulta' ? styles.active : ''}`}
          onClick={() => handleTabClick('consulta')}
        >Consultar Inventario</Link>
        <Link
          to="/update-merchandise"
          className={`${styles.tabButton} ${activeTab === 'actualizar' ? styles.active : ''}`}
          onClick={() => handleTabClick('actualizar')}
        >Actualizar Inventario</Link>
        <Link
          to="/delete-merchandise"
          className={`${styles.tabButton} ${activeTab === 'eliminar' ? styles.active : ''}`}
          onClick={() => handleTabClick('eliminar')}
        >Eliminar Inventario</Link>
>>>>>>> cd3f5be33869ab9d53e3e670a21974ec3fbc8b61
      </div>

      <div className={styles.container}>
        <h2 className={styles.title}>
          Ingrese un dato en la casilla correspondiente para realizar la consulta
        </h2>
      </div>
<<<<<<< HEAD

      {/*Etiqueta de paginación con total de registros y filas por página */}
=======
      {/*  {/* Etiqueta de paginación con total de registros y filas por página */}
>>>>>>> cd3f5be33869ab9d53e3e670a21974ec3fbc8b61
      <div className={styles.topTableRow}>
        <p className={styles.labelPagination}>
          Total registros: {data.length} | Filas por página: {rowsPerPage}
        </p>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Selección<input type="checkbox" disabled /></th>
            <th>Código
              <input
                type="text"
                name="codigoProducto"
                value={filters.codigoProducto}
                onChange={handleInputChange}
                placeholder="Buscar"
                style={{ fontStyle: 'italic' }}
              />
            </th>
            <th>Categoría
              <input
                type="text"
                name="nombreCategoria"
                value={filters.nombreCategoria}
                onChange={handleInputChange}
                placeholder="Buscar"
                style={{ fontStyle: 'italic' }}
              />
            </th>
            <th>Producto
              <input
                type="text"
                name="nombreProducto"
                value={filters.nombreProducto}
                onChange={handleInputChange}
                placeholder="Buscar"
                style={{ fontStyle: 'italic' }}
              />
            </th>
            <th>Existencias
              <input
                type="text"
                value={selectedProduct?.cantidad || ''}
                disabled
                placeholder="..."
                style={{ fontStyle: 'italic' }}
              />
            </th>
            <th>Valor Unit.
              <input
                type="text"
                value={selectedProduct?.valorUnitarioProducto || ''}
                disabled
                placeholder="..."
                style={{ fontStyle: 'italic' }}
              />
            </th>
            <th>Valor Tot.
              <input
                type="text"
                value={selectedProduct?.valorTotalProducto || ''}
                disabled
                placeholder="..."
                style={{ fontStyle: 'italic' }}
              />
            </th>
            <th>Proveedor
              <input
                type="text"
                value={selectedProduct?.nombreProveedor || ''}
                disabled
                placeholder="..."
                style={{ fontStyle: 'italic' }}
              />
            </th>
            <th>NIT Prov.
              <input
                type="text"
                value={selectedProduct?.nitProveedor || ''}
                disabled
                placeholder="..."
                style={{ fontStyle: 'italic' }}
              />
            </th>
            <th>Tel. Prov.
              <input
                type="text"
                value={selectedProduct?.telefonoProveedor || ''}
                disabled
                placeholder="..."
                style={{ fontStyle: 'italic' }}
              />
            </th>
            <th>Dir. Prov.
              <input
                type="text"
                value={selectedProduct?.direccionProveedor || ''}
                disabled
                placeholder="..."
                style={{ fontStyle: 'italic' }}
              />
            </th>
            <th>Img.</th>
          </tr>
        </thead>
        <tbody>

          {/* Renderizar filas de datos */}
          {isSearching
            ? data.length > 0
              ? data
                .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
                .map((item, i) => (
                  <tr key={i} onClick={() => handleRowClick(item)} style={{ cursor: 'pointer' }}>
                    <td><input type="checkbox" /></td>
                    <td>{item.codigoProducto.toString().padStart(5, '0')}</td>
                    <td>{item.nombreCategoria}</td>
                    <td>{item.nombreProducto}</td>
                    <td>
                      <span
                        className={item.cantidad <= 5 ? styles.alertaInventarioMinimo : ""}
                        title={item.cantidad <= 5 ? "Cantidad por debajo del mínimo. Favor realizar pedido." : ""}
                      >
                        {item.cantidad}
                      </span>
                    </td>
                    <td>{item.valorUnitarioProducto}</td>
                    <td>{item.valorTotalProducto}</td>
                    <td>{item.nombreProveedor}</td>
                    <td>{item.nitProveedor}</td>
                    <td>{item.telefonoProveedor}</td>
                    <td>{item.direccionProveedor}</td>
                    <td>
                      {item.imagen
                        ? <a href="#" onClick={e => { e.preventDefault(); handleImageClick(item.imagen); }}>Ver Imagen</a>
                        : 'No disponible'}
                    </td>
                  </tr>
                ))
              : <tr><td colSpan="12">No se encontraron resultados</td></tr>
            : <tr><td colSpan="12">Realiza una búsqueda para ver los registros</td></tr>
          }
        </tbody>
      </table>
      {/* Paginación Table */}
      {isSearching && data.length > rowsPerPage && (
        <div className={styles.pagination}>
          <button
            className={styles.circleButton}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            &#x276E; {/* flecha izquierda */}
          </button>

          {Array.from({ length: Math.ceil(data.length / rowsPerPage) }, (_, i) => i + 1).map(pageNum => (
            <button
              key={pageNum}
              className={`${styles.pageNumber} ${currentPage === pageNum ? styles.activePage : ''}`}
              onClick={() => setCurrentPage(pageNum)}
            >
              {pageNum}
            </button>
          ))}

          <button
            className={styles.circleButton}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(data.length / rowsPerPage)))}
            disabled={currentPage === Math.ceil(data.length / rowsPerPage)}
          >
            &#x276F; {/* flecha derecha */}
          </button>
        </div>
      )}

<<<<<<< HEAD
      {/* Paginación Table */}
      {
        isSearching && data.length > rowsPerPage && (
          <div className={styles.pagination}>
            <button
              className={styles.circleButton}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              &#x276E; {/* flecha izquierda */}
            </button>

            {Array.from({ length: Math.ceil(data.length / rowsPerPage) }, (_, i) => i + 1).map(pageNum => (
              <button
                key={pageNum}
                className={`${styles.pageNumber} ${currentPage === pageNum ? styles.activePage : ''}`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            ))}

            <button
              className={styles.circleButton}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(data.length / rowsPerPage)))}
              disabled={currentPage === Math.ceil(data.length / rowsPerPage)}
            >
              &#x276F; {/* flecha derecha */}
            </button>
=======
      {/* Modal de imagen */}
      {modalImage && (
        <div className={styles.modal} onClick={closeModalImage}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            {modalImage.startsWith('data:image')
              ? <img src={modalImage} alt="Producto" className={styles.modalImage} />
              : <p>Imagen no disponible</p>
            }
            <button className={styles.closeButton} onClick={closeModalImage}>Cerrar X</button>
>>>>>>> cd3f5be33869ab9d53e3e670a21974ec3fbc8b61
          </div>
        )
      }

      {/* Modal de imagen */}
      {
        modalImage && (
          <div className={styles.modal} onClick={closeModalImage}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              {modalImage.startsWith('data:image')
                ? <img src={modalImage} alt="Producto" className={styles.modalImage} />
                : <p>Imagen no disponible</p>
              }
              <button className={styles.closeButton} onClick={closeModalImage}>Cerrar X</button>
            </div>
          </div>
        )
      }

      {/* Modal búsqueda avanzada */}
<<<<<<< HEAD
      {
        isAdvancedSearchOpen && (
          <div className={styles['advanced-search-modal']} onClick={closeAdvancedSearchModal}>
            <div className={styles['modalContent-advance']} onClick={e => e.stopPropagation()}>
              <h3>Búsqueda Avanzada</h3>
              <div className={styles['advanced-search-modal-controls']}>
                <button onClick={handleClear} className={styles['advanced-search-clear-button']}>
                  Limpiar <CleaningServicesIcon style={{ marginLeft: 8 }} />
                </button>
                <button onClick={() => window.location.href = '/merchandise-query'} className={styles['advanced-search-exit-button']}>
                  Salir <ExitToAppIcon style={{ marginLeft: 8 }} />
                </button>
                <button className={styles['close-button']}
                  onClick={() => {
                    closeAdvancedSearchModal(false);
                    handleClear();
                  }}
                >X</button>
              </div>
              <form className={styles.advanceForm}>
                <label htmlFor="nit">NIT</label>
                <input name="nitProveedor"
                  value={filters.nitProveedor}
                  onChange={handleInputChange}
                  placeholder="Buscar por NIT"
                  style={{ fontStyle: 'italic' }}
                />
                <label htmlFor="proveedor">Proveedor</label>
                <input name="nombreProveedor"
                  value={filters.nombreProveedor}
                  onChange={handleInputChange}
                  placeholder="Buscar por nombre"
                  style={{ fontStyle: 'italic' }}
                />
                <label htmlFor="existencia">Existencias</label>
                <input name="cantidad"
                  value={filters.cantidad}
                  onChange={handleInputChange}
                  placeholder="Buscar por existencias"
                  style={{ fontStyle: 'italic' }}
                />
                <label htmlFor="valorUnitario">Valor Unitario</label>
                <input name="valorUnitarioProducto"
                  value={filters.valorUnitarioProducto}
                  onChange={handleInputChange}
                  placeholder="Buscar por valor unitario"
                  style={{ fontStyle: 'italic' }}
                />
                <label htmlFor="valorTotal">Valor Total</label>
                <input name="valorTotalProducto"
                  value={filters.valorTotalProducto}
                  onChange={handleInputChange}
                  placeholder="Buscar por valor total"
                  style={{ fontStyle: 'italic' }}
                />
              </form>
            </div>
=======
      {isAdvancedSearchOpen && (
        <div className={styles['advanced-search-modal']} onClick={closeAdvancedSearchModal}>
          <div className={styles['modalContent-advance']} onClick={e => e.stopPropagation()}>
            <h3>Búsqueda Avanzada</h3>
            <div className={styles['advanced-search-modal-controls']}>
              <button onClick={handleClear} className={styles['advanced-search-clear-button']}>
                Limpiar <CleaningServicesIcon style={{ marginLeft: 8 }} />
              </button>
              <button onClick={closeAdvancedSearchModal} className={styles['close-button']}>X</button>
            </div>
            <form className="advance-form">
              <label htmlFor="nit">NIT</label>
              <input name="nitProveedor" value={filters.nitProveedor} onChange={handleInputChange} placeholder="Buscar por NIT" style={{ fontStyle: 'italic' }} />
              <label htmlFor="proveedor">Proveedor</label>
              <input name="nombreProveedor" value={filters.nombreProveedor} onChange={handleInputChange} placeholder="Buscar por nombre" style={{ fontStyle: 'italic' }} />
              <label htmlFor="existencia">Existencias</label>
              <input name="cantidad" value={filters.cantidad} onChange={handleInputChange} placeholder="Buscar por existencias" style={{ fontStyle: 'italic' }} />
              <label htmlFor="valorUnitario">Valor Unitario</label>
              <input name="valorUnitarioProducto" value={filters.valorUnitarioProducto} onChange={handleInputChange} placeholder="Buscar por valor unitario" style={{ fontStyle: 'italic' }} />
              <label htmlFor="valorTotal">Valor Total</label>
              <input name="valorTotalProducto" value={filters.valorTotalProducto} onChange={handleInputChange} placeholder="Buscar por valor total" style={{ fontStyle: 'italic' }} />
            </form>
>>>>>>> cd3f5be33869ab9d53e3e670a21974ec3fbc8b61
          </div>
        )
      }

      {/* Modal de Trazabilidad */}
      {
        isTraceabilityModalOpen && (
          <div className={styles.traceabilityModal} onClick={closeTraceabilityModal}>
            <div className={styles.traceabilityContent} onClick={e => e.stopPropagation()}>
              <button className={styles.traceabilityCloseButton} onClick={closeTraceabilityModal}>X</button>
              <h3>Movimientos de Inventario</h3>

              {/* Filtros */}
              <div className={styles.traceabilityControls}>
                <div className={styles.formGroup}>
                  <label htmlFor="keyword">Buscar:</label>
                  <input
                    name="keyword"
                    placeholder="Buscar..."
                    value={traceFilters.keyword}
                    onChange={handleTraceFilterChange}
                    style={{ fontStyle: 'italic' }}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="tipoMovimiento">Tipo de Movimiento:</label>
                  <select
                    name="tipoMovimiento"
                    value={traceFilters.tipoMovimiento}
                    onChange={handleTraceFilterChange}
                    style={{ fontStyle: 'italic' }}
                  >
                    <option value="">Todos</option>
                    <option value="CREAR">CREAR</option>
                    <option value="ACTUALIZAR">ACTUALIZAR</option>
                    <option value="CONSULTAR">CONSULTAR</option>
                    <option value="ELIMINAR">ELIMINAR</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="fechaInicio">Fecha Inicio:</label>
                  <input
                    name="fechaInicio"
                    type="date"
                    value={traceFilters.fechaInicio}
                    onChange={handleTraceFilterChange}
                    style={{ fontStyle: 'italic' }}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="fechaFin">Fecha Fin:</label>
                  <input
                    name="fechaFin"
                    type="date"
                    value={traceFilters.fechaFin}
                    onChange={handleTraceFilterChange}
                    style={{ fontStyle: 'italic' }}
                  />
                </div>
              </div>

              {/*Etiqueta de paginación con total de registros y filas por página del modal Movimiento Inventario */}
              {isTraceabilityModalOpen && (
                <div className={styles.topTableRowModal}>
                  <p className={styles.labelPaginationMOdal}>
                    Total registros: {isSearchingTrace ? filteredTrace.length : 0} | Filas por página: {traceRowsPerPage}
                  </p>
                </div>
              )}

              {/* Tabla de movimientos */}
              {!isTraceabilityCleared && filteredTrace.length > 0 ? (
                <table className={styles.traceabilityTable}>
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Tipo</th>
                      <th>Entidad</th>
                      <th>Detalle</th>
                      <th>Empleado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTrace.length > 0 ? (
                      paginatedTrace.map((m, i) => (
                        <tr key={i}>
                          <td>{m.fechaHoraMovimiento.replace('T', ' / ').substring(0, 21)}</td>
                          <td>{m.tipoMovimiento}</td>
                          <td>{m.entidadAfectada}</td>
                          <td>{m.detalleMovimiento}</td>
                          <td>{m.nombreEmpleadoResponsable}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5">No hay movimientos</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : (
                <p style={{ textAlign: 'center' }}>No hay movimientos</p>
              )}

              {/* Paginación */}
              {!isTraceabilityCleared && totalPages > 1 && (
                <div className={styles.paginationModal}>
                  <button
                    className={styles.circleButtonModal}
                    onClick={() => setTracePage(prev => Math.max(prev - 1, 1))}
                    disabled={tracePage === 1}
                  >
                    &#x276E;
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page =>
                      page === 1 ||
                      page === totalPages ||
                      (page >= tracePage - 1 && page <= tracePage + 1)
                    )
                    .reduce((acc, page, i, arr) => {
                      if (i > 0 && page - arr[i - 1] > 1) acc.push('ellipsis');
                      acc.push(page);
                      return acc;
                    }, [])
                    .map((item, i) =>
                      item === 'ellipsis' ? (
                        <span key={`ellipsis-${i}`}>...</span>
                      ) : (
                        <button
                          key={item}
                          className={`${styles.pageNumberModal} ${tracePage === item ? styles.activePageModal : ''}`}
                          onClick={() => setTracePage(item)}
                        >
                          {item}
                        </button>
                      )
                    )
                  }

                  <button
                    className={styles.circleButtonModal}
                    onClick={() => setTracePage(prev => Math.min(prev + 1, totalPages))}
                    disabled={tracePage === totalPages}
                  >
                    &#x276F;
                  </button>
                </div>
              )}

              {/* Botones de exportación y limpiar */}
              <div className={styles.traceabilityButtons}>
                <div className={styles.leftGroup}>
                  <button onClick={exportToExcel} className={styles.exportExcelButton}>
                    Exportar Excel
                  </button>
                  <button onClick={exportToPDF} className={styles.esportPDFButton}>
                    Exportar PDF
                  </button>
                </div>
                <div className={styles.rightGroup}>
                  <button onClick={handleClearTraceabilityFilters} className={styles.clearButton}>
                    Limpiar <CleaningServicesIcon style={{ marginLeft: 8 }} />
                  </button>
                  <button onClick={() => window.location.href = '/merchandise-query'} className={styles.exitButton}>
                    Salir <ExitToAppIcon style={{ marginLeft: 8 }} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Botones de acción */}
      <div className={styles.actionButtons}>
<<<<<<< HEAD
        <button
          onClick={registrarBusquedaTrazabilidad}
          className={styles.advancedSearchButton}
          style={{
            marginLeft: !tienePermiso("inventario:verMovimientos") ? 0 : undefined
          }}
        >
          Registrar Consulta <ManageSearchOutlinedIcon style={{ marginLeft: 8 }} />
=======
        <button onClick={openAdvancedSearchModal} className={styles.advancedSearchButton}>
          Buscar <SearchIcon style={{ marginLeft: 8 }} />
>>>>>>> cd3f5be33869ab9d53e3e670a21974ec3fbc8b61
        </button>

        {tienePermiso("inventario:verMovimientos") && (
          <button
            onClick={openTraceabilityModal}
            className={styles.advancedSearchButton}
          >
            Ver Mov. <TrackChangesOutlinedIcon style={{ marginLeft: 8 }} />
          </button>
        )}

        <button onClick={openAdvancedSearchModal} className={styles.advancedSearchButton}>
          Buscar <SearchIcon style={{ marginLeft: 8 }} />
        </button>

        <button onClick={handleClear} className={styles.clearButton}>
          Limpiar <CleaningServicesIcon style={{ marginLeft: 8 }} />
        </button>
        <button onClick={() => window.location.href = '/menu-principal'} className={styles.exitButton}>
          Salir <ExitToAppIcon style={{ marginLeft: 8 }} />
        </button>
      </div>
    </div >
  );
};

export default MerchandiseQuery;
