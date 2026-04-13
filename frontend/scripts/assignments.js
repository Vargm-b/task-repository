const API_BASE_URL = 'http://localhost:3000/api';
const DEFAULT_CLASS_ID = '2e0c5648-fcb2-4417-9309-c4f57f82f5a5';
const DEFAULT_CLASS_NAME = 'Sistemas de Informacion II';
const DEFAULT_STUDENT_ID = '00000000-0000-0000-0000-000000000002';
const USE_LOCAL_PREVIEW = false;

const previewAssignments = [
    {
        id: 'preview-1',
        class_id: DEFAULT_CLASS_ID,
        class_name: DEFAULT_CLASS_NAME,
        title: 'Diseno del Modelo Entidad-Relacion',
        description: 'Subir el diagrama en PDF con su explicacion.',
        max_score: 100,
        due_date: '2026-04-15T23:59:00'
    },
    {
        id: 'preview-2',
        class_id: DEFAULT_CLASS_ID,
        class_name: DEFAULT_CLASS_NAME,
        title: 'Lectura: Metodologias Agiles',
        description: 'Responder el control de lectura de la unidad 1.',
        max_score: 50,
        due_date: '2026-04-18T19:00:00'
    }
];

function getQueryParam(key) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
}

function getStoredValue(key) {
    try {
        return window.localStorage.getItem(key);
    } catch (error) {
        console.warn(`No se pudo leer localStorage para ${key}:`, error);
        return null;
    }
}

function setStoredValue(key, value) {
    if (!value) {
        return;
    }

    try {
        window.localStorage.setItem(key, value);
    } catch (error) {
        console.warn(`No se pudo guardar localStorage para ${key}:`, error);
    }
}

function getActiveClassId() {
    return getQueryParam('class_id') || getStoredValue('selectedClassId') || DEFAULT_CLASS_ID;
}

function getActiveClassName() {
    return getQueryParam('course') || getStoredValue('selectedClassName') || DEFAULT_CLASS_NAME;
}

function getActiveStudentId() {
    return getQueryParam('student_id') || getStoredValue('studentId') || DEFAULT_STUDENT_ID;
}

function normalizeAssignment(record, fallback = {}) {
    return {
        id: record.id || fallback.id || '',
        title: record.title || fallback.title || 'Sin titulo',
        description: record.description || fallback.description || 'Sin descripcion disponible.',
        dueDate: record.due_date || record.dueDate || fallback.dueDate || '',
        maxScore: record.max_score || record.maxScore || fallback.maxScore || null,
        classId: record.class_id || record.classId || fallback.classId || getActiveClassId(),
        className:
            record.class_name ||
            record.className ||
            record.course_name ||
            record.courseName ||
            fallback.className ||
            getActiveClassName(),
        attachmentName: record.attachment_name || record.attachmentName || null
    };
}

function normalizeAssignmentList(payload) {
    if (Array.isArray(payload)) {
        return payload.map((record) => normalizeAssignment(record));
    }

    if (Array.isArray(payload.assignments)) {
        return payload.assignments.map((record) => normalizeAssignment(record));
    }

    return [];
}

function getPreviewAssignments() {
    return previewAssignments.map((assignment) => normalizeAssignment(assignment));
}

function getPreviewAssignmentDetail(assignmentId) {
    const previewAssignment =
        previewAssignments.find((assignment) => assignment.id === assignmentId) || previewAssignments[0];

    return normalizeAssignment(previewAssignment);
}

function getVisualStatus(dateString) {
    const dueDate = new Date(dateString);

    if (!dateString || Number.isNaN(dueDate.getTime())) {
        return { class: 'pending', text: 'Sin fecha' };
    }

    if (dueDate < new Date()) {
        return { class: 'overdue', text: 'Atrasada' };
    }

    return { class: 'pending', text: 'Pendiente' };
}

