const openClassModalButton = document.getElementById("openClassModal");
const closeClassModalButton = document.getElementById("closeClassModal");
const classModal = document.getElementById("classModal");
const modalActionButtons = document.querySelectorAll(".modal-action-button");

function openClassModal() {
    if (!classModal) return;
    classModal.hidden = false;
}

function closeClassModal() {
    if (!classModal) return;
    classModal.hidden = true;
}

if (openClassModalButton) {
    openClassModalButton.addEventListener("click", openClassModal);
}

if (closeClassModalButton) {
    closeClassModalButton.addEventListener("click", closeClassModal);
}

if (classModal) {
    classModal.addEventListener("click", (event) => {
        if (event.target === classModal) {
            closeClassModal();
        }
    });
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && classModal && !classModal.hidden) {
        closeClassModal();
    }
});

modalActionButtons.forEach((button) => {
    button.addEventListener("click", () => {
        closeClassModal();
    });
});