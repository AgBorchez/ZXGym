const API_URL = 'https://localhost:7102/api/socios';
const btn_theme = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');
let currentSortBy = "dni";
let CurrentIsAscending = true;
let dniSocioActual = null;
let fechaAlta = "";
let fechaVencimiento = "";
let PlanSeleccionado = null;
let EditionMode = false;
let FiltroEstadoSocios = true;

if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    btn_theme.checked = true;
}

btn_theme.addEventListener('change', () => {
    if (btn_theme.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
});

let timerBuscqueda;
document.getElementById('inputBusqueda').addEventListener('input', (event) => {
    clearTimeout(timerBuscqueda);
    timerBuscqueda = setTimeout(() => {
        cargarSocios(event.target.value);
    }, 300);
});

async function cargarSocios(textoBusqueda = '') {
    try {
        let contenido = '';
        let urlfinal = `${API_URL}?buscar=${textoBusqueda}&SortBy=${currentSortBy}&IsAscending=${CurrentIsAscending}&ActiveOnly=${FiltroEstadoSocios}`;

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
                                <button class="btn-editar" onclick="prepararEdicion(${socio.dni})">Editar</button>
                                <button class="btn-eliminar" onclick="borrarSocio(${socio.dni})">Borrar</button>
                            </td>
                        </tr>
                    `;
            contenido += fila;
        });

        tabla.innerHTML = contenido;

        if(!FiltroEstadoSocios){
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


async function guardarSocio(event) {
    event.preventDefault();

    const dniInput = parseInt(document.getElementById('dni').value);
    const NameInput = document.getElementById('nombre');
    const LNameInput = document.getElementById('apellido');
    const emailInput = document.getElementById('email');
    const telefonoInput = document.getElementById('telefono');

    if(!fechaVencimiento){
        alert("Por favor, selecciona una membresía para determinar la fecha de vencimiento.");
        return;
    }

    
    if(isNaN(dniInput) || dniInput <= 0){
        alert("El campo DNI no puede estar vacío ni contener letras ni ser menor o igual a cero.");
        return;
    }

    if(!NameInput.value.trim() || !LNameInput.value.trim()){
        alert("El socio debe tener un nombre y apellido válidos.");
        return;
    }

    if(!emailInput.value.trim() || !emailInput.validity.valid){
        alert("Por favor, ingresa un email válido.");
        return;
    }

    if(telefonoInput.value.trim().length < 8){
        alert("Por favor, ingresa un número de teléfono válido.");
        return;
    }

    const socioObj = {
        dni: dniInput,
        name: NameInput.value.trim(),
        lastName: LNameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: telefonoInput.value.trim(),
        joinDate: fechaAlta,
        endDate: fechaVencimiento,
        planId: PlanSeleccionado,
        
    };


    const metodo = dniSocioActual ? 'PUT' : 'POST';
    const urlFinal = dniSocioActual ? `${API_URL}/${dniSocioActual}` : API_URL;

    try {
        const respuesta = await fetch(urlFinal, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(socioObj)
        });

        if (respuesta.ok) {
            alert('socio guardado exitosamente.');
            cancelarEdicion();
            cargarSocios();
        } else {
            const errorText = await respuesta.text();
            alert('Error del servidor: ' + errorText);
        }
    } catch (error) {
        console.error('Error de conexión: ', error);
    }
}

async function borrarSocio(dni) {

    if (confirm('¿Estás seguro de que querés borrar este socio para siempre?')) {
        try {
            const respuesta = await fetch(`${API_URL}/${dni}`, {
                method: 'DELETE'
            });

            if (respuesta.ok) {
                cargarSocios();
            } else {
                alert('No se pudo borrar el socio.');
            }
        } catch (error) {
            console.error("Error al borrar:", error);
        }
    }
}


async function prepararEdicion(dni) {

    dniSocioActual = dni;
    EditionMode = true;
    const respuesta = await fetch(`${API_URL}/${dni}`);
    const socio = await respuesta.json();
    document.getElementById('nombre').value = socio.name;
    document.getElementById('apellido').value = socio.lastName;
    document.getElementById('email').value = socio.email;
    fechaAlta = FiltroEstadoSocios ? new Date(socio.joinDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

    document.getElementById('dni').value = socio.dni;
    document.getElementById('dni').readOnly = true;
    document.getElementById('btnSubmit').innerText = "Actualizar Cambios";
    document.getElementById('btnSubmit').className = "btn-editar";
    document.getElementById('btnCancelar').style.display = "inline-block"; 
    document.getElementById('btnCancelar').style.cursor = "pointer";
}


function cancelarEdicion() {

    dniSocioActual = null;
    EditionMode = false;
    document.getElementById('formSocio').reset();
    document.getElementById('tituloFormulario').innerText = "Alta de Nuevo Socio";
    document.getElementById('btnSubmit').innerText = "Guardar Socio";
    document.getElementById('btnSubmit').className = "btn-guardar";
    document.getElementById('btnCancelar').style.display = "none";
    document.getElementById('dni').readOnly = false;
    document.getElementById('dni').value = '';
    fechaVencimiento = '';
    document.getElementById("infoFechaVencimiento").innerText = '';
    PlanSeleccionado = null;
    document.querySelectorAll('.btn-Plan').forEach(btn => {
        btn.style.backgroundColor = 'var(--plan-Btn)';
    });
}

function buscarSocios() {
    const textoBusqueda = document.getElementById('inputBusqueda').value;
    cargarSocios(textoBusqueda);
}

function limpiarBusqueda() {
    document.getElementById('inputBusqueda').value = '';
    cargarSocios();
}

function ordenarPor(columna) {
    if (currentSortBy === columna) {
        CurrentIsAscending = !CurrentIsAscending;
    } else {
        currentSortBy = columna;
        CurrentIsAscending = true;
    }

    const thActivo = document.querySelector(`th[onclick="ordenarPor('${columna}')"]`);

    cargarSocios();
}

function SelectorPlanes(meses, idboton) {
    
        document.querySelectorAll('.btn-Plan').forEach(btn => {
        btn.style.backgroundColor = 'var(--plan-Btn)';
    });
    document.getElementById(idboton).style.backgroundColor = 'var(--save-Btn)';
    
    const fechaActual = new Date(); fechaActual.setHours(0, 0, 0, 0);
    
    if(!EditionMode){
        const fechabaja = new Date(fechaActual);
        fechabaja.setMonth(fechabaja.getMonth() + meses);
        fechaAlta = fechaActual.toISOString().split('T')[0];
        fechaVencimiento = fechabaja.toISOString().split('T')[0];
        PlanSeleccionado = meses;
    }else{
        const fechabaja = new Date(fechaAlta);
        fechabaja.setMonth(fechabaja.getMonth() + meses);
        fechaVencimiento = fechabaja.toISOString().split('T')[0];
        PlanSeleccionado = meses;
    }
    document.getElementById("infoFechaVencimiento").innerText = `Vence en: ${fechaVencimiento}`;
}

function FiltroEstado(activo, idBtn) {
    FiltroEstadoSocios = activo;
    document.getElementById(idBtn).style.backgroundColor = 'var(--save-Btn)';
    document.querySelectorAll('.btn-filtro').forEach(btn => {
        if(btn.id !== idBtn) {
            btn.style.backgroundColor = 'var(--bg-color)';
        }
    });

    cargarSocios();

}

FiltroEstado(true, 'filtro-Activo');
cargarSocios();