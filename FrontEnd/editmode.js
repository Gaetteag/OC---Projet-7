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

    // Fonction pour transformer le texte en "logout" quand l'utlisateur est connecté
    function transformLoginToLogout() {
        const authLink = document.getElementById('auth-link');
        if (token) {
            authLink.innerHTML = '<a href="index.html">logout</a>';

            authLink.addEventListener("click", function (event) {
                event.preventDefault();
                localStorage.removeItem('token');
                window.location.reload();
            });
        }
    }

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
    
        document.body.appendChild(modalSection);

        closeModal();
    }

    // Fonction pour ouvrir la modale
    function openModal() {
    const modalModifyButton = document.getElementById('modal-modify-button');
    modalModifyButton.addEventListener("click", () => {
        // Vérifier si la modale est déjà présente dans le DOM
        if (!document.querySelector('.modal-section')) {
            createModal();
        }
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
                imageProjectModal.setAttribute('data-id', work.id);

                const imageModalProject = document.createElement('img');
                imageModalProject.src = work.imageUrl;
                imageModalProject.classList.add('modal-gallery-image'); 

                const garbageModalIcon = document.createElement('i');
                garbageModalIcon.classList.add('fa-solid', 'fa-trash-can', 'modal-delete-icon'); 

                garbageModalIcon.addEventListener('click', () => {
                    deleteProject(work.id, imageProjectModal);
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
    function deleteProject(id, imageModalProject) {
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

        closeButton.addEventListener("click", () => {
            const modalSection = document.querySelector('.modal-section');
            if (modalSection) {
                modalSection.remove();
            }
        });

        document.body.addEventListener("click", (event) => {
            const modalSection = document.querySelector('.modal-section');
            if (event.target === modalSection) {
             modalSection.remove();
            }
        });
    }

});