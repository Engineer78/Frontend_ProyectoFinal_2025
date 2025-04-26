import React from 'react'
import '../styles/userBadge.css'; // Asegúrate de que la ruta sea correcta
import { getLoggedUserData } from '../authUtils.js';
import { obtenerIniciales } from '../obtenerIniciales';

const UserBadge = () => {

    // Simulación de usuario logueado (en el futuro vendrá del backend o localStorage)
    const { rol, nombres, apellidoPaterno } = getLoggedUserData();

    const nombreCompleto = `${nombres} ${apellidoPaterno}`;
    const iniciales = obtenerIniciales(nombres, apellidoPaterno);

    return (
        <div className="user-badge">
            <div className="user-info">
                <strong>{nombreCompleto}</strong>
                <p>{rol}</p>
            </div>
            <div className="user-initials">
                {iniciales}
            </div>
        </div>
    )
}

export default UserBadge