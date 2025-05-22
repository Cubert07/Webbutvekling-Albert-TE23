document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.querySelector('.dropdown-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    toggleButton.addEventListener('click', () => {
        dropdownMenu.classList.toggle('active');
    });
});