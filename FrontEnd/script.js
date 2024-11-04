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
const main = document.querySelector('main'); 
const header = document.querySelector('header');
const modalSection = document.getElementById('modal-section');
    
function editMode() {
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

        // Fonction pour créer la balise aside qui contient la modale
        function createModalSection() {
            const createModalSection = document.createElement('section');
            createModalSection.classList.add('modal-section');
            createModalSection.id = 'modal-section';

            const modalWindow = document.createElement('article');
            modalWindow.classList.add('modal-window');
            modalWindow.id = 'modal-window';

            main.appendChild(createModalSection);
            createModalSection.appendChild(modalWindow)
        }

        // Fonction pour créer la modale initiale
        function galleryModal() {
        
            const modalWindow = document.getElementById('modal-window')

            const closeButton = document.createElement('i');
            closeButton.classList.add('fa-solid', 'fa-xmark');
            closeButton.id = 'modal-close-button';
        
            const modalTitle = document.createElement('h3');
            modalTitle.classList.add('modal-title');
            modalTitle.textContent = 'Galerie photo';
        
            const modalGallery = document.createElement('div');
            modalGallery.classList.add('modal-gallery');
        
            const addPhotoButton = document.createElement('button');
            addPhotoButton.classList.add('modal-button-add-photo');
            addPhotoButton.id = ('modal-button-add-photo');
            addPhotoButton.textContent = 'Ajouter une photo';
        
            modalWindow.appendChild(closeButton);
            modalWindow.appendChild(modalTitle);
            modalWindow.appendChild(modalGallery);
            modalWindow.appendChild(addPhotoButton);

            const modalSection = document.getElementById('modal-section');
            modalSection.appendChild(modalWindow);
        
            main.appendChild(modalSection);

            addPhotoButton.addEventListener('click', () => {
                addProjectModal();
            })

            closeModal('modal-close-button');
        }
        
        // Fonction pour ouvrir la modale
        function openModal() {
            const modalModifyButton = document.getElementById('modal-modify-button');            
            modalModifyButton.addEventListener("click", () => {
                createModalSection();
                galleryModal();            
                const modalSection = document.getElementById('modal-section');
                modalSection.style.display = 'flex';
                loadGalleryProjects();
            });
        }
        
        openModal();

        // Fonction pour charger les images de l'API dans la modale
        function loadGalleryProjects() {
            const modalGallery = document.querySelector('.modal-gallery');
            modalGallery.innerHTML = '';
                
            allWorks.forEach(work => {
    
                const projectModal = document.createElement('figure');
                projectModal.classList.add('modal-project-container');
                projectModal.value = work.id;
    
                const imageModalProject = document.createElement('img');
                imageModalProject.src = work.imageUrl;
                imageModalProject.classList.add('modal-gallery-image'); 
    
                const garbageModalIcon = document.createElement('i');
                garbageModalIcon.classList.add('fa-solid', 'fa-trash-can', 'modal-delete-icon'); 
    
                garbageModalIcon.addEventListener('click', () => {
                    deleteModalProject(work.id, projectModal);
                });
                    
                projectModal.appendChild(imageModalProject);
                projectModal.appendChild(garbageModalIcon);
    
                modalGallery.appendChild(projectModal);
            })
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
                    allWorks = allWorks.filter(work => work.id !== id);

                    const projectOnHomePage = document.querySelector(`figure[id="${id}"]`);
                    projectOnHomePage.remove();
                })   
                .catch(error => console.error("Erreur lors de la suppression de l'image :", error));
        }

        // Fonction pour afficher l'ajout de projets dans la modale
        function addProjectModal() {
            const modalWindow = document.getElementById('modal-window');
            modalWindow.innerHTML = '';

            const modalTopIcons = document.createElement('div');
            modalTopIcons.classList.add('modal-top-icons')

            const backButton = document.createElement('i');
            backButton.classList.add('fa-solid', 'fa-arrow-left');
            backButton.id = 'modal-back-button';

            backButton.addEventListener('click', () => {
                modalWindow.innerHTML = '';
                galleryModal();
                loadGalleryProjects();
            })

            const secondCloseButton = document.createElement('i');
            secondCloseButton.classList.add('fa-solid', 'fa-xmark');
            secondCloseButton.id = 'modal-close-button-2';

            const secondModalTitle = document.createElement('h3');
            secondModalTitle.classList.add('modal-title');
            secondModalTitle.textContent = 'Ajout photo';

            const uploadSectionWindow = document.createElement('div');
            uploadSectionWindow.classList.add('modal-upload-section-window');

            const uploadSection = document.createElement('div');
            uploadSection.classList.add('modal-upload-section');
            uploadSection.id = 'modal-upload-section';

            const imageUploadSection = document.createElement('i');
            imageUploadSection.classList.add('fa-regular', 'fa-image');
            imageUploadSection.id = 'modal-upload-section-image';

            const addPhotoUploadSection = document.createElement('button');
            addPhotoUploadSection.classList.add('modal-upload-section-button-add-photo');
            addPhotoUploadSection.textContent = '+ Ajouter photo';

            // Input de type file masqué associé au bouton addPhotoUploadSection pour déclencher l'ouverture de la boîte de dialogue
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.id = 'fileSelected';
            fileInput.style.display = 'none';

            addPhotoUploadSection.addEventListener('click', () => {
                fileInput.click();
            });
            
            let fileSelected = document.getElementById('fileSelected');

            fileInput.addEventListener('change', (event) => {
                fileSelected = event.target.files[0];
                    
                if ((fileSelected.type === 'image/jpeg' || fileSelected.type === 'image/png') && fileSelected.size <= 4 * 1024 * 1024) {
                const imgFileSelected = document.createElement('img');
                imgFileSelected.src = URL.createObjectURL(fileSelected);
                imgFileSelected.classList.add('img-file-selected')

                const uploadSection = document.getElementById('modal-upload-section');
                uploadSection.innerHTML = '';
                uploadSection.appendChild(imgFileSelected);
                } else {
                    const errorMessageFileSelected = document.createElement('p');
                    errorMessageFileSelected.classList.add('error-message-file-selected')
                    errorMessageFileSelected.textContent = 'Le fichier doit au format .jpg ou .png et être inférieur à 4 Mo';

                    uploadSection.appendChild(errorMessageFileSelected);
                }
            });

            const textUploadSection = document.createElement('p');
            textUploadSection.classList.add('modal-upload-section-text');
            textUploadSection.textContent = 'jpg, png : 4mo max';
                
            const formUploadSection = document.createElement('form');
            formUploadSection.id = 'modal-upload-section-form';

            const projectTitle = document.createElement('label')
            projectTitle.textContent = 'Titre';
            projectTitle.htmlFor = 'projectTitleArea'
            const projectTitleArea = document.createElement('input');
            projectTitleArea.type = 'text';
            projectTitleArea.name = 'title-new-project';
            projectTitleArea.id = 'projectTitleArea';

            const projectCategory = document.createElement('label')
            projectCategory.textContent = 'Catégorie';
            projectCategory.htmlFor = 'projectCategoryArea'
            const projectCategoryArea = document.createElement('select');
            const option = document.createElement('option');
            option.textContent = '';
            projectCategoryArea.name = 'category-new-project';
            projectCategoryArea.id = 'projectCategoryArea';

            // Appel de la fonction pour récupérer les catégories (ne fonctionne pas)
            fetch(categoriesUrl)
                .then(response => response.json())
                .then(categories => {
                    categories.forEach(category => {
                        const option = document.createElement('option');
                        option.value = category.id;
                        option.textContent = category.name;
                        projectCategoryArea.appendChild(option);
                    });
                })
                .catch(error => {
                    console.error("Erreur lors de la récupération des catégories :", error);
                });

            const validateButton = document.createElement('button');
            validateButton.classList.add('modal-upload-section-button-validate');
            validateButton.textContent = 'Valider';

            modalWindow.appendChild(modalTopIcons);
            modalTopIcons.appendChild(backButton);
            modalTopIcons.appendChild(secondCloseButton);
            modalWindow.appendChild(secondModalTitle);
            modalWindow.appendChild(uploadSectionWindow);
            uploadSectionWindow.appendChild(uploadSection)
            uploadSection.appendChild(imageUploadSection);
            uploadSection.appendChild(addPhotoUploadSection);
            uploadSection.appendChild(fileInput);
            uploadSection.appendChild(textUploadSection);
            uploadSectionWindow.appendChild(formUploadSection);
            formUploadSection.appendChild(projectTitle);
            formUploadSection.appendChild(projectTitleArea);
            formUploadSection.appendChild(projectCategory);
            formUploadSection.appendChild(projectCategoryArea);
            projectCategoryArea.appendChild(option)
            uploadSectionWindow.appendChild(validateButton);

            closeModal('modal-close-button-2');
        }

        // Fonction pour fermer la modale et retirer le conteneur du DOM
        function closeModal(closeModalButtonId) {
            const modalSection = document.getElementById('modal-section');
            const closeModalButton = document.getElementById(closeModalButtonId);
            
                closeModalButton.addEventListener("click", () => {
                    modalSection.remove();
                });
    
            main.addEventListener("click", (event) => {
                if (event.target === modalSection) {
                    modalSection.remove();
                }
            });
        }
    }
}

editMode();