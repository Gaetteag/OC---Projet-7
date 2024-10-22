document.addEventListener("DOMContentLoaded", function () {

    // Variables
    const worksUrl = 'http://localhost:5678/api/works';
    const categoriesUrl = 'http://localhost:5678/api/categories';
    let allWorks = [];
    
    // Fonction pour récupérer les projets sur l'API
    function getProjects() {
        fetch(worksUrl)
            .then(response => response.json())
            .then(works => {     
                allWorks = works;
                displayProjects(allWorks);
            })
            .catch(error => console.error("Erreur lors de la récupération des projets", error));           
    }
    
    // Fonction pour afficher les projets sur la page d'accueil
    function displayProjects(allWorks) {
        const gallery = document.querySelector(".gallery");
        gallery.innerHTML = "";
        
        allWorks.forEach(work => {
            const workFigure = document.createElement("figure");
            workFigure.id = work.id;
            
            const workImage = document.createElement("img");
            workImage.src = work.imageUrl;
            workImage.alt = work.title;
            workFigure.appendChild(workImage);
            
            const workTitle = document.createElement("figcaption");
            workTitle.textContent = work.title;
            workFigure.appendChild(workTitle);
            
            gallery.appendChild(workFigure);
        });
    }
    
    getProjects();

    // Fonction pour récupérer les catégories sur l'API
    function getCategories() {
        fetch(categoriesUrl)
            .then(response => response.json())
            .then(categories => {     
                createFilters(categories);
            })
            .catch(error => console.error("Erreur lors de la récupération des catégories", error));
    }

    // Fonction pour afficher les filtres de catégorie sur la page d'accueil (hors "Tous")
    function createFilters(categories) {
        const uniqueCategoryFilter = new Set();   
        categories.forEach(category => {
            if (!uniqueCategoryFilter.has(category.name)) {
                uniqueCategoryFilter.add(category.name);
                    
                const categoryFilterButton = document.createElement('button');
                categoryFilterButton.textContent = category.name;
                categoryFilterButton.type = "submit";
                categoryFilterButton.className = "filters";
                categoryFilterButton.id = category.id;
                    
                const categoryFilters = document.querySelector(".category-filters");
                categoryFilters.appendChild(categoryFilterButton);   
            }
        });

        // Ajouter / Supprimer sur les filtres la classe "filter_selected"
        const allFilters = document.querySelectorAll(".category-filters .filters");
        allFilters.forEach(filter => {
            filter.addEventListener('click', () => {
                allFilters.forEach(filterSelected => filterSelected.classList.remove("filter_selected"));
                filter.classList.add("filter_selected");

                // Filtrer les résultats selon le filtre sélectionné
                const categoryId = filter.id;
                if (categoryId === '0') {
                    displayProjects(allWorks);
                } else {
                    const filteredWorks = allWorks.filter(work => work.categoryId == categoryId)
                    displayProjects(filteredWorks);
                }
            })
        });
    }
    
    getCategories();

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Mode édition

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
    
            if (allWorks.length > 0) {
                
                allWorks.forEach(work => {
    
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
            }
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

                    const projectOnHomePage = document.querySelector(`figure[id="${id}"]`);
                    projectOnHomePage.remove();
                })   
                .catch(error => console.error("Erreur lors de la suppression de l'image :", error));
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