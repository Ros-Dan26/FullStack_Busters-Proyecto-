/**
 * ===========================
 *  aboutus.js
 * ===========================
 * Este archivo gestiona la lógica para mostrar dinámicamente el equipo de desarrollo
 * en la página "Sobre Nosotros" del proyecto Net-Shopping Online.
 * 
 * FUNCIONALIDADES PRINCIPALES:
 * - Define el array 'integrantes' con los datos de cada miembro del equipo.
 * - Renderiza tarjetas (cards) de cada integrante en el DOM.
 * - Al hacer clic en una tarjeta, muestra un modal con información detallada.
 * - Inserta dinámicamente los enlaces a LinkedIn y portafolio en el modal.
 * 
 * DEPENDENCIAS:
 * - Bootstrap 5 (para el modal y estilos)
 * - aboutus.html debe tener un <div id="contenedor-dinamico"> y un modal con los IDs requeridos.
 * - aboutus.css para los estilos visuales.
 */

/**
 * Array de objetos con la información de cada integrante del equipo.
 * Cada objeto contiene:
 * - foto: Ruta de la imagen del integrante.
 * - NombreCompleto: Nombre completo.
 * - información: Breve descripción profesional.
 * - biografia: Descripción extendida.
 * - rol: Rol principal en el proyecto.
 * - linkedin: URL al perfil de LinkedIn.
 * - portafolio: URL al portafolio personal.
 */
const integrantes = [
    {
        foto: "/fotosEquipo/Foto_JFCR.webp",
        NombreCompleto: "Jesus Cruz",
        información: "Egresado de la Escuela Superior de Ingeniería en Computación (ESIME) del Instituto Politécnico Nacional (IPN).",
        biografia: "Ingeniero en Computación con experiencia en desarrollo web, bases de datos y despliegue de aplicaciones. Apasionado por la tecnología y el aprendizaje continuo, además un entusiasta en el campo del audio.",
        rol: "Desarrollador FullStack",
        linkedin:"http://www.linkedin.com/in/ing-jesús-fco-cruz",
        portafolio:"https://jesusfranciscocruz.github.io/"
    },
    {
        foto: "/fotosEquipo/Jesus Flores Temahuay.webp",
        NombreCompleto: "Jesus Flores Temahuay",
        información: "Desarrollador de Software Jr.",
        biografia: "Ingeniero en Computación, apasionado por la tecnología y el aprendizaje continuo, con experiencia en desarrollo web, gestión de bases de datos y despliegue de sistemas en servidores.",
        rol: "Desarrollador FullStack",
        linkedin:"https://www.linkedin.com/in/jesus-flores-temahuay/",
        portafolio:"http://jft314.ddns.net"
    },
    {
        foto: "/fotosEquipo/Foto_Beca.webp",
        NombreCompleto: "Rebeca Martínez Sánchez",
        información: "Analista de datos Jr.",
        biografia: "Ingeniera Industrial egresada del Instituto Tecnológico de Querétaro, con experiencia en análisis de datos con herramientas como la Power Plataform de Microsoft, Excel (tablas dinámicas, formulas, macros y scripts), Python y MySQL Workbench. Apasionada por la tecnología y el aprendizaje continuo.",
        rol: "Desarrollador FullStack",
        linkedin:"",
        portafolio:""

    }
    , {
        foto: "/fotosEquipo/Jesus Benedicto Jimenez Martinez.webp",
        NombreCompleto: "Jesús Benedicto Jiménez Martínez",
        información: "Desarrollador de Software Jr.",
        biografia: "Ingeniero en Sistemas Computacionales, motivado por la creación de soluciones digitales, que generen impacto positivo.",
        rol: "Desarrollador FullStack",
        linkedin:"http://www.linkedin.com/in/jesús-bene",
        portafolio:"https://jesusbenedictojm.github.io/"
    },
    {
        foto: "/fotosEquipo/Foto_Daniel.webp",
        NombreCompleto: "Daniel Arian Arias Rosales",
        información: "Desarrollador de Software Jr.",
        biografia: "Ingenierio en computación y desarrollador apasionado por la tecnologia en constante evolucion, buscando aprender cosas nuevas para innovar en el area-",
        rol: "Desarrollador FullStack",
        linkedin:"https://www.linkedin.com/in/daniel-arian-arias-rosales?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
        portafolio:"https://ros-dan26.github.io/index.html"
    },
    {
        foto: "/fotosEquipo/BrandonHernandez.webp",
        NombreCompleto: "Brandon Isaí Hernández Jiménez",
        información: "Desarrollador Java, Analista de datos",
        biografia: "Desarrollador Java Fullstack con experiencia en analisis de datos.",
        rol: "Desarrollador FullStack",
        linkedin:"http://www.linkedin.com/in/brandonhernandez09",
        portafolio:"https://brandonher14.github.io/"
    },
    {
        foto: "/fotosEquipo/Foto_Alfredo.webp",
        NombreCompleto: "José Alfredo Pozos Briones",
        información: "Desarrollador Fullstack Jr",
        biografia: "Ingeniero Electrónico con enfoque en Java, apasionado por el trabajo en equipo y con una fuerte orientación a la persistencia.",
        rol: "Desarrollador FullStack",
        linkedin:"http://www.linkedin.com/in/josepozos99japb",
        portafolio:"https://alfredox11.github.io/githubalfredox11/"
    }
];

/**
 * renderizarIntegrantes()
 * -----------------------
 * Renderiza las tarjetas de los integrantes dentro del contenedor #contenedor-dinamico.
 * Asigna eventos de clic a cada tarjeta para mostrar el modal con la información correspondiente.
 * Si el modal no existe en el DOM, lo crea dinámicamente (fallback para compatibilidad).
 */
function renderizarIntegrantes() {
    const contenedor = document.getElementById('contenedor-dinamico');
    if (!contenedor) return;

    // Genera el HTML de todas las tarjetas de integrantes
    contenedor.innerHTML = integrantes.map((integrante, idx) => `
        <div class="team-card" data-idx="${idx}" style="cursor:pointer;">
            <div class="team-card-img-container mb-2">
                <img src="${integrante.foto}" class="team-card-img" alt="${integrante.NombreCompleto}">
            </div>
            <div class="team-card-body text-center pt-0">
                <h3 class="team-card-name mb-1">${integrante.NombreCompleto}</h3>
                <span class="team-card-role mb-2 d-block">${integrante.rol}</span>
            </div>
        </div>
    `).join('');

    // Asigna el evento clic a cada tarjeta para abrir el modal con los datos del integrante
    document.querySelectorAll('.team-card').forEach(card => {
        card.addEventListener('click', function () {
            const i = Number(this.getAttribute('data-idx'));
            mostrarModalIntegrante(integrantes[i]);
        });
    });

    // Fallback: Si el modal no existe en el DOM, lo crea (para compatibilidad)
    if (!document.getElementById('modalIntegrante')) {
        const modalHTML = `
        <div class="modal fade" id="modalIntegrante" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content p-3 text-center">
                <img id="modalFoto" src="" alt="" class="rounded mb-3" style="width:120px;height:120px;object-fit:cover;">
                <h4 id="modalNombre" class="mb-1"></h4>
                <div id="modalPuesto" class="mb-2"></div>
                <div id="modalInfo" class="mb-3 text-secondary"></div>
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
}

/**
 * mostrarModalIntegrante(integrante)
 * ----------------------------------
 * Recibe un objeto integrante y actualiza el contenido del modal con su información.
 * Muestra el modal usando Bootstrap.
 * 
 * @param {Object} integrante - Objeto con los datos del integrante seleccionado.
 */
function mostrarModalIntegrante(integrante) {
    document.getElementById('modalFoto').src = integrante.foto;
    document.getElementById('modalFoto').alt = integrante.NombreCompleto;
    document.getElementById('modalNombre').textContent = integrante.NombreCompleto;
    //document.getElementById('modalPuesto').textContent = integrante.rol; // Descomentar si se quiere mostrar el rol
    document.getElementById('modalInfo').textContent = `${integrante.información || ''}\n${integrante.biografia || ''}`;

    // Inserta los íconos de LinkedIn y portafolio (si existen)
    const modalIcons = document.getElementById('modalIcons');
    modalIcons.innerHTML = `
        <a href="${integrante.linkedin}" target="_blank" aria-label="LinkedIn" style="margin-right: 1.2rem;">
            <img src="/fotosEquipo/linkedin.svg" alt="LinkedIn" style="width:38px;height:38px;vertical-align:middle;">
        </a>
        <a href="${integrante.portafolio}" target="_blank" aria-label="Portafolio">
            <img src="/fotosEquipo/portafolio.svg" alt="Portafolio" style="width:38px;height:38px;vertical-align:middle;">
        </a>
    `;

    // Muestra el modal usando Bootstrap 5
    const modal = new bootstrap.Modal(document.getElementById('modalIntegrante'));
    modal.show();
}

// Inicializa la renderización de integrantes cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', renderizarIntegrantes);


