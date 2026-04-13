// T11.5: Mostrar clases del docente en el panel principal
const API_BASE = 'http://localhost:3000/api';

// Sprint 1: sin sistema de auth, usamos localStorage con fallback hardcodeado
const TEACHER_ID = '2e0c5648-fcb2-4417-9309-c4f57f82f5a5'; //docente de prueba, debe existir en la base de datos

const HEADERS = [
    '../assets/headers/header-1.jpg',
    '../assets/headers/header-2.jpg',
    '../assets/headers/header-3.jpg',
    '../assets/headers/header-4.jpg',
    '../assets/headers/header-5.jpg',
];

function getRandomHeader() {
    return HEADERS[Math.floor(Math.random() * HEADERS.length)];
}

//modiificar esta función para que reciba un objeto de clase y renderice su información
function renderClassCard(cls) {
    return `
        <article class="class-card">
            <a href="./assignment-list.html?class_id=${cls.id}&course=${encodeURIComponent(cls.name)}" 
               class="class-card-link">
                <img src="${getRandomHeader()}" 
                     alt="Portada de clase" 
                     class="class-card-header-img">
                <section class="class-card-body">
                    <h3 class="class-card-title">${cls.name}</h3>
                    <p class="class-card-description">
                        ${cls.description || 'Sin descripción'}
                    </p>
                    <p class="class-card-code">
                        Código: <strong>${cls.access_code}</strong>
                    </p>
                </section>
            </a>
        </article>
    `;
}

async function loadTeacherClasses() {
    const classGrid = document.getElementById('classGrid');
    const emptyState = document.getElementById('emptyState');
    if (!classGrid) return;

    try {
        const response = await fetch(`${API_BASE}/classes/teacher/${TEACHER_ID}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const classes = await response.json();

        if (!Array.isArray(classes) || classes.length === 0) {
            emptyState.hidden = false;
            return;
        }

        emptyState.hidden = true;
        classGrid.innerHTML = classes.map(renderClassCard).join('');

    } catch (error) {
        console.error('Error al cargar clases del docente:', error.message);
        emptyState.hidden = false;
    }
}

document.addEventListener('DOMContentLoaded', loadTeacherClasses);
console.log('classes.js cargado, TEACHER_ID:', TEACHER_ID);//borrar esta línea después de verificar que el ID se carga correctamente