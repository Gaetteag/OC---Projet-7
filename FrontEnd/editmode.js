document.addEventListener("DOMContentLoaded", function () {

    const token = localStorage.getItem('token');
    const header = document.querySelector('header');
    const portfolioSection = document.querySelector('#portfolio');
    const filtersButton = document.getElementById('category-filters');
    
    if (token) {
        // Afficher les éléments en mode édition si l'utilisateur est connecté
        transformLoginToLogout();

        // Créer la bannière du mode édition
        const editModeBanner = document.createElement('div');
        editModeBanner.classList.add('edit-mode-banner');
        editModeBanner.id = 'edit-mode-banner';

        const iconBanner = document.createElement('i');
        iconBanner.classList.add('fa-regular', 'fa-pen-to-square');
        editModeBanner.appendChild(iconBanner);

        const textBanner = document.createElement('span');
        textBanner.textContent = 'Mode édition';
        editModeBanner.appendChild(textBanner);
    
        header.insertBefore(editModeBanner, header.firstChild);

        // Créer le bouton modifier du mode édition
        const editModeButton = document.createElement('div');
        editModeButton.classList.add('edit-mode-project');
        editModeButton.id = 'edit-mode-project';

        const modifyLink = document.createElement('a');
        modifyLink.href = '#modal-section';
        modifyLink.id = 'modal-modify-button';

        const iconModify = document.createElement('i');
        iconModify.classList.add('fa-regular', 'fa-pen-to-square');
        modifyLink.appendChild(iconModify);

        const textModify = document.createElement('span');
        textModify.textContent = 'modifier';
        modifyLink.appendChild(textModify);

        editModeButton.appendChild(modifyLink);

        portfolioSection.insertBefore(editModeButton, portfolioSection.children[1]);

        // Retirer les boutons de filtre de l'affichage
        filtersButton.classList.add('remove-filters-button')
    }

    function transformLoginToLogout() {
        const authLink = document.getElementById('auth-link');
        if (token) {
            authLink.innerHTML = '<a href="#">logout</a>';

            authLink.addEventListener("click", function (event) {
                localStorage.removeItem('token');
                window.location.reload();
            });
        }
    }

});