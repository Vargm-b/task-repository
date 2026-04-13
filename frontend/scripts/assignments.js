const API_URL = 'http://localhost:3000/api/assignments';
const USE_LOCAL_PREVIEW = true; 

const previewAssignments = [
    { id: 1, title: "Diseño del Modelo Entidad-Relación", description: "Subir el diagrama en PDF", max_score: 100, due_date: "2026-04-15T23:59:00" },
    { id: 2, title: "Lectura: Metodologías Ágiles", description: "Control de lectura", max_score: 50, due_date: "2026-04-05T12:00:00" }
];

function normalizeAssignments(assignments) {
    return assignments.map(a => ({
        id: a.id,
        title: a.title,
        description: a.description,
        maxScore: a.max_score,
        dueDate: a.due_date || a.dueDate
    }));
}

function getStatus(dateString) {
    const now = new Date();
    const due = new Date(dateString);
    if (due < now) return { class: 'overdue', text: 'ATRASADA' };
    return { class: 'pending', text: 'PENDIENTE' };
}

function formatDueDate(dateString) {
    return new Date(dateString).toLocaleString('es-BO', {
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false
    });
}

function createAssignmentCard(assignment) {
    const article = document.createElement('article');
    article.className = 'assignment-card';
    article.setAttribute('tabindex', '0');

    const status = getStatus(assignment.dueDate);

    article.innerHTML = `
        <section class="assignment-card-main">
            <h3 class="assignment-card-title">${assignment.title}</h3>
            <p class="assignment-card-subtitle">
                Fecha de entrega: ${formatDueDate(assignment.dueDate)} -
                <span class="assignment-card-status ${status.class}">
                    ${status.text}
                </span>
            </p>
        </section>
        <span class="assignment-card-arrow" aria-hidden="true">›</span>
    `;

    article.addEventListener('click', () => window.location.href = `./assignment-detail.html?id=${assignment.id}`);
    article.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.location.href = `./assignment-detail.html?id=${assignment.id}`;
        }
    });

    return article;
}

function renderList(assignments, container, emptyState) {
    if (!assignments.length) {
        if (emptyState) {
            emptyState.hidden = false;
            container.appendChild(emptyState);
        }
        return;
    }
    if (emptyState) emptyState.hidden = true;
    assignments.forEach(a => container.appendChild(createAssignmentCard(a)));
}

async function loadAssignments() {
    const assignmentList = document.getElementById('assignment-list');
    const emptyState = document.getElementById('assignment-empty-state');
    
    if (!assignmentList) return; 

    assignmentList.innerHTML = '';

    if (USE_LOCAL_PREVIEW) {
        renderList(normalizeAssignments(previewAssignments), assignmentList, emptyState);
        return;
    }

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const classId = urlParams.get('class_id');

        if (!classId) {
            throw new Error('No se especificó ninguna clase.');
        }

        const response = await fetch(`${API_URL}?class_id=${classId}`);
        
        if (response.status === 403 || response.status === 401) {
            throw new Error('Acceso denegado: No estás inscrito en esta clase.');
        }
        if (!response.ok) {
            throw new Error('Error al cargar las tareas del servidor.');
        }
        
        const data = await response.json();
        renderList(normalizeAssignments(data), assignmentList, emptyState);
        
    } catch (error) {
        console.error(error);
        assignmentList.innerHTML = `<p class="empty-state">${error.message}</p>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadAssignments();

    const createForm = document.getElementById('create-assignment-form');
    if (createForm) {
        createForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const publishBtn = e.submitter || createForm.querySelector('button[type="submit"]');
            publishBtn.disabled = true;
            const originalText = publishBtn.innerText;
            publishBtn.innerText = 'Publicando...';

            const formData = new FormData(createForm);

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    body: formData 
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || 'Error al guardar');
                }

                alert('¡Tarea publicada exitosamente!');
                window.location.href = './assignment-list.html'; 
                
            } catch (error) {
                console.error('Error:', error);
                alert('Hubo un problema: ' + error.message);
                publishBtn.disabled = false;
                publishBtn.innerText = originalText;
            }
        });
    }
});