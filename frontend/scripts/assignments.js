const assignmentList = document.getElementById("assignment-list");
const emptyState = document.getElementById("assignment-empty-state");

const API_ASSIGNMENTS_URL = "http://localhost:4100/api/assignments";
const API_CLASSES_URL = "http://localhost:4100/api/classes";

/**
 * bd -> frontend
 */
function normalizeAssignments(assignments) {
    return assignments.map(a => ({
        id: a.id,
        title: a.title,
        description: a.description,
        maxScore: a.max_score,
        dueDate: a.due_date
    }));
}

/**
 * calcula estado de la tarea
 */
function getStatus(dateString) {
    const now = new Date();
    const due = new Date(dateString);

    if (due < now) return { class: "overdue", text: "ATRASADA" };
    return { class: "pending", text: "PENDIENTE" };
}

/**
 * formatea fecha
 */
function formatDueDate(dateString) {
    return new Date(dateString).toLocaleString("es-BO", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });
}

/**
 * diseño de las cards
 */
function createAssignmentCard(assignment) {
    const article = document.createElement("article");
    article.className = "assignment-card";
    article.setAttribute("tabindex", "0");

    const status = getStatus(assignment.dueDate);

    article.innerHTML = `
        <section class="assignment-card-main">
            <h3 class="assignment-card-title">${assignment.title}</h3>

            <p class="assignment-card-subtitle">
                Fecha de entrega: ${formatDueDate(assignment.dueDate)}
                -
                <span class="assignment-card-status ${status.class}">
                    ${status.text}
                </span>
            </p>
        </section>

        <span class="assignment-card-arrow" aria-hidden="true">›</span>
    `;

    article.addEventListener("click", () => {
        window.location.href = `./assignment-detail.html?id=${assignment.id}`;
    });

    article.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            window.location.href = `./assignment-detail.html?id=${assignment.id}`;
        }
    });

    return article;
}

/**
 * Renderiza las tareas
 */
function renderAssignments(assignments) {
    if (!assignmentList || !emptyState) return;

    assignmentList.innerHTML = "";

    if (!assignments.length) {
        emptyState.hidden = false;
        assignmentList.appendChild(emptyState);
        return;
    }

    emptyState.hidden = true;

    assignments.forEach(a => {
        assignmentList.appendChild(createAssignmentCard(a));
    });
}

/**
 * Carga las tareas desde la API y las renderiza
 */
async function loadAssignments() {
    if (!assignmentList) return;

    try {
        const response = await fetch(API_ASSIGNMENTS_URL);

        if (!response.ok) {
            throw new Error("Error al cargar tareas");
        }

        const data = await response.json();
        const normalized = normalizeAssignments(data);

        renderAssignments(normalized);
    } catch (error) {
        console.error("Error al cargar tareas:", error);
        assignmentList.innerHTML =
            '<p class="empty-state">No se pudieron cargar las tareas.</p>';
    }
}

/**
 * Carga clases en el select del formulario
 */
async function loadClassesIntoSelect() {
    const classSelect = document.getElementById("class-id");
    if (!classSelect) return;

    try {
        const response = await fetch(API_CLASSES_URL);

        if (!response.ok) {
            throw new Error("No se pudieron cargar las clases");
        }

        const classes = await response.json();

        classSelect.innerHTML = '<option value="" disabled selected>Seleccione una clase</option>';

        classes.forEach((virtualClass) => {
            const option = document.createElement("option");
            option.value = virtualClass.id;
            option.textContent = virtualClass.name;
            classSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar clases en el select:", error);
    }
}

/**
 * Maneja el envío del formulario de crear tarea
 */
async function handleCreateAssignmentSubmit(e) {
    e.preventDefault();

    const createForm = e.currentTarget;
    const publishBtn = e.submitter || createForm.querySelector("button[type='submit']");
    publishBtn.disabled = true;

    const originalText = publishBtn.innerText;
    publishBtn.innerText = "Publicando...";

    const selectedClassId = document.getElementById("class-id").value;

    const formData = new FormData();
    formData.append("class_id", selectedClassId);
    formData.append("title", document.getElementById("title").value);
    formData.append("description", document.getElementById("description").value);
    formData.append("max_score", document.getElementById("max-score").value);
    formData.append("due_date", document.getElementById("due-date").value);

    const fileInput = document.getElementById("attachment");
    if (fileInput.files.length > 0) {
        formData.append("attachment", fileInput.files[0]);
    }

    try {
        const response = await fetch(API_ASSIGNMENTS_URL, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || "Error al guardar en el servidor");
        }

        alert("¡Tarea publicada exitosamente y notificaciones enviadas!");
        window.location.href = "./assignment-list.html";
    } catch (error) {
        console.error("Error de red o servidor:", error);
        alert("Hubo un problema al publicar la tarea: " + error.message);

        publishBtn.disabled = false;
        publishBtn.innerText = originalText;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadAssignments();
    loadClassesIntoSelect();

    const createForm = document.getElementById("create-assignment-form");
    if (createForm) {
        createForm.addEventListener("submit", handleCreateAssignmentSubmit);
    }
});