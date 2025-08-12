document.getElementById('enviar-registro').addEventListener('submit', function (event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre-registro").value.trim();
    const apellidoPaterno = document.getElementById("apellidoP-registro").value.trim();
    const apellidoMaterno = document.getElementById("apellidoM-registro").value.trim();
    const correo = document.getElementById("correo-registro").value.trim();
    const telefonoFijo = document.getElementById("telefono-fijo-registro").value.trim();
    const telefonoMovil = document.getElementById("telefono-movil-registro").value.trim();
    const generoTexto = document.getElementById("genero-registro").value;
    const contrasena = document.getElementById("contrasena-registro").value;
    const contrasenaConf = document.getElementById("contrasenaConf-registro").value;

    // Validar campos obligatorios simples
    if (!nombre || !apellidoPaterno || !apellidoMaterno || !correo || !contrasena || !contrasenaConf) {
        alert("Por favor complete todos los campos obligatorios.");
        return;
    }

    // Validar al menos un teléfono
    if (!telefonoFijo && !telefonoMovil) {
        alert("Debe ingresar al menos un teléfono (fijo o móvil).");
        return;
    }

    // Validar longitud teléfono
    if (telefonoFijo && telefonoFijo.length > 12) {
        alert("Teléfono fijo demasiado largo.");
        return;
    }
    if (telefonoMovil && telefonoMovil.length > 12) {
        alert("Teléfono móvil demasiado largo.");
        return;
    }

    // Validar contraseñas iguales
    if (contrasena !== contrasenaConf) {
        mostrarPopupRegistroConInc(event);
        return;
    }

    // Mapear género a ID según ejemplo (1, 2, 3)
    let generoId = null;
    if (generoTexto === "Hombre") generoId = 1;
    else if (generoTexto === "Mujer") generoId = 2;
    else if (generoTexto === "No binario") generoId = 3;

    if (!generoId) {
        alert("Por favor, seleccione un género válido.");
        return;
    }

    // Construir nickname y truncar a 50 caracteres
    let nickname = (nombre + apellidoPaterno).replace(/\s+/g, '').substring(0, 50);

    // Payload a enviar (siguiendo tu ejemplo "gendersId")
    const payload = {
        gendersId: generoId,
        firstName: nombre,
        lastName: apellidoPaterno,
        middleName: apellidoMaterno,
        preferences: "ND",
        email: correo,
        phone: telefonoFijo || null,
        mobile: telefonoMovil || null,
        nickname: nickname,
        password: contrasena
    };

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(payload),
        redirect: "follow"
    };

    fetch("http://jft314.ddns.net:8080/nso/api/v1/nso/user/save", requestOptions)
        .then(response => {
            if (!response.ok) throw new Error("Error en el registro");
            // El ejemplo hace .text(), pero si el backend envía JSON, se puede hacer json()
            return response.text();
        })
        .then(result => {
            console.log("Registro exitoso:", result);
            mostrarPopupRegistro(event);
        })
        .catch(error => {
            console.error("Error al registrar:", error);
            alert("Hubo un problema al registrar el usuario");
        });
});

// Mostrar popup de éxito
function mostrarPopupRegistro(event) {
    event.preventDefault();
    document.getElementById("popup-registro").style.display = "flex";
}

// Cerrar popup de éxito y redirigir a login
function cerrarPopupRegistro() {
    document.getElementById("popup-registro").style.display = "none";
    window.location.href = "/Login/login.html";
}

// Mostrar popup si las contraseñas no coinciden
function mostrarPopupRegistroConInc(event) {
    event.preventDefault();
    document.getElementById("popup-registro-Con-Inc").style.display = "flex";
}

// Cerrar popup de error contraseña
function cerrarPopupRegistroConInc() {
    document.getElementById("popup-registro-Con-Inc").style.display = "none";
}
