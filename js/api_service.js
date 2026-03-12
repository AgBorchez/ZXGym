import { API_URL, EstadoPagina, EstadoSocios } from "./config.js";
import { ValidacionDatos } from "./validators.js"; 
import { cargarSocios, cancelarEdicion, cargarSocios_TablaPatologias } from "./ui_manager.js"; 

let timerBuscqueda;

const inputBusqueda = document.getElementById('inputBusqueda');
if (inputBusqueda) {
    inputBusqueda.addEventListener('input', (event) => {
        clearTimeout(timerBuscqueda);
        timerBuscqueda = setTimeout(() => {
            cargarSocios(event.target.value);
        }, 300);
    });
}

const inputBusqueda_TablaPatologias = document.getElementById('inputBusqueda_tablaPatologias');
if (inputBusqueda_TablaPatologias) {
    inputBusqueda_TablaPatologias.addEventListener('input', (event) => {
        clearTimeout(timerBuscqueda);
        timerBuscqueda = setTimeout(() => {
            cargarSocios_TablaPatologias(event.target.value);
        }, 300);
    });
}

export async function guardarSocio(event) {
    event.preventDefault();

    const dniInput = parseInt(document.getElementById('dni').value);
    const NameInput = document.getElementById('nombre');
    const LNameInput = document.getElementById('apellido');
    const emailInput = document.getElementById('email');
    const telefonoInput = document.getElementById('telefono');
    const patologiasIDs = [];
    document.querySelectorAll('input[name="patologia"]:checked').forEach(checkbox => {
        patologiasIDs.push(parseInt(checkbox.value));
    });

    if (!ValidacionDatos(dniInput, NameInput, LNameInput, emailInput, telefonoInput)) {
        return;
    }

    const socioObj = {
        dni: dniInput,
        name: NameInput.value.trim(),
        lastName: LNameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: telefonoInput.value.trim(),
        joinDate: EstadoSocios.fechaAlta,
        endDate: EstadoSocios.fechaVencimiento,
        planId: EstadoSocios.PlanSeleccionado,
        patologias: patologiasIDs
        
    };

    const metodo = EstadoSocios.dniSocioActual ? 'PUT' : 'POST';
    const urlFinal = EstadoSocios.dniSocioActual ? `${API_URL}/${EstadoSocios.dniSocioActual}` : API_URL;

    try {
        const respuesta = await fetch(urlFinal, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(socioObj)
        });

        if (respuesta.ok) {
            alert('socio guardado exitosamente.');
            if (EstadoPagina.EditionMode) {cancelarEdicion()};
            if(window.opener && !window.opener.closed){
                window.opener.cargarSocios();
            }
            window.close();
        } else {
            const errorText = await respuesta.text();
            alert('Error del servidor: ' + errorText);
        }
    } catch (error) {
        console.error('Error de conexión: ', error);
    }
}

export async function borrarSocio(dni) {
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