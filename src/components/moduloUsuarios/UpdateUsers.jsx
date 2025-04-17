import React from 'react'

const UpdateUsers = () => {
    // Componente para actualizar productos del inventario.
    // Incluye navegación entre pestañas, formulario de búsqueda y edición de producto,
    // carga de imagen, y botones para guardar, limpiar o salir.
    return (
        <>
            <Header
                title="Módulo registro de usuarios"
                subtitle="Hardware Store Inventory FFIG"
                showLogo={true}
                showHelp={true}
            />

            <div className={styles.tabs}>
                <Link
                    to="/inventory-registration"
                    className={`${styles.tabButton} ${activeTab === "registro" ? styles.active : ""}`}
                    onClick={() => handleTabClick("registro")}
                >
                    Registrar Usuarios
                </Link>

                <Link
                    to="/merchandise-query"
                    className={`${styles.tabButton} ${activeTab === "consulta" ? styles.active : ""}`}
                    onClick={() => handleTabClick("consulta")}
                >
                    Consultar Usuarios
                </Link>

                <Link
                    to="/update-merchandise"
                    className={`${styles.tabButton} ${activeTab === "actualizar" ? styles.active : ""}`}
                    onClick={() => handleTabClick("actualizar")}
                >
                    Actualizar Usuarios
                </Link>

                <Link
                    to="/delete-merchandise"
                    className={`${styles.tabButton} ${activeTab === "eliminar" ? styles.active : ""}`}
                    onClick={() => handleTabClick("eliminar")}
                >
                    Eliminar Usuarios
                </Link>
            </div>

            {activeTab === "actualizar" && (
                <div className={styles.container}>
                    <h2 className={styles.title}>
                        Ingrese el Número de Identificación para buscar y actualizar el registro
                    </h2>

                    <div className={styles.formContainer}>
                        <form className={styles.formLeft}>
                            <label className={styles.inputLabel}>Número de Identificación:</label>
                            <input
                                type="text"
                                placeholder="Número de Identificación (Obligatorio)"
                                value={userID}
                                onChange={(e) => setProductCode(e.target.value)}
                                required
                                className={styles.input}
                            //disabled={isCodeDisabled} // Deshabilita el input si se busca un producto
                            />

                            <button
                                type="button"
                                onClick={handleSearch}
                                className={styles.searchButton}
                            >
                                Buscar <SearchIcon style={{ marginLeft: 5 }} />
                            </button>

                            <label className={styles.inputLabel}>Nombre(s):</label>
                            <input
                                type="text"
                                placeholder="Nombre(s)"
                                value={userName}
                                onChange={(e) => setSupplierNIT(e.target.value)}
                                className={styles.input}
                            />

                            <label className={styles.inputLabel}>Primer Apellido:</label>
                            <input
                                type="text"
                                placeholder="Primer Apellido (Obligatorio)"
                                value={userLastName}
                                onChange={(e) => setUserLastName(e.target.value)}
                                required
                                className={styles.input}
                            />

                            <label className={styles.inputLabel}>Segundo Apellido :</label>
                            <input
                                type="text"
                                placeholder="Segundo Apellido (Opcional)"
                                value={userSecondLastName}
                                onChange={(e) => setUserSecondLastName(e.target.value)}
                                required
                                className={styles.input}
                            />

                            <label className={styles.inputLabel}>Nombre de Usuario:</label>
                            <input
                                type="text"
                                placeholder="Nombre de Usuario (Obligatorio)"
                                value={userAlias}
                                onChange={(e) => setUserAlias(e.target.value)}
                                required
                                className={styles.input}
                            />

                            <label className={styles.inputLabel}>Contraseña:</label>
                            <input
                                type="text"
                                placeholder="Contraseña (Obligatorio)"
                                value={userPassword}
                                onChange={(e) => setUserPassword(e.target.value)}
                                required
                                className={styles.input}
                            />

                            <label className={styles.inputLabel}>Teléfono Móvil:</label>
                            <input
                                type="text"
                                placeholder="Teléfono Móvil (Obligatorio)"
                                value={userPhone}
                                onChange={(e) => setUserPhone(e.target.value)}
                                required
                                className={styles.input}
                            />

                            <label className={styles.inputLabel}>Dirección de Residencia:</label>
                            <input
                                type="text"
                                placeholder="Dirección de Residencia (Obligatorio)"
                                value={userAddress}
                                onChange={(e) => setUserAddress(e.target.value)}
                                required
                                className={styles.input}
                            />

                            <label className={styles.inputLabel}>Contacto de Emergencia:</label>
                            <input
                                type="text"
                                placeholder="Contacto de Emergencia (Obligatorio)"
                                value={userEmergencyContact}
                                onChange={(e) => setUserEmergencyContact(e.target.value)}
                                required
                                className={styles.input}
                            />

                            <label className={styles.inputLabel}>Teléfono de Contacto:</label>
                            <input
                                type="text"
                                placeholder="Teléfono de Contacto (Obligatorio)"
                                value={userContactPhone}
                                onChange={(e) => setUserContactPhone(e.target.value)}
                                required
                                className={styles.input}
                            />
                        </form>

                        <form className={styles.formRight}>
                            <div className={styles.selectGroup}>
                                <div className={styles.formGroup}>
                                    <label className={styles.inputLabel}>Tipo de Documento</label>
                                    <div className={styles.selectWrapper}>
                                        <select id="tipoDocumento"
                                            className={styles.select}
                                            value={documentType}
                                            onChange={(e) => setDocumentType(e.target.value)}
                                            required
                                        >
                                            <option value=""> Seleccione un tipo de documento </option>
                                            <option value="CC">Cédula de Ciudadanía (CC)</option>
                                            <option value="CE">Cédula de Extranjería (CE)</option>
                                            <option value="PAS">Pasaporte (PA)</option>
                                            <option value="TI">Tarjeta de Identidad (TI)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.inputLabel}>Tipo de Rol</label>
                                    <div className={styles.selectWrapper}>
                                        <select id="tipoRol"
                                            className={styles.select}
                                            value={rolType}
                                            onChange={(e) => setRolType(e.target.value)}
                                            required
                                        >
                                            <option value=""> Seleccione un rol </option>
                                            <option value="administrador">Administrador</option>
                                            <option value="almacenista">Almacenista</option>
                                            <option value="propietario">Propietario</option>
                                            <option value="vendedor">Vendedor</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className={styles.actionButtons}>
                        <button className={styles.saveButton} onClick={handleSave}>
                            Guardar <SaveIcon />
                        </button>
                        <button className={styles.clearButton} onClick={handleClear}>
                            Limpiar <CleaningServicesIcon />
                        </button>
                        <button
                            type="button"
                            onClick={() => (window.location.href = "/menu-principal")}
                            className={styles.exitButton} >
                            Salir <ExitToAppIcon /> </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default UpdateUsers