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
    // TODO: fetch().
    renderAssignments(mockAssignments);
});