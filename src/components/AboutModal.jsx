import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CloseIcon from '@mui/icons-material/Close';
import styles from '../styles/modalstyles.module.css';

// Este componente muestra un modal con información sobre el proyecto, incluyendo detalles del centro educativo, aprendices, agradecimientos e instructores.
// Se utiliza para proporcionar contexto y reconocimiento a las personas involucradas en el proyecto.
const AboutModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    // El modal se renderiza solo si isOpen es true.
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContentAbout}>
                <button className={styles.modalCloseButton} onClick={onClose}>
                    <CloseIcon />
                </button>
                <h2 className={styles.modalTitleCenter}>Acerca de</h2>

                <div className={styles.modalHeaderInfo}>
                    <p><strong>Centro de Comercio y Turismo de Armenia - Regional Quindío</strong></p>
                    <p><strong>Tecnología en Análisis y Desarrollo de Software</strong></p>
                    <p><strong>Ficha:</strong> 2879723</p>
                </div>

                <div className={styles.modalFormGroupAbout}>
                    <h3>👨‍🎓 Aprendices</h3>
                    <ul>
                        <li>David Ricardo Graffe Rodríguez</li>
                        <li>Joaquín Humberto Jiménez Rosas</li>
                        <li>Juan David Gallego López</li>
                    </ul>
                </div>

                <div className={styles.modalFormGroupAbout}>
                    <h3>🙏 Agradecimientos Especiales</h3>

                    <p><strong>Subdirector:</strong> César Augusto Ospina Puertas</p>

                    <p><strong>Coordinador Académico Virtualidad:</strong> Juan David Laverde Moncada</p>
                </div>

                <div className={styles.modalFormGroupAbout}>
                    <h3>👩‍🏫 Instructores</h3>
                    <div className={styles.instructorGrid}>
                        <div>
                            <h3>🖥️ Técnicos</h3>
                            <ul>
                                <li>Ing. Carlos Alberto Fuel Tulcán</li>
                                <li>Ing. Carlos Andrés Mora Agudelo</li>
                                <li>Ing. Diana María Valencia Rebellón</li>
                                <li>Ing. Nicolás Estiben Saldarriaga Garzón</li>
                                <li>Ing. Ricardo Alfonso González Vargas</li>
                                <li>Ing. Yamile Toro Jaramillo</li>
                            </ul>
                        </div>
                        <div>
                            <h3>📙 Transversales</h3>
                            <ul>
                                <li>Psicól. Adriana López Duque</li>
                                <li>Ec. Blanca Liliana Parra Peña</li>
                                <li>Psicól. Idaly Pérez Amézquita</li>
                                <li>Adm.or Jhon Danilo Pérez Rojas</li>
                                <li>Lic. Johanna Paola Afanador</li>
                                <li>Adm.or Rubén Darío Gutiérrez Galindo</li>
                                <li>Psicól. Susy Lezama Velásquez</li>
                            </ul>
                        </div>
                    </div>
                </div>


                <div className={styles.modalButtonGroupAbout}>
                    <button className={styles.modalButtonExit} onClick={onClose}>
                        Salir <ExitToAppIcon style={{ marginRight: '8px' }} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AboutModal;
