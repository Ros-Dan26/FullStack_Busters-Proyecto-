const integrantes = [
    {
        foto: "https://avatars.githubusercontent.com/u/212970403?v=4",
        NombreCompleto: "Jesus Cruz",
        información: "Egresado de la Escuela Superior de Ingeniería en Computación (ESIME) del Instituto Politécnico Nacional (IPN).",
        biografia: "Soy un ingeniero en Computación con experiencia en desarrollo web, bases de datos y despliegue de aplicaciones. Apasionado por la tecnología y el aprendizaje continuo, además un entusiasta en el campo del audio.",
        rol: "Desarrollador FullStack"
    },
    {
        foto: "https://media.licdn.com/dms/image/v2/D5603AQFOwM5sn_1wxw/profile-displayphoto-scale_200_200/B56Zeoj8f7HUAc-/0/1750879685295?e=1756944000&v=beta&t=aZviqYodpUsnSxjXxhjTl4U4X0oTppt51cn0bs2QqUw",
        NombreCompleto: "Jesus Flores Temahuay",
        información: "Desarrollador de Software Jr.",
        biografia: "Ingeniero en Computación, apasionado por la tecnología y el aprendizaje continuo, con experiencia en desarrollo web, gestión de bases de datos y despliegue de sistemas en servidores.",
        rol: "Desarrollador FullStack"
    }
];

function renderizarIntegrantes() {
    const contenedor = document.getElementById('contenedor-dinamico');
    
    // Verificar si el contenedor existe
    if (!contenedor) {
        console.error('No se encontró el contenedor con ID "contenedor-dinamico"');
        return;
    }

    contenedor.innerHTML = ''; // Limpiar contenedor

    integrantes.forEach(integrante => {
        // Crear elemento de tarjeta
        const card = document.createElement('div');
        card.className = 'col mb-4'; // Usar el sistema de grid de Bootstrap
        
        // Construir el HTML de la tarjeta
        card.innerHTML = `
            <div class="card h-100">
                <img src="${integrante.foto}" class="card-img-top" alt="${integrante.NombreCompleto}" style="height: 300px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${integrante.NombreCompleto}</h5>
                    <p class="card-text text-muted">${integrante.información}</p>
                    <p class="card-text">${integrante.biografia}</p>
                    <div class="mt-auto">
                        <span class="badge bg-primary">${integrante.rol}</span>
                    </div>
                </div>
            </div>
        `;

        // Agregar tarjeta al contenedor
        contenedor.appendChild(card);
    });
}

// Llamar a la función cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', renderizarIntegrantes);