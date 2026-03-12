import { EstadoSocios, EstadoPagina } from "./config.js";

export function ValidacionDatos(Dni, Name, LName, Email, Telefono) {
     
    console.log("aaabbbssssccccddddeeee");
    if(!EstadoSocios.fechaVencimiento){
        alert("Por favor, selecciona una membresía para determinar la fecha de vencimiento.");
        return false;
    }

    
    if(isNaN(Dni) || Dni <= 0){
        alert("El campo DNI no puede estar vacío ni contener letras ni ser menor o igual a cero.");
        return false;
    }

    if(!Name.value.trim() || !LName.value.trim()){
        alert("El socio debe tener un nombre y apellido válidos.");
        return false;
    }

    if(!Email.value.trim() || !Email.validity.valid){
        alert("Por favor, ingresa un email válido.");
        return false;
    }

    if(Telefono.value.trim().length < 8 || isNaN(parseInt(Telefono.value.trim()))){
        alert("Por favor, ingresa un número de teléfono válido.");
        return false;
    }

        return true;
}

export function SelectorPlanes(meses, idboton) {
    
        document.querySelectorAll('.btn-Plan').forEach(btn => {
        btn.style.backgroundColor = 'var(--plan-Btn)';
    });
    document.getElementById(idboton).style.backgroundColor = 'var(--save-Btn)';
    
    const fechaActual = new Date(); fechaActual.setHours(0, 0, 0, 0);
    
    if(!EstadoPagina.EditionMode){
        const fechabaja = new Date(fechaActual);
        fechabaja.setMonth(fechabaja.getMonth() + meses);
        EstadoSocios.fechaAlta = fechaActual.toISOString().split('T')[0];
        EstadoSocios.fechaVencimiento = fechabaja.toISOString().split('T')[0];
        EstadoSocios.PlanSeleccionado = meses;
    }else{
        const fechabaja = new Date(EstadoSocios.fechaAlta);
        fechabaja.setMonth(fechabaja.getMonth() + meses);
        EstadoSocios.fechaVencimiento = fechabaja.toISOString().split('T')[0];
        EstadoSocios.PlanSeleccionado = meses;
    }
    document.getElementById("infoFechaVencimiento").innerText = `Vence en: ${EstadoSocios.fechaVencimiento}`;
}