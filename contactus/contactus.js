// Esperamos a que toda la página se haya cargado completamente
document.addEventListener('DOMContentLoaded', () => {
    // Obtenemos referencias al formulario y al botón de enviar
    const form = document.getElementById('demoForm');
    const button = document.getElementById('btnEnviar');

    // Cuando el usuario haga clic en el botón "Enviar el correo"
    button.addEventListener('click', function (event) {
        event.preventDefault(); // Evita que el formulario se envíe automáticamente

        // Verificamos si el formulario es válido antes de enviarlo
        if (validateForm()) {
            // Si es válido, obtenemos los valores de los campos
            const formData = {
                nombre: form.username.value,
                correo: form.usermail.value,
                celular: form.userphone.value,
                asunto: form.subject.value,
                mensaje: form.message.value,
            };

            // Enviamos los datos a través del servicio EmailJS
            emailjs.send("service_7yw8m9n", "template_g2k5dly", formData)
                .then(function (response) {
                    // Si el envío fue exitoso
                    //alert("Tu mensaje ha sido enviado correctamente");
                        window.location.href = "gracias.html"; // aquí puedes poner cualquier ruta
                    form.reset(); // Limpiamos los campos del formulario
                    clearValidation(); // Quitamos estilos de error si los había
                
                }, function (error) {
                    // Si hubo un error durante el envío
                    alert("Hubo un error al enviar el formulario.");
                    console.error("Error:", error); // Mostramos el error en la consola del navegador
                });
        } else {
            // Si la validación falla, avisamos al usuario
            //alert("Por favor completa todos los campos correctamente.");
            crearPopUpUniversal(); // POP UP 
        }
    });

    // Función que valida todos los campos requeridos del formulario
    function validateForm() {
        let isValid = true;

        // Seleccionamos todos los inputs y textareas que son obligatorios
        const fields = form.querySelectorAll('input[required], textarea[required]');

        fields.forEach(field => {
            const value = field.value.trim(); // Quitamos espacios en blanco al inicio y final
            const feedback = field.nextElementSibling; // Seleccionamos el mensaje de error justo después del campo

            // Limpiamos cualquier estilo de error anterior
            field.classList.remove('is-invalid');
            if (feedback && feedback.classList.contains('invalid-feedback')) {
                feedback.style.display = 'none'; // Ocultamos mensaje de error si estaba visible
            }

            // Validación general: campo vacío
            if (!value) {
                field.classList.add('is-invalid'); // Marcamos el campo como inválido visualmente
                if (feedback && feedback.classList.contains('invalid-feedback')) {
                    feedback.style.display = 'block'; // Mostramos mensaje de error
                }
                isValid = false; // Indicamos que el formulario no es válido
                return;
            }

            // Validación específica para correos electrónicos
            if (field.type === 'email' && !/^\S+@\S+\.\S+$/.test(value)) {
                field.classList.add('is-invalid');
                isValid = false;
                return;
            }

            // Validación específica para teléfonos (formato básico de México)
            if (field.type === 'tel' && !/^(\+?52)?\s?\d{2,3}\s?\d{4}\s?\d{4}$/.test(value)) {
                field.classList.add('is-invalid');
                isValid = false;
                return;
            }
        });

        return isValid; // Devuelve true si todo está correcto
    }

    // Función que limpia los estilos de validación cuando el formulario se reinicia
    function clearValidation() {
        const fields = form.querySelectorAll('input, textarea');
        fields.forEach(field => {
            field.classList.remove('is-invalid'); // Quitamos clase de error visual
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
                feedback.style.display = 'none'; // Ocultamos mensaje de error
            }
        });
    }
});


// -- POP UP -- \\
function crearPopUpUniversal(){
  const contenedor = document.getElementById('PopUp-Universal');

    contenedor.innerHTML = `
        <div class="popup-Diseño" id="popup-registro">
                <div class="popup-Diseño-Contenido">
                    <p><b> Por favor completa todos los campos correctamente. </b> </p>
                    <div><img src="/Pagina_registro/incorrecto.png"></div>
                    <button onclick="cerrarPopupUniversal()">Aceptar</button>
                </div>
        </div>
      `;
}

function cerrarPopupUniversal() {
    const contenedor = document.getElementById("PopUp-Universal");
    contenedor.innerHTML = '';
}