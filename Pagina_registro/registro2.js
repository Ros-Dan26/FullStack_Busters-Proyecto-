
document.getElementById('enviar-registro').addEventListener('submit', function (event) {
    // Verificamos si el formulario es válido
        event.preventDefault(); // Evita que se envíe el formulario
   
        // Aquí puedes ejecutar tu código solo si todo es válido

        const nombre = document.getElementById("nombre-registro").value;
        const apellidos = document.getElementById("apellidos-registro").value;
        const correo = document.getElementById("correo-registro").value;
        const estado = document.getElementById("estado-registro").value;
        const contrasena = document.getElementById("contrasena-registro").value;
        const contrasenaConf = document.getElementById("contrasenaConf-registro").value;

        let resultadoIgualdad;

        if (contrasena === contrasenaConf) {
            resultadoIgualdad = "iguales"

            //alert(`Nombre: ${nombre} Apellidos: ${apellidos}`);
            //alert(`Correo: ${correo} estado: ${estado}`);
            //alert(`contraseña: ${contrasena} confirma: ${contrasenaConf} comp: ${resultadoIgualdad}`);

            mostrarPopupRegistro(event);
        }
        else {
            resultadoIgualdad = "Diferentes"
            alert("Contraseñas no coinciden.")
        }

        console.log("Formulario válido, ejecutando acción...");
    
});



function mostrarPopupRegistro(event) {
    event.preventDefault();
    document.getElementById("popup-registro").style.display = "flex";
}

function cerrarPopupRegistro() {
    document.getElementById("popup-registro").style.display = "none";
    window.location.href = "login.html";
}


