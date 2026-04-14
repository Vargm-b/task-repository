const API_BASE_URL = 'http://localhost:3000/api';

// Sprint 1: sin auth, usamos un estudiante fijo de prueba
const STUDENT_ID = '00000000-0000-0000-0000-000000000002';

document.addEventListener('DOMContentLoaded', () => {
    const joinForm = document.getElementById('joinClassForm');
    if (joinForm) {
        joinForm.addEventListener('submit', handleJoinClassSubmit);
    }
});

async function handleJoinClassSubmit(event) {
    event.preventDefault();

    const accessCodeInput = document.getElementById('accessCode');
    const errorBox = document.getElementById('joinError');
    const successBox = document.getElementById('joinSuccess');
    const submitButton = event.submitter || event.currentTarget.querySelector('button[type="submit"]');

    hideFeedback(errorBox, successBox);

    const accessCode = accessCodeInput.value.trim().toUpperCase();

    if (!accessCode) {
        showError(errorBox, 'Ingresa un código de acceso.');
        accessCodeInput.focus();
        return;
    }

    submitButton.disabled = true;
    const originalText = submitButton.innerText;
    submitButton.innerText = 'Uniéndose...';

    try {
        const response = await fetch(`${API_BASE_URL}/enrollments/join`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                access_code: accessCode,
                student_id: STUDENT_ID
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'No se pudo procesar la inscripción.');
        }

        showSuccess(successBox);
        accessCodeInput.value = '';
    } catch (error) {
        console.error('Error al unirse a la clase:', error);
        showError(errorBox, error.message);
    } finally {
        submitButton.disabled = false;
        submitButton.innerText = originalText;
    }
}

function hideFeedback(errorBox, successBox) {
    if (errorBox) errorBox.classList.add('hidden');
    if (successBox) successBox.classList.add('hidden');
}

function showError(errorBox, message) {
    if (!errorBox) return;
    const messageNode = errorBox.querySelector('p');
    if (messageNode && message) {
        messageNode.textContent = message;
    }
    errorBox.classList.remove('hidden');
}

function showSuccess(successBox) {
    if (successBox) successBox.classList.remove('hidden');
}
