document.addEventListener("DOMContentLoaded", function () {

    // Variables
    const token = localStorage.getItem('token');
    const header = document.querySelector('header');
    const main = document.querySelector('main'); 
    
    if (token) {
        
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
        
        // Transformer le login en logout
        const authLink = document.getElementById('auth-link');
        authLink.innerHTML = '<a href="index.html">logout</a>';
        authLink.addEventListener("click", function (event) {
            event.preventDefault();
            localStorage.removeItem('token');
            window.location.reload();
        })

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

        // Fonction pour créer la modale
        function createModal() {
            const modalSection = document.createElement('aside');
            modalSection.id = 'modal-section';
            modalSection.classList.add('modal-section');
        
            const modalWindow = document.createElement('div');
            modalWindow.classList.add('modal-window');
        
            const closeButton = document.createElement('i');
            closeButton.classList.add('fa-solid', 'fa-xmark');
            closeButton.id = 'modal-close-button';
        
            const modalTitle = document.createElement('h3');
            modalTitle.id = 'modal-title';
            modalTitle.textContent = 'Galerie photo';
        
            const modalGallery = document.createElement('div');
            modalGallery.classList.add('modal-gallery');
        
            const addPhotoButton = document.createElement('button');
            addPhotoButton.classList.add('modal-button-add-photo');
            addPhotoButton.textContent = 'Ajouter une photo';
        
            modalWindow.appendChild(closeButton);
            modalWindow.appendChild(modalTitle);
            modalWindow.appendChild(modalGallery);
            modalWindow.appendChild(addPhotoButton);
            modalSection.appendChild(modalWindow);
        
            main.appendChild(modalSection);
    
            closeModal();
        }
        
        // Fonction pour ouvrir la modale
        function openModal() {
            const modalModifyButton = document.getElementById('modal-modify-button');
            modalModifyButton.addEventListener("click", () => {
                createModal();
                const modalSection = document.querySelector('.modal-section');
                modalSection.style.display = 'flex';
                loadGalleryProjects();
            });
        }
        
        openModal();

        // Fonction pour charger les images de l'API dans la modale
        function loadGalleryProjects() {
            const modalGallery = document.querySelector('.modal-gallery');
            modalGallery.innerHTML = '';
    
            fetch('http://localhost:5678/api/works')
            .then(response => response.json())
            .then(works => {
                
                works.forEach(work => {
    
                    const imageProjectModal = document.createElement('div');
                    imageProjectModal.classList.add('modal-project-container');
                    imageProjectModal.value = work.id;
    
                    const imageModalProject = document.createElement('img');
                    imageModalProject.src = work.imageUrl;
                    imageModalProject.classList.add('modal-gallery-image'); 
    
                    const garbageModalIcon = document.createElement('i');
                    garbageModalIcon.classList.add('fa-solid', 'fa-trash-can', 'modal-delete-icon'); 
    
                    garbageModalIcon.addEventListener('click', () => {
                        deleteModalProject(work.id, imageProjectModal);
                    });
                    
                    imageProjectModal.appendChild(imageModalProject);
                    imageProjectModal.appendChild(garbageModalIcon);
    
                    modalGallery.appendChild(imageProjectModal);
                })
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des images :', error);
            });
        }
    
        // Fonction pour supprimer une image d'un projet dans la modale
        function deleteModalProject(id, imageModalProject) {
            fetch(`http://localhost:5678/api/works/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
            .then(() => {
                    imageModalProject.remove();
                
            })
            .catch(error => {
                console.error("Erreur lors de la suppression de l'image :", error);
            });
        }
        
        // Fonction pour fermer la modale et retirer le conteneur du DOM
        function closeModal() {
            const closeButton = document.getElementById('modal-close-button');
            const modalSection = document.querySelector('.modal-section');
    
            closeButton.addEventListener("click", () => {
                modalSection.remove();
            });
    
            main.addEventListener("click", (event) => {
                if (event.target === modalSection) {
                    modalSection.remove();
                }
            });
        }
    }

});