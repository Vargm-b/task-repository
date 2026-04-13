const API_BASE_URL = 'http://localhost:4100/api';

document.addEventListener('DOMContentLoaded', () => {
    const createClassForm = document.getElementById('createClassForm');

    if (createClassForm) {
        createClassForm.addEventListener('submit', handleCreateClassSubmit);
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