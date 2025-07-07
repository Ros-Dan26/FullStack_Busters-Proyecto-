document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('demoForm');

    form.addEventListener('click', function (event) {
        event.preventDefault();

        if (validateForm()) {
            alert('Formulario enviado correctamente. Nos pondremos en contacto contigo pronto.');
            form.reset();
            clearValidation();
        }
    });

    function validateForm() {
        let isValid = true;
        const fields = form.querySelectorAll('input[required], textarea[required]');

        fields.forEach(field => {
            const value = field.value.trim();
            const feedback = field.nextElementSibling;

            // Reset estado
            field.classList.remove('is-invalid');

            // Validación general
            if (!value) {
                field.classList.add('is-invalid');
                isValid = false;
                return;
            }

            // Validación de email
            if (field.type === 'email' && !/^\S+@\S+\.\S+$/.test(value)) {
                field.classList.add('is-invalid');
                isValid = false;
                return;
            }

            // Validación de teléfono básico (para México)
            if (field.type === 'tel' && !/^(\+?52)?\s?\d{2,3}\s?\d{4}\s?\d{4}$/.test(value)) {
                field.classList.add('is-invalid');
                isValid = false;
                return;
            }
        });

        return isValid;
    }

    function clearValidation() {
        const fields = form.querySelectorAll('input, textarea');
        fields.forEach(field => field.classList.remove('is-invalid'));
    }
});
