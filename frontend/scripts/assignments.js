// MOCK
const mockAssignments = [
    {
        id: 1,
        title: "Diseño del Modelo Entidad-Relación",
        dueDate: "2026-04-15T23:59:00",
        description: "Subir el diagrama en formato PDF."
    },
    {
        id: 2,
        title: "Lectura: Metodologías Ágiles",
        dueDate: "2026-04-05T12:00:00",
        description: "Control de lectura inicial."
    },
    {
        id: 3,
        title: "Configuración del entorno local",
        dueDate: "2026-04-10T23:59:00",
        description: "Captura de pantalla de Node y Supabase funcionando."
    }
];

/**
 * Estado
 * @param {string} dateString - Fecha de entrega
 * @returns {object}
 */
const getVisualStatus = (dateString) => {
    const dueDate = new Date(dateString);
    const currentDate = new Date();

    if (dueDate < currentDate) {
        return { class: 'overdue', text: 'Atrasada' };
    } else {
        return { class: 'pending', text: 'Pendiente' };
    }
};

/**
 * Formatea la fecha
 */
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
};

/**
 * Renderiza las tareas en el DOM
 */
const renderAssignments = (assignments) => {
    const container = document.getElementById('assignments-container');
    container.innerHTML = '';

    assignments.forEach(task => {
        const status = getVisualStatus(task.dueDate);
        
        const card = document.createElement('article');
        card.className = 'assignment-card';
        
        card.innerHTML = `
            <div class="assignment-info">
                <h3>${task.title}</h3>
                <p><strong>Entrega:</strong> ${formatDate(task.dueDate)}</p>
            </div>
            <div class="assignment-status">
                <span class="status-badge ${status.class}">
                    ${status.text}
                </span>
            </div>
        `;
        
        container.appendChild(card);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    const listContainer = document.getElementById('assignments-container');
    if (listContainer) {
        // TODO: reemplazar el mock con fetch() cuando la ruta GET esté lista
        renderAssignments(mockAssignments);
    }

    const createForm = document.getElementById('create-assignment-form');
    if (createForm) {
        createForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData();

            formData.append('class_id', document.getElementById('class-id').value);
            formData.append('title', document.getElementById('title').value);
            formData.append('description', document.getElementById('description').value);
            formData.append('max_score', document.getElementById('max-score').value);
            formData.append('due_date', document.getElementById('due-date').value);

            const fileInput = document.getElementById('attachment');
            if (fileInput.files.length > 0) {
                formData.append('attachment', fileInput.files[0]);
            }

            try {
                const response = await fetch('http://localhost:3000/api/assignments', {
                    method: 'POST',
                    body: formData 
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || 'Error al guardar en el servidor');
                }

                alert('¡Tarea publicada exitosamente y notificaciones enviadas!');
                window.location.href = './assignment-list.html'; 
                
            } catch (error) {
                console.error('Error de red o servidor:', error);
                alert('Hubo un problema al publicar la tarea: ' + error.message);
            }
        });
    }
});