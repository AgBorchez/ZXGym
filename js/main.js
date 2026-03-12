import { inicializarTema, EstadoPagina, EstadoSocios, API_URL } from "./config.js"; 

import { cargarSocios, FiltroEstado , prepararEdicion , abrirFormulario, EstadoFormulario, ordenarPor, cargarSocios_TablaPatologias} from "./ui_manager.js";

import { SelectorPlanes } from "./validators.js";

import { guardarSocio, borrarSocio } from "./api_service.js";

document.addEventListener('DOMContentLoaded', async () => {

    
    inicializarTema();

    
    const tabla = document.getElementById('tablaSocios');
    if (tabla) {
        console.log("Cargando vista de Tabla...");
        
        window.ordenarPor = ordenarPor;
        window.borrarSocio = borrarSocio;
        window.abrirFormulario = abrirFormulario;
        window.FiltroEstado = FiltroEstado;
        window.cargarSocios = cargarSocios;
        window.prepararEdicion = prepararEdicion;

        // Carga inicial
        if (window.location.pathname.endsWith('Pagina_Inicio.html') || window.location.pathname.includes('Inicio')) { 
            FiltroEstado(true, 'filtro-Activo');
            cargarSocios();
        } 
    
        if (window.location.pathname.endsWith('Index_Patologias.html') || window.location.pathname.includes('Patologias')) { cargarSocios_TablaPatologias(); }
        
    }

    
    const form = document.getElementById('formSocio');
    if (form) {
        form.addEventListener('submit', guardarSocio);

        window.SelectorPlanes = SelectorPlanes;
        window.EstadoFormulario = EstadoFormulario;

        const parametros = new URLSearchParams(window.location.search);
        const DniEditar = parametros.get('editarDni')
        

        if(DniEditar){
            const respuesta = await fetch(`${API_URL}/${DniEditar}`);

            if(!respuesta.ok) {
                alert("Algo salio mal...")
                return
            }
            const socio = await respuesta.json();
            let checkboxes = document.querySelectorAll('.CheckboxPatologias_CrearSocio')
            console.log(checkboxes)
            console.log("array de patologias backend: ", socio.patologias)

            document.getElementById('dni').value = socio.dni;
            document.getElementById('dni').readOnly = true;
            document.getElementById('nombre').value = socio.name;
            document.getElementById('apellido').value = socio.lastName;
            document.getElementById('email').value = socio.email;
            document.getElementById('telefono').value = socio.phone;
            EstadoSocios.fechaAlta = EstadoPagina.FiltroEstadoSocios ? new Date(socio.joinDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
            document.getElementById('btnSubmit').innerText = "Actualizar Cambios";
            document.getElementById('btnSubmit').className = "btn-editar";
            checkboxes.forEach(checkb => {
                console.log("checkboxid: ", Number(checkb.id));
                if(socio.patologias.includes(Number(checkb.id))){
                    
                    checkb.checked = true;
                }
            }); 
        }

        
    }
});