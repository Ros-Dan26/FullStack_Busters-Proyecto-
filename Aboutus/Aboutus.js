const integrantes = [
    {
        foto:"./fotosEquipo/Foto_JFCR.jpg",
        NombreCompleto:"Jesus Cruz",
        información:"Egresado de la Escuela Superior de Ingeniería en Computación (ESIME) del Instituto Politécnico Nacional (IPN).",
        biografia:"Soy un ingeniero en Computación con experiencia en desarrollo web, bases de datos y despliegue de aplicaciones. Apasionado por la tecnología y el aprendizaje continuo, además un entusiasta en el campo del audio.",
        rol:"Desarrollador FullStack"
    },
    {
        foto:"https://media.licdn.com/dms/image/v2/D5603AQFOwM5sn_1wxw/profile-displayphoto-scale_200_200/B56Zeoj8f7HUAc-/0/1750879685295?e=1756944000&v=beta&t=aZviqYodpUsnSxjXxhjTl4U4X0oTppt51cn0bs2QqUw",
        NombreCompleto:"Jesus Flores Temahuay",
        información:"Desarrollador de Software Jr.",
        biografia:"Ingeniero en Computación, apasionado por la tecnología y el aprendizaje continuo, con experiencia en desarrollo web, gestión de bases de datos y despliegue de sistemas en servidores.",
        rol:"Desarrollador FullStack"
    },
    {
        foto:"./fotosEquipo/Foto_Beca.jpeg",
        NombreCompleto:"Rebeca Martínez Sánchez",
        información:"Analista de datos Jr.",
        biografia:"Ingeniera Industrial egresada del Instituto Tecnológico de Querétaro, con experiencia en análisis de datos con herramientas como la Power Plataform de Microsoft, Excel (tablas dinámicas, formulas, macros y scripts), Python y MySQL Workbench. Apasionada por la tecnología y el aprendizaje continuo.",
        rol:"Desarrollador FullStack"

    }
    ,{
       foto:"https://media.licdn.com/dms/image/v2/D4D03AQEF3e6wwwG23g/profile-displayphoto-crop_800_800/B4DZeBbB8vH4AM-/0/1750223040886?e=1756944000&v=beta&t=a21-8qcmbjAJGqRHIaMQ9N-fncLp4tsxYxfGCylTAJI",
       NombreCompleto:"Jesús Benedicto Jiménez",
       información: "Desarrollador de Software Jr.",
       biografia: "Ingeniero en Sistemas Computacionales, motivado por la creación de soluciones digitales que generen impacto positivo",
       rol: "Desarrollador FullStack"
    },
        {
        foto:"./fotosEquipo/Foto_Daniel.jpg",
        NombreCompleto:"Daniel Arian Arias Rosales",
        informacion:"Desarrollador de Software Jr.",
        biografia:"Ingenierio en computación y desarrollador apasionado por la tecnologia en constante evolucion, buscando aprender cosas nuevas para innovar en el area-",
        rol:"Desarrollador FullStack"
    },
    {foto:"./fotosEquipo/BrandonHernandez.png",
        NombreCompleto:"Brandon Isaí Hernández Jiménez",
        información:"Desarrollador Java, Analista de datos",
        biografia:"Desarrollador Java Fullstack con experiencia en analisis de datos.",
        rol:"Desarrollador FullStack"
    },
    {foto:"./fotosEquipo/Foto_Alfredo.jpeg",
        NombreCompleto:"José Alfredo Pozos Briones",
        información:"Desarrollador Java",
        biografia:"desarrollador Fullstack Jr. con enfoque en Java, apasionado por el trabajo en equipo y con una fuerte orientación a la persistencia.",
        rol:"Desarrollador FullStack"
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