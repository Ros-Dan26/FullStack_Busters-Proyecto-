const integrantes = [
    {
        foto:"/fotosEquipo/Foto_JFCR.webp",
        NombreCompleto:"Jesus Cruz",
        información:"Egresado de la Escuela Superior de Ingeniería en Computación (ESIME) del Instituto Politécnico Nacional (IPN).",
        biografia:"Ingeniero en Computación con experiencia en desarrollo web, bases de datos y despliegue de aplicaciones. Apasionado por la tecnología y el aprendizaje continuo, además un entusiasta en el campo del audio.",
        rol:"Desarrollador FullStack"
    },
    {
        foto:"/fotosEquipo/Jesus Flores Temahuay.webp",
        NombreCompleto:"Jesus Flores Temahuay",
        información:"Desarrollador de Software Jr.",
        biografia:"Ingeniero en Computación, apasionado por la tecnología y el aprendizaje continuo, con experiencia en desarrollo web, gestión de bases de datos y despliegue de sistemas en servidores.",
        rol:"Desarrollador FullStack"
    },
    {
        foto:"/fotosEquipo/Foto_Beca.webp",
        NombreCompleto:"Rebeca Martínez Sánchez",
        información:"Analista de datos Jr.",
        biografia:"Ingeniera Industrial egresada del Instituto Tecnológico de Querétaro, con experiencia en análisis de datos con herramientas como la Power Plataform de Microsoft, Excel (tablas dinámicas, formulas, macros y scripts), Python y MySQL Workbench. Apasionada por la tecnología y el aprendizaje continuo.",
        rol:"Desarrollador FullStack"

    }
    ,{
        foto:"/fotosEquipo/Jesus Benedicto Jimenez Martinez.webp",
        NombreCompleto:"Jesús Benedicto Jiménez Martínez",
        información: "Desarrollador de Software Jr.",
        biografia: "Ingeniero en Sistemas Computacionales, motivado por la creación de soluciones digitales, que generen impacto positivo.",
        rol: "Desarrollador FullStack"
    },
        {
        foto:"/fotosEquipo/Foto_Daniel.webp",
        NombreCompleto:"Daniel Arian Arias Rosales",
        información:"Desarrollador de Software Jr.",
        biografia:"Ingenierio en computación y desarrollador apasionado por la tecnologia en constante evolucion, buscando aprender cosas nuevas para innovar en el area-",
        rol:"Desarrollador FullStack"
    },
    {foto:"/fotosEquipo/BrandonHernandez.webp",
        NombreCompleto:"Brandon Isaí Hernández Jiménez",
        información:"Desarrollador Java, Analista de datos",
        biografia:"Desarrollador Java Fullstack con experiencia en analisis de datos.",
        rol:"Desarrollador FullStack"
    },
    {foto:"/fotosEquipo/Foto_Alfredo.webp",
        NombreCompleto:"José Alfredo Pozos Briones",
        información:"Desarrollador Java",
        biografia:"desarrollador Fullstack Jr. con enfoque en Java, apasionado por el trabajo en equipo y con una fuerte orientación a la persistencia.",
        rol:"Desarrollador FullStack"
    }   
        ];

function renderizarIntegrantes() {
    const contenedor = document.getElementById('contenedor-dinamico');
    
    if (!contenedor) {
        console.error('Contenedor no encontrado');
        return;
    }

    contenedor.innerHTML = integrantes.map(integrante => `
        <div class="team-card">
            <div class="team-card-img-container">
                <img src="${integrante.foto}" class="team-card-img" alt="${integrante.NombreCompleto}">
            </div>
            <div class="team-card-body">
                <h3 class="team-card-name">${integrante.NombreCompleto}</h3>
                <p class="team-card-info">${integrante.información}</p>
                <p class="team-card-bio">${integrante.biografia}</p>
                <span class="team-card-role">${integrante.rol}</span>
            </div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', renderizarIntegrantes);


