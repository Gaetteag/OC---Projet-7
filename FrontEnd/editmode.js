document.addEventListener("DOMContentLoaded", function () {

    const token = localStorage.getItem('token');
    
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
        
        const header = document.querySelector('header');    
        header.insertBefore(editModeBanner, header.firstChild);
        
        // Créer le bouton modifier du mode édition
        const editModeButton = document.createElement('div');
        editModeButton.classList.add('edit-mode-project');
        editModeButton.id = 'edit-mode-project';
        
        const iconModify = document.createElement('i');
        iconModify.classList.add('fa-regular', 'fa-pen-to-square');
        
        const modifyButton = document.createElement('a');
        modifyButton.href = '#modal-section';
        modifyButton.id = 'modal-modify-button';        
        modifyButton.appendChild(iconModify);
        
        const textModify = document.createElement('span');
        textModify.textContent = 'modifier';
        modifyButton.appendChild(textModify);
        
        editModeButton.appendChild(modifyButton);
        
        const portfolioSection = document.querySelector('#portfolio');
        portfolioSection.insertBefore(editModeButton, portfolioSection.children[1]);
        
        // Retirer les boutons de filtre de l'affichage
        const filtersButton = document.getElementById('category-filters');
        filtersButton.classList.add('remove-filters-button')

        // Ajouter un espace supplémentaire en haut de page
        header.classList.add('spaceBannerEditMode')

        // Ajouter un espace supplémentaire entre "Mes Projets" et l'affichage des projets
        const editModeGallery = document.getElementById('gallery');
        editModeGallery.classList.add('edit-mode-gallery')
    }

    function transformLoginToLogout() {
        const authLink = document.getElementById('auth-link');
        if (token) {
            authLink.innerHTML = '<a href="index.html">logout</a>';

            authLink.addEventListener("click", function (event) {
                localStorage.removeItem('token');
                window.location.reload();
            });
        }
    }

});