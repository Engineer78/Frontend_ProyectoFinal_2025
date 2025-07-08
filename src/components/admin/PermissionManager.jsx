import { useEffect, useState } from 'react';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CloseIcon from '@mui/icons-material/Close';
import styles from "../../styles/modalstyles.module.css";
import { listarRoles, listarPermisos, actualizarPermisosPorRol } from '../../api'; // funciones de API

// Función para comparar dos arrays sin importar el orden
// Esta función asume que los arrays contienen valores únicos
const arraysSonIguales = (a, b) => {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((val, idx) => val === sortedB[idx]);
};

// Componente principal para la gestión de permisos por rol
// Este componente permite seleccionar un rol y asignar permisos a ese rol
const PermissionManager = ({ onClose }) => {
    const [roles, setRoles] = useState([]);
    const [permisosDisponibles, setPermisosDisponibles] = useState([]);
    const [permisosRol, setPermisosRol] = useState([]);
    const [rolSeleccionado, setRolSeleccionado] = useState('');
    const [guardando, setGuardando] = useState(false);
    const [originalPermisos, setOriginalPermisos] = useState([]);
    const [hayCambios, setHayCambios] = useState(false);

    // Cargar roles y permisos disponibles al montar el componente
    // Utiliza useEffect para hacer la llamada a la API una vez al inicio
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [rolesRes, permisosRes] = await Promise.all([
                    listarRoles(),
                    listarPermisos()
                ]);
                setRoles(rolesRes.data);
                setPermisosDisponibles(permisosRes.data);
                console.log("✔️ Permisos disponibles cargados:", permisosRes.data);
            } catch (error) {
                console.error('Error al cargar roles o permisos:', error);
            }
        };
        cargarDatos();
    }, []);

    // Cargar permisos del rol seleccionado al cambiar el rol
    // Utiliza useEffect para hacer la llamada a la API cada vez que cambia el rol
    useEffect(() => {
        if (!rolSeleccionado) return;

        const cargarPermisosDelRol = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/rol-permiso/rol/${rolSeleccionado}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await res.json();
                const ids = data.map(p => p.idPermiso);
                setPermisosRol(ids);
                setOriginalPermisos(ids);
                console.log("✅ Permisos actuales del rol cargados:", ids);
            } catch (error) {
                console.error("💥 Error al cargar permisos del rol:", error);
            }
        };

        cargarPermisosDelRol();
    }, [rolSeleccionado]);

    // Efecto para detectar cambios en los permisos del rol
    // Compara los permisos actuales con los originales para determinar si hay cambios
    useEffect(() => {
        const iguales = arraysSonIguales(permisosRol, originalPermisos);
        setHayCambios(!iguales);
        console.log("🔄 Hay cambios detectados?", !iguales);
    }, [permisosRol, originalPermisos]);

    // Función para alternar un permiso en el rol seleccionado
    // Añade o quita un permiso del array de permisos del rol
    const togglePermiso = (idPermiso) => {
        if (permisosRol.includes(idPermiso)) {
            setPermisosRol(permisosRol.filter(id => id !== idPermiso));
        } else {
            setPermisosRol([...permisosRol, idPermiso]);
        }
    };

    // Función para guardar los cambios de permisos del rol seleccionado
    // Realiza una llamada a la API para actualizar los permisos del rol
    const guardarCambios = async () => {
        // Validación inicial
        if (!rolSeleccionado || isNaN(rolSeleccionado)) {
            alert("❗ Debes seleccionar un rol válido.");
            return;
        }

        try {
            setGuardando(true);
            console.log("🎯 Guardando para rol ID:", rolSeleccionado);
            console.log("🔁 Enviando permisos actualizados:", permisosRol);

            // Realiza la actualización
            const response = await actualizarPermisosPorRol(rolSeleccionado, permisosRol);
            console.log("✅ Respuesta del backend:", response);

            // Recarga permisos del rol si el update fue exitoso
            const res = await fetch(`http://localhost:8080/api/rol-permiso/rol/${rolSeleccionado}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!res.ok) {
                throw new Error('Error al recargar permisos después del guardado.');
            }

            const data = await res.json();
            const nuevosPermisos = data.map(p => p.idPermiso);
            setPermisosRol(nuevosPermisos);
            setOriginalPermisos(nuevosPermisos); // <-- ¡ESTO es lo que te faltaba!
            confirm('✅ Permisos actualizados correctamente.');

        } catch (error) {
            console.error('❌ Error al guardar o recargar permisos:', error);
            alert('Error al guardar cambios. Revisa la consola para más detalles.');
        } finally {
            setGuardando(false);
        }
    };
    // Mostrar en consola el estado de los cambios
    // Esto es útil para depurar y ver si el estado se actualiza correctamente
    console.log("🎯 Estado hay Cambios:", hayCambios);

    // Renderizar el componente
    // Muestra un modal con un formulario para seleccionar rol y asignar permisos
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.modalCloseButton} onClick={onClose}>
                    <CloseIcon />
                </button>
                <label className={styles.title}>Gestión de Permisos por Rol</label>

                <div className={styles.selectGroup}>
                    <div className={styles.formGroup}>
                        <label className={styles.Label}>Seleccionar rol:</label>
                        <div className={styles.selectWrapper}>
                            <select
                                className={styles.select}
                                value={rolSeleccionado}
                                onChange={e => setRolSeleccionado(parseInt(e.target.value))}
                            >
                                <option value=''>-- Seleccionar --</option>
                                {roles.map(rol => (
                                    <option key={rol.idRol} value={rol.idRol}>{rol.nombreRol}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Mostrar permisos solo si hay un rol seleccionado */}
                {rolSeleccionado && (
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Permisos:</label>
                        <div className={styles.permisoListContainer}>
                            {permisosDisponibles.map(p => (
                                <div key={p.idPermiso} className={styles.permisoItem}>
                                    <input
                                        type="checkbox"
                                        checked={permisosRol.includes(p.idPermiso)}
                                        onChange={() => togglePermiso(p.idPermiso)}
                                        disabled={guardando}
                                    />
                                    <div className={styles.permisoTexto}>
                                        <strong>{p.nombrePermiso}</strong>
                                        <p>{p.descripcion}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {/* Botones de acción */}
                {/* Estos botones permiten guardar los cambios o salir del modal */}
                <div className={styles.modalButtonGroup}>
                    <button
                        className={styles.modalButtonSave}
                        onClick={guardarCambios}
                        disabled={!hayCambios || guardando}
                        style={{
                            opacity: !hayCambios || guardando ? 0.5 : 1,
                            cursor: !hayCambios || guardando ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {guardando ? 'Guardando...' : 'Guardar'}
                        <SaveOutlinedIcon style={{ marginLeft: 8 }} />
                    </button>
                    <button className={styles.modalButtonExit} onClick={onClose} disabled={guardando}>
                        Salir <ExitToAppIcon style={{ marginLeft: 8 }} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PermissionManager;