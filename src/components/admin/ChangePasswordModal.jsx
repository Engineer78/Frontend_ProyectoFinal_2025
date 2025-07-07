import { useState } from "react";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LockResetIcon from "@mui/icons-material/LockReset";
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import styles from "../../styles/modalstyles.module.css"

import api from "../../api"; // Aqui se importará la instancia de axios configurada


// Componente para cambiar la contraseña del usuario
// Este componente se mostrará en un modal y permitirá al usuario cambiar su contraseña actual
const ChangePasswordModal = ({ onClose }) => {

    // Estados locales para manejar los valores de los campos del formulario
    // y la visibilidad de las contraseñas
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Función para manejar el envío del formulario
    // Valida los campos y realiza la solicitud para cambiar la contraseña
    const handleSubmit = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert("Todos los campos son obligatorios");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("La nueva contraseña y su confirmación no coinciden");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await api.put("/usuarios/cambiar-contrasena", {
                actual: currentPassword,
                nueva: newPassword,
                confirmar: confirmPassword
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });


            alert("✅ Contraseña cambiada con éxito");
            onClose();
            localStorage.clear(); // Borra token y estado
            window.location.href = "/"; // Redirige al login
        } catch (error) {
            console.error("❌ Error al cambiar contraseña:", error);
            alert("❌ No se pudo cambiar la contraseña");
        }
    };

    // Renderiza el modal con los campos para cambiar la contraseña
    // Incluye botones para guardar, limpiar y salir del modal
    return (

        // Modal para cambiar la contraseña
        // Contiene campos para la contraseña actual, nueva y confirmación
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.modalCloseButton} onClick={onClose}>
                    <CloseIcon />
                </button>

                <h2 className={styles.title}>Cambiar Contraseña</h2>

                <div className={styles.modalFormGroup}>
                    <label className={styles.labelModal}>Contraseña actual:</label>
                    <div className={styles.passwordInputWrapper}>
                        <input
                            type={showCurrent ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Ingrese la contraseña actual (Obligatorio)"
                        />
                        <span
                            className={styles.togglePasswordIcon}
                            onClick={() => setShowCurrent(!showCurrent)}
                        >
                            {showCurrent ? <VisibilityOff /> : <Visibility />}
                        </span>
                    </div>
                </div>

                <div className={styles.modalFormGroup}>
                    <label className={styles.labelModal}>Nueva contraseña:</label>
                    <div className={styles.passwordInputWrapper}>
                        <input
                            type={showNew ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Ingrese la nueva contraseña (Obligatorio)"
                        />
                        <span
                            className={styles.togglePasswordIcon}
                            onClick={() => setShowNew(!showNew)}
                        >
                            {showNew ? <VisibilityOff /> : <Visibility />}
                        </span>
                    </div>
                </div>

                <div className={styles.modalFormGroup}>
                    <label className={styles.labelModal}>Confirmar nueva contraseña:</label>
                    <div className={styles.passwordInputWrapper}>
                        <input
                            type={showConfirm ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirme la nueva contraseña (Obligatorio)"
                        />
                        <span
                            className={styles.togglePasswordIcon}
                            onClick={() => setShowConfirm(!showConfirm)}
                        >
                            {showConfirm ? <VisibilityOff /> : <Visibility />}
                        </span>
                    </div>
                </div>

                {/* Botones para guardar, limpiar y salir del modal */}
                <div className={styles.modalButtonGroup}>
                    <button className={styles.modalButtonSave} onClick={handleSubmit}>
                        Cambiar <LockResetIcon style={{ marginLeft: 8 }} />
                    </button>
                    <button
                        className={styles.modalClearButton}
                        onClick={() => {
                            setCurrentPassword("");
                            setNewPassword("");
                            setConfirmPassword("");
                        }}
                    >
                        Limpiar <CleaningServicesIcon style={{ marginLeft: 8 }} />
                    </button>
                    <button className={styles.modalButtonExit} onClick={onClose}>
                        Salir <ExitToAppIcon style={{ marginLeft: 8 }} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
