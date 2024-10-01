document.addEventListener("DOMContentLoaded", function () {

    // Variables
    const projectsUrl = 'http://localhost:5678/api/works';
    const categoriesUrl = 'http://localhost:5678/api/categories';

    // Fonction pour afficher les projets sur la page d'accueil
    function displayProjects() {
        const gallery = document.querySelector(".gallery");
        gallery.innerHTML = "";
        fetch(projectsUrl)    
        .then(response => response.json())
        .then(works => {     
            for (let i = 0; i < works.length; i++) {
                const project = works[i];
            
                // Crée l'affichage des projets
                const projectFigure = document.createElement("figure");
                projectFigure.id = project.id;
                const projectImage = document.createElement("img");
                projectImage.src = project.imageUrl;
                projectImage.alt = project.title;
                projectFigure.appendChild(projectImage);
                const projectTitle = document.createElement("figcaption");
                projectTitle.textContent = project.title;
                projectFigure.appendChild(projectTitle);
                gallery.appendChild(projectFigure);
                }
            })
        .catch(error => {
            console.error("Erreur lors de la récupération des projets", error);
        })
    }

    displayProjects();
    
    // Fonction pour générer les filtres de catégorie sur la page d'accueil (hors "Tous")
    function categoryFilters() {
        fetch(categoriesUrl)
        .then(response => response.json())
        .then(categories => { 
            const uniqueCategoryFilter = new Set();   
            
            for (let i = 0; i < categories.length; i++) {
                const category = categories[i];
                
                if (!uniqueCategoryFilter.has(category.name)) {
                    uniqueCategoryFilter.add(category.name);
                    
                    const categoryFilterButton = document.createElement("button");
                    categoryFilterButton.textContent = category.name;
                    categoryFilterButton.type = "submit";
                    categoryFilterButton.className = "filters";
                    categoryFilterButton.id = `filter${category.id}`;
                    const categoryFilters = document.querySelector(".category-filters");
                    categoryFilters.appendChild(categoryFilterButton);

                    // Ajoute un événement au bouton de chaque catégorie créés via l'API
                    categoryFilterButton.addEventListener('click', () => {
                        activateFilter(categoryFilterButton);
                        filterProjectsByCategory(category.name);
                    });
                }
            }
            // Ajoute un événement au bouton "Tous"
            const filterAll = document.getElementById("filterAll");
            filterAll.addEventListener('click', () => {
                activateFilter(filterAll);
                displayProjects()
            });
        }) 
        .catch(error => {
            console.error("Erreur lors de la récupération des catégories", error);
        });
    }
    
    categoryFilters();
    
    // Fonction pour filtrer les projets selon la catégorie sélectionnée
    function filterProjectsByCategory(categoryName) {
        fetch(projectsUrl)
        .then(response => response.json())
        .then(works => {
            const filteredProjects = works.filter(work => work.category.name === categoryName);
            displayProjects(filteredProjects);
        })
        .catch(error => console.error("Erreur lors du filtrage des projets", error));
    }

    // Fonction pour mettre en surbrillance le filtre actif
    function activateFilter(selectedFilter) {
        const allFilters = document.querySelectorAll(".category-filters .filters");
        for (let i = 0; i < allFilters.length; i++) {
            if (allFilters[i] === selectedFilter) {
                allFilters[i].classList.add("filter_selected");
            } else {
                allFilters[i].classList.remove("filter_selected");
            }
        }
    }
});