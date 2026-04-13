const API_BASE_URL = 'http://localhost:4100/api';

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
            emptyState.hidden = false;
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
        emptyState.hidden = true;
    }
}

function createClassCard(virtualClass) {
    const article = document.createElement('article');
    article.className = 'class-card';

    article.innerHTML = `
        <h3>${escapeHtml(virtualClass.name)}</h3>
        <p>${escapeHtml(virtualClass.description || 'Sin descripción')}</p>
        <p><strong>Código:</strong> ${escapeHtml(virtualClass.access_code)}</p>
    `;

    return article;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}