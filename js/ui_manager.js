import { API_SOCIOS_URL, API_ENTRENADORES_URL, EstadoPagina, EstadoSocios } from "./config.js";

export async function cargarSocios(textoBusqueda = '') {
    try {
        let contenido = '';
        let urlfinal = `${API_SOCIOS_URL}?buscar=${encodeURIComponent(textoBusqueda)}&SortBy=${EstadoSocios.currentSortBy}&IsAscending=${EstadoPagina.CurrentIsAscending}&ActiveOnly=${EstadoPagina.FiltroEstadoSocios}`;

        const respuesta = await fetch(urlfinal);
        const socios = await respuesta.json();

        const tabla = document.getElementById('tablaSocios');
        tabla.innerHTML = '';

        if(socios.length === 0){
        tabla.innerHTML = '<tr><td colspan="9" style="text-align: center;">No se encontraron socios.</td></tr>';
        return;
        }

        socios.forEach(socio => {
            const fila = `
                        <tr>
                            <td>${socio.dni}</td>
                            <td>${socio.name}</td>
                            <td>${socio.lastName}</td>
                            <td>${socio.email}</td>
                            <td>${socio.phone}</td>
                            <td>${socio.joinDate ? new Date(socio.joinDate).toLocaleDateString('es-AR', {timeZone: 'UTC'}) : 'N/A'}</td>
                            <td>${socio.endDate ? new Date(socio.endDate).toLocaleDateString('es-AR', {timeZone: 'UTC'}) : 'N/A'}</td>
                            <td>${socio.planId}</td>
                            <td>
                                <button class="btn-editar" onclick="prepararEdicionSocios(${socio.dni})">Editar</button>
                                <button class="btn-eliminar" onclick="borrarSocio(${socio.dni})">Borrar</button>
                            </td>
                        </tr>
                    `;
            contenido += fila;
        });

        tabla.innerHTML = contenido;

        if(!EstadoPagina.FiltroEstadoSocios){
        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.style.backgroundColor = 'var(--save-Btn)';
            btn.textContent = "Renovar Plan";
            console.log("Botones de editar modificados para socios vencidos.");
    });
}     
    } catch (error) {
        console.error("Error al cargar:", error);
    }
}

export async function prepararEdicionSocios(dni) {
    EstadoSocios.dniActual = dni;
    window.open(`Crear_Socio.html?editarDni=${dni}`, 'AltaSocio', 'width=550,height=650,resizable=no,scrollbars=yes');
}

export function FiltroEstado(activo, idBtn) {
    EstadoPagina.FiltroEstadoSocios = activo;
    document.getElementById(idBtn).style.backgroundColor = 'var(--save-Btn)';
    document.querySelectorAll('.btn-filtro').forEach(btn => {
        if(btn.id !== idBtn) {
            btn.style.backgroundColor = 'var(--bg-color)';
        }
    });
    cargarSocios();

}

export function limpiarBusqueda() {
    document.getElementById('inputBusqueda').value = '';
    cargarSocios();
}

export function ordenarPor(columna) {
    if (EstadoSocios.currentSortBy === columna) {
        EstadoPagina.CurrentIsAscending = !EstadoPagina.CurrentIsAscending;
    } else {
        EstadoSocios.currentSortBy = columna;
        EstadoPagina.CurrentIsAscending = true;
    }

    const thActivo = document.querySelector(`th[onclick="ordenarPor('${columna}')"]`);

    cargarSocios();
}

export function abrirFormulario(){
    window.open('Crear_Socio.html', 'AltaSocio', 'width=550,height=650,resizable=no,scrollbars=yes');
}

