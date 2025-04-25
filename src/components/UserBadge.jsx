import React from 'react'
import '../style/UserBadge.css';


const UserBadge = ({ nombreCompleto, rol }) => {

    // Función para obtener las iniciales del nombre completo
    // Separa el nombre completo en partes y toma la primera letra del primer nombre y la primera letra del primer apellido
    // Si no hay nombre o apellido, devuelve una cadena vacía
    export const obtenerIniciales = (nombres, primerApellido) => {
        const inicialNombre = nombres?.trim().split(' ')[0]?.[0]?.toUpperCase() || '';
        const inicialApellido = primerApellido?.trim()[0]?.toUpperCase() || '';
        return inicialNombre + inicialApellido;
      };

    return (
        <div className="user-badge">
            <div className="user-info">
                <strong>{nombreCompleto}</strong>
                <p>{rol}</p>
            </div>
            <div className="user-initials">
                {obtenerIniciales(nombreCompleto)}
            </div>
        </div>
    )
}

export default UserBadge