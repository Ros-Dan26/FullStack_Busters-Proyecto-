
document.getElementById('enviar-registro').addEventListener('submit', function (event) {
    // Verificamos si el formulario es válido
    event.preventDefault(); // Evita que se envíe el formulario

    // Aquí puedes ejecutar tu código solo si todo es válido

    // -- RECOLECTA LOS DATOS -- \\
    const nombre = document.getElementById("nombre-registro").value;
    const apellidos = document.getElementById("apellidos-registro").value;
    const correo = document.getElementById("correo-registro").value;
    const genero = document.getElementById("genero-registro").value;
    const contrasena = document.getElementById("contrasena-registro").value;
    const contrasenaConf = document.getElementById("contrasenaConf-registro").value;

    let resultadoIgualdad;
    let datos_usuarios_registro = [];

    // -- VALIDAMOS QUE LA CONTRASEÑA COINCIDA -- \\
    if (contrasena === contrasenaConf) {
        resultadoIgualdad = "iguales"

        // Creamos un objeto que tiene los datos del registro 
        const datos = {
            nombre_registro: nombre,
            apellidos_registro: apellidos,
            correo_registro: correo,
            genero_registro: genero,
            contrasena_registro: contrasena
        }

        // Variable que mandará los datos al JSON
        let datosRegistroJSON;

        // -- VERIFICA SI EXISTE EL JSON EN EL LOCAL -- \\
        if (localStorage.getItem("DatosRegistro")) {
            // SI NO EXISTE LO CREA
            let datosRegistroGuardados = JSON.parse(localStorage.getItem("DatosRegistro")); // Genera el json
            datosRegistroGuardados.push(datos); // Al ser un array le ingresa el objeto con los datos
            datosRegistroJSON = JSON.stringify(datosRegistroGuardados);
            localStorage.setItem("DatosRegistro", datosRegistroJSON); // Sube el json al localstorage
        }else{
            // SI EXISTE LO TOMA Y SOBRE ESCRIBE
            datos_usuarios_registro.push(datos)
            datosRegistroJSON = JSON.stringify(datos_usuarios_registro);
            localStorage.setItem("DatosRegistro", datosRegistroJSON);
        }

        // -- POPUP DE REGISTRO EXISTOSO -- \\
        mostrarPopupRegistro(event);
    }
    else {
        resultadoIgualdad = "Diferentes"
        // -- POPUP DE CONTRASEÑAS INCORRECTAS -- \\
        mostrarPopupRegistroConInc(event);
    }
});


// -- POPUP REGISTRO EXITOSO -- \\
function mostrarPopupRegistro(event) {
    event.preventDefault();
    document.getElementById("popup-registro").style.display = "flex";
}

function cerrarPopupRegistro() {
    document.getElementById("popup-registro").style.display = "none";
    window.location.href = "/Login/login.html";
}

// -- POPUP CONTRASEÑA NO COINCIDE -- \\
function mostrarPopupRegistroConInc(event) {
    event.preventDefault();
    document.getElementById("popup-registro-Con-Inc").style.display = "flex";
}

function cerrarPopupRegistroConInc() {
    document.getElementById("popup-registro-Con-Inc").style.display = "none";
}