export async function cargarSocios_TablaPatologias(textoBusqueda = '') {
    try {
        let tablaPatologias = true;
        let contenido = '';
        let urlfinal = `${API_SOCIOS_URL}?buscar=${encodeURIComponent(textoBusqueda)}&Tabla_Patologias=${tablaPatologias}&SortBy=${EstadoSocios.currentSortBy}&IsAscending=${EstadoPagina.CurrentIsAscending}`;

        const respuesta = await fetch(urlfinal);
        const socios = await respuesta.json();

        const tabla = document.getElementById('tablaSocios');
        tabla.innerHTML = '';

        if(socios.length === 0){
        tabla.innerHTML = '<tr><td colspan="13" style="text-align: center;">No se encontraron socios.</td></tr>';
        return;
        }

        socios.forEach(socio => {
            const tiene = (id) => {
            return (socio.patologias || []).includes(id) ? '✔️' : '❌';
        }
            const fila = `
                        <tr class="tr-patologias">
                            <td>${socio.dni}</td>
                            <td>${socio.name}</td>
                            <td>${socio.lastName}</td>
                            <td style="text-align: center;">${tiene(1)}</td>
                            <td style="text-align: center;">${tiene(2)}</td>
                            <td style="text-align: center;">${tiene(3)}</td>
                            <td style="text-align: center;">${tiene(4)}</td>
                            <td style="text-align: center;">${tiene(5)}</td>
                            <td style="text-align: center;">${tiene(6)}</td>
                            <td style="text-align: center;">${tiene(7)}</td>
                            <td style="text-align: center;">${tiene(8)}</td>
                            <td style="text-align: center;">${tiene(9)}</td>
                            <td style="text-align: center;">${tiene(10)}</td>
                        </tr>
                    `;
            contenido += fila;
        });

        tabla.innerHTML = contenido;   
    } catch (error) {
        console.error("Error al cargar:", error);
    }
}

export async function cargarEntrenadores(textoBusqueda = '') {
    try {
        let contenido = '';
        
        let urlfinal = `${API_ENTRENADORES_URL}?buscar=${encodeURIComponent(textoBusqueda)}&SortBy=${EstadoSocios.currentSortBy}&IsAscending=${EstadoPagina.CurrentIsAscending}`;

        const respuesta = await fetch(urlfinal);
        const entrenadores = await respuesta.json();

        const tabla = document.getElementById('tablaEntrenadores');
        tabla.innerHTML = '';

        if(entrenadores.length === 0){
            tabla.innerHTML = '<tr><td colspan="10" style="text-align: center;">No se encontraron entrenadores.</td></tr>';
            return;
        }

        entrenadores.forEach(entrenador => {
            const fila = `
                <tr>
                    <td>${entrenador.dni}</td>
                    <td>${entrenador.name}</td>
                    <td>${entrenador.lastName}</td>
                    <td>${entrenador.email}</td>
                    <td>${entrenador.phone}</td>
                    <td>${entrenador.specialty}</td>
                    <td>${entrenador.shift}</td>
                    <td>${entrenador.joinDate ? new Date(entrenador.joinDate).toLocaleDateString('es-AR', {timeZone: 'UTC'}) : 'N/A'}</td>
                    <td>${entrenador.rcpExpirationDate ? new Date(entrenador.rcpExpirationDate).toLocaleDateString('es-AR', {timeZone: 'UTC'}) : 'N/A'}</td>
                    <td>
                        <button class="btn-editar" onclick="prepararEdicionEntrenador(${entrenador.dni})">Editar</button>
                        <button class="btn-eliminar" onclick="borrarEntrenador(${entrenador.dni})">Borrar</button>
                    </td>
                </tr>
            `;
            contenido += fila;
        });

        tabla.innerHTML = contenido;
     
    } catch (error) {
        console.error("Error al cargar los entrenadores:", error);
    }
}

export async function prepararEdicionEntrenador(dni) {
    EstadoSocios.dniActual = dni;
    window.open(`Registrar_Entrenador.html?editarDni=${dni}`, 'AltaEntrenador', 'width=550,height=650,resizable=no,scrollbars=yes');
}


