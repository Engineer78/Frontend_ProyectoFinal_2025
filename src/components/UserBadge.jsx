import React from 'react'
import '../style/UserBadge.css';
import { getLogerUserData} from '../authUtils';


const UserBadge = ({ nombreCompleto, rol }) => {

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