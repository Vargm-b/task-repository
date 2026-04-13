const API_BASE_URL = 'http://localhost:4100/api';

const HEADER_IMAGES = [
    '../assets/headers/header-1.jpg',
    '../assets/headers/header-2.jpg',
    '../assets/headers/header-3.jpg',
    '../assets/headers/header-4.jpg',
    '../assets/headers/header-5.jpg'
];

document.addEventListener('DOMContentLoaded', () => {
    const createClassForm = document.getElementById('createClassForm');
    const classGrid = document.getElementById('classGrid');

    if (createClassForm) {
        createClassForm.addEventListener('submit', handleCreateClassSubmit);
    }

    if (classGrid) {
        loadClasses();
    }
});

async function handleCreateClassSubmit(event) {
    event.preventDefault();

    const nameInput = document.getElementById('className');
    const descriptionInput = document.getElementById('classDescription');

    const name = nameInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!name) {
        alert('El nombre de la clase es obligatorio.');
        nameInput.focus();
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/classes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                description
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'No se pudo crear la clase.');
        }

        alert(`Clase creada con éxito. Código de acceso: ${data.access_code}`);
        event.target.reset();
        window.location.href = './class-dashboard.html';
    } catch (error) {
        console.error('Error al crear clase:', error);
        alert(error.message || 'Ocurrió un error al crear la clase.');
    }
}

async function loadClasses() {
    const classGrid = document.getElementById('classGrid');
    const emptyState = document.getElementById('emptyState');

    try {
        const response = await fetch(`${API_BASE_URL}/classes`);
        const classes = await response.json();

        if (!response.ok) {
            throw new Error(classes.error || 'No se pudieron cargar las clases.');
        }

        classGrid.innerHTML = '';

        if (!classes.length) {
            if (emptyState) {
                emptyState.hidden = false;
            }
            return;
        }

        if (emptyState) {
            emptyState.hidden = true;
        }

        classes.forEach((virtualClass) => {
            const card = createClassCard(virtualClass);
            classGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Error al cargar clases:', error);
        classGrid.innerHTML = '<p>No se pudieron cargar las clases.</p>';

        if (emptyState) {
            emptyState.hidden = true;
        }
    }
}

function getHeaderImageByClassId(classId) {
    let total = 0;

    for (let i = 0; i < classId.length; i++) {
        total += classId.charCodeAt(i);
    }

    const index = total % HEADER_IMAGES.length;
    return HEADER_IMAGES[index];
}

function createClassCard(virtualClass) {
    const article = document.createElement('article');
    article.className = 'class-card';

    const headerImage = getHeaderImageByClassId(virtualClass.id);

    article.innerHTML = `
        <a href="./assignment-list.html?class_id=${encodeURIComponent(virtualClass.id)}&course=${encodeURIComponent(virtualClass.name)}" class="class-card-link">
            <div class="class-card-header">
                <img src="${headerImage}" alt="Portada de la clase">
            </div>
            <div class="class-card-body">
                <h3 class="class-card-title">${escapeHtml(virtualClass.name)}</h3>
                <p class="class-card-description">${escapeHtml(virtualClass.description || 'Sin descripción')}</p>
                <p class="class-card-code"><strong>Código:</strong> ${escapeHtml(virtualClass.access_code)}</p>
            </div>
        </a>
    `;

    return article;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}