function formatDate(dateString) {
    const dueDate = new Date(dateString);

    if (!dateString || Number.isNaN(dueDate.getTime())) {
        return 'Fecha no disponible';
    }

    return dueDate.toLocaleString('es-BO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

async function parseJsonSafely(response) {
    const text = await response.text();

    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch (error) {
        console.warn('La respuesta no era JSON valido:', error);
        return null;
    }
}

async function fetchFromCandidates(candidates, { expectArray = false } = {}) {
    let lastError = null;

    for (const candidate of candidates) {
        try {
            const response = await fetch(candidate.url, candidate.options);
            const data = await parseJsonSafely(response);

            if (!response.ok) {
                const error = new Error(data?.error || candidate.errorMessage);
                error.status = response.status;
                throw error;
            }

            if (expectArray) {
                const normalizedList = normalizeAssignmentList(data);

                if (normalizedList.length || Array.isArray(data)) {
                    return normalizedList;
                }

                throw new Error('La respuesta no devolvio una lista de tareas.');
            }

            if (typeof candidate.validate === 'function' && !candidate.validate(data)) {
                throw new Error(candidate.errorMessage);
            }

            return data;
        } catch (error) {
            lastError = error;
        }
    }

    throw lastError || new Error('No se pudo completar la solicitud.');
}

function navigateToAssignmentDetail(assignment) {
    const params = new URLSearchParams({ id: assignment.id });

    if (assignment.classId) {
        params.set('class_id', assignment.classId);
        setStoredValue('selectedClassId', assignment.classId);
    }

    if (assignment.className) {
        params.set('course', assignment.className);
        setStoredValue('selectedClassName', assignment.className);
    }

    const studentId = getActiveStudentId();
    if (studentId) {
        params.set('student_id', studentId);
        setStoredValue('studentId', studentId);
    }

    window.location.href = `./assignment-detail.html?${params.toString()}`;
}

function createAssignmentCard(assignment) {
    const article = document.createElement('article');
    article.className = 'assignment-card';
    article.setAttribute('tabindex', '0');

    const status = getVisualStatus(assignment.dueDate);

    article.innerHTML = `
        <section class="assignment-card-main">
            <h3 class="assignment-card-title">${assignment.title}</h3>
            <p class="assignment-card-subtitle">
                Fecha de entrega: ${formatDate(assignment.dueDate)}
                -
                <span class="assignment-card-status ${status.class}">
                    ${status.text}
                </span>
            </p>
        </section>
        <span class="assignment-card-arrow" aria-hidden="true">›</span>
    `;


    article.addEventListener('click', () => navigateToAssignmentDetail(assignment));
    article.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            navigateToAssignmentDetail(assignment);
        }
    });

    return article;
}

function renderAssignments(assignments) {
    const container = document.getElementById('assignment-list');
    const emptyState = document.getElementById('assignment-empty-state');

    if (!container || !emptyState) {
        return;
    }

    container.innerHTML = '';

    if (!assignments.length) {
        emptyState.hidden = false;
        container.appendChild(emptyState);
        return;
    }

    emptyState.hidden = true;
    assignments.forEach((assignment) => {
        container.appendChild(createAssignmentCard(assignment));
    });
}

function renderAssignmentListError(message) {
    const container = document.getElementById('assignment-list');

    if (!container) {
        return;
    }

    container.innerHTML = `<p class="empty-state">${message}</p>`;
}

async function loadAssignments() {
    const listContainer = document.getElementById('assignment-list');

    if (!listContainer) {
        return;
    }

    const classId = getActiveClassId();
    const studentId = getActiveStudentId();

    setStoredValue('selectedClassId', classId);
    setStoredValue('studentId', studentId);

    if (USE_LOCAL_PREVIEW) {
        renderAssignments(getPreviewAssignments());
        return;
    }

    const candidates = [
        {
            url: `${API_BASE_URL}/assignments?class_id=${encodeURIComponent(classId)}`,
            errorMessage: 'No se pudo cargar la lista de tareas.'
        },
        {
            url: `${API_BASE_URL}/assignments/${encodeURIComponent(classId)}`,
            errorMessage: 'No se pudo cargar la lista de tareas.'
        },
        {
            url: `${API_BASE_URL}/assignments`,
            errorMessage: 'No se pudo cargar la lista de tareas.'
        }
    ];

    try {
        const assignments = await fetchFromCandidates(candidates, { expectArray: true });
        renderAssignments(assignments);
    } catch (error) {
        console.error('Error al cargar tareas:', error);
        renderAssignments(getPreviewAssignments());
    }
}

function setAssignmentDetailError(message) {
    const errorBox = document.getElementById('assignmentError');
    const detailCard = document.getElementById('assignmentDetailCard');
    const errorText = errorBox ? errorBox.querySelector('p') : null;

    if (errorText) {
        errorText.textContent = message;
    }

    if (detailCard) {
        detailCard.hidden = true;
    }

    if (errorBox) {
        errorBox.hidden = false;
    }
}

function renderAssignmentDetail(assignment) {
    const title = document.getElementById('assignment-detail-title');
    const course = document.getElementById('assignmentCourse');
    const description = document.getElementById('assignmentDescription');
    const dueDate = document.getElementById('assignmentDueDate');
    const detailCard = document.getElementById('assignmentDetailCard');
    const errorBox = document.getElementById('assignmentError');

    if (!title || !course || !description || !dueDate) {
        return;
    }

    title.textContent = assignment.title;
    course.textContent = assignment.className || 'Clase seleccionada';
    description.textContent = assignment.description;
    dueDate.textContent = formatDate(assignment.dueDate);

    if (detailCard) {
        detailCard.hidden = false;
    }

    if (errorBox) {
        errorBox.hidden = true;
    }
}

async function loadAssignmentDetail() {
    const courseLabel = document.getElementById('assignmentCourse');

    if (!courseLabel) {
        return;
    }

    const assignmentId = getQueryParam('id') || getQueryParam('assignment_id');

    if (!assignmentId) {
        if (USE_LOCAL_PREVIEW) {
            renderAssignmentDetail(getPreviewAssignmentDetail());
            return;
        }

        setAssignmentDetailError('No se encontro el identificador de la tarea.');
        return;
    }

    const studentId = getActiveStudentId();
    const queryCourseName = getActiveClassName();

    const candidates = [
        {
            url: `${API_BASE_URL}/assignments/${encodeURIComponent(assignmentId)}`,
            errorMessage: 'No se pudo cargar el detalle de la tarea.',
            validate: (data) => Boolean(data && !Array.isArray(data) && data.id)
        },
        {
            url: `${API_BASE_URL}/assignments/detail/${encodeURIComponent(assignmentId)}?student_id=${encodeURIComponent(studentId)}`,
            errorMessage: 'No se pudo cargar el detalle de la tarea.',
            validate: (data) => Boolean(data && !Array.isArray(data) && data.id)
        }
    ];

    if (USE_LOCAL_PREVIEW) {
        renderAssignmentDetail(getPreviewAssignmentDetail(assignmentId));
        return;
    }

    try {
        const payload = await fetchFromCandidates(candidates);
        const assignment = normalizeAssignment(payload, {
            classId: getQueryParam('class_id') || getStoredValue('selectedClassId') || '',
            className: queryCourseName
        });

        if (assignment.classId) {
            setStoredValue('selectedClassId', assignment.classId);
        }

        if (assignment.className) {
            setStoredValue('selectedClassName', assignment.className);
        }

        renderAssignmentDetail(assignment);
    } catch (error) {
        console.error('Error al cargar detalle:', error);
        renderAssignmentDetail(getPreviewAssignmentDetail(assignmentId));
    }
}

function hydrateClassSelect() {
    const classSelect = document.getElementById('class-id');

    if (!classSelect || classSelect.options.length > 1) {
        return;
    }

    const classId = getActiveClassId();
    const className = getActiveClassName();
    const option = document.createElement('option');

    option.value = classId;
    option.textContent = className;
    option.selected = true;

    classSelect.appendChild(option);
}

function setupCreateAssignmentForm() {
    const createForm = document.getElementById('create-assignment-form');

    if (!createForm) {
        return;
    }

    hydrateClassSelect();

    createForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const publishButton =
            event.submitter || createForm.querySelector('button[type="submit"]');

        publishButton.disabled = true;
        const originalText = publishButton.innerText;
        publishButton.innerText = 'Publicando...';

        const selectedClass = document.getElementById('class-id');
        const formData = new FormData();

        formData.append('class_id', selectedClass.value);
        formData.append('title', document.getElementById('title').value);
        formData.append('description', document.getElementById('description').value);
        formData.append('max_score', document.getElementById('max-score').value);
        formData.append('due_date', document.getElementById('due-date').value);

        const fileInput = document.getElementById('attachment');
        if (fileInput.files.length > 0) {
            formData.append('attachment', fileInput.files[0]);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/assignments`, {
                method: 'POST',
                body: formData
            });
            const data = await parseJsonSafely(response);

            if (!response.ok) {
                throw new Error(data?.error || 'Error al guardar en el servidor');
            }

            const selectedClassName =
                selectedClass.options[selectedClass.selectedIndex]?.textContent || getActiveClassName();

            setStoredValue('selectedClassId', selectedClass.value);
            setStoredValue('selectedClassName', selectedClassName);

            alert('Tarea publicada exitosamente.');
            window.location.href =
                `./assignment-list.html?class_id=${encodeURIComponent(selectedClass.value)}` +
                `&course=${encodeURIComponent(selectedClassName)}`;
        } catch (error) {
            console.error('Error de red o servidor:', error);
            alert(`Hubo un problema al publicar la tarea: ${error.message}`);
            publishButton.disabled = false;
            publishButton.innerText = originalText;
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadAssignments();
    loadAssignmentDetail();
    setupCreateAssignmentForm();
});
