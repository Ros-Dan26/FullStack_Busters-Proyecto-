/*
document.addEventListener("DOMContentLoaded",() =>{
    const btn = document.getElementById("enviar-registro");

    btn.addEventListener("click", () => 
    {
        const nombre = document.getElementById("nombre-registro").value;
        const apellidos = document.getElementById("apellidos-registro").value;
        const correo = document.getElementById("correo-registro").value;
        const estado = document.getElementById("estado-registro").value;
        const contrasena = document.getElementById("contrasena-registro").value;
        const contrasenaConf = document.getElementById("contrasenaConf-registro").value;

        alert(`Nombre: ${nombre} Apellidos: ${apellidos}`);
        alert(`Correo: ${correo} estado: ${estado}`);
        alert(`contraseña: ${contrasena} confirma: ${contrasenaConf}`);
        
    })
})*/

function mostrarPopupRegistro(event) {
    event.preventDefault();
    document.getElementById("popup-registro").style.display="flex";
}

function cerrarPopupRegistro() {
    document.getElementById("popup-registro").style.display="none";
}


