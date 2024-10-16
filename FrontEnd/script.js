document.addEventListener("DOMContentLoaded", function () {

    // Variables
    const projectsUrl = 'http://localhost:5678/api/works';
    const categoriesUrl = 'http://localhost:5678/api/categories';
    let allProjects = [];
    
    // Fonction pour afficher les projets sur la page d'accueil
    function displayProjects() {
        const gallery = document.querySelector(".gallery");
        gallery.innerHTML = "";
        
        fetch(projectsUrl)
        .then(response => response.json())
        .then(works => {     
            allProjects = works;

            works.forEach(project => {
                
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
            });
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des projets", error);
        });
    }
    
    displayProjects();
    
    // Fonction pour générer les filtres de catégorie sur la page d'accueil (hors "Tous")
    async function categoryFilters() {
        fetch(categoriesUrl)
        .then(response => response.json())
        .then(categories => { 
            const uniqueCategoryFilter = new Set();   
            categories.forEach(category => {
                if (!uniqueCategoryFilter.has(category.name)) {
                    uniqueCategoryFilter.add(category.name);
                    
                    const categoryFilterButton = document.createElement('button');
                    categoryFilterButton.textContent = category.name;
                    categoryFilterButton.type = "submit";
                    categoryFilterButton.className = "filters";
                    categoryFilterButton.id = `filter${category.id}`;
                    categoryFilterButton.value = category.name;
                    
                    const categoryFilters = document.querySelector(".category-filters");
                    categoryFilters.appendChild(categoryFilterButton);   
                    
                    // Ajoute un événement au bouton de chaque catégorie créés via l'API
                    categoryFilterButton.addEventListener('click', () => {
                        activateFilter(categoryFilterButton);
                        filterProjectsByCategory(category.name);
                    });
                }
            })
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des catégories", error);
        });
    }
    
    categoryFilters();
    
    // Fonction pour ajouter sur le filtre la classe "filter_selected"
    function activateFilter(selectedFilter) {
        const allFilters = document.querySelectorAll(".category-filters .filters");
        allFilters.forEach(filter => {
            filter.classList.remove("filter_selected");
            selectedFilter.classList.add("filter_selected");
        });
    }

    // Fonction pour filtrer les projets selon la catégorie sélectionnée
    function filterProjectsByCategory(categoryName) {
        //if (categoryName === 'Tous') {
            //displayProjects(allProjects);
            //} else {
            let filteredProjects = allProjects.filter((project) => project.category.name === categoryName);
            console.log("Catégorie sélectionnée:", categoryName); 
            displayProjects(filteredProjects);
            console.log("Projets filtrés:", filteredProjects);
        //}
    }
    
    // Ajoute un événement au bouton "Tous"
    const filterAll = document.getElementById("filterAll");
    filterAll.addEventListener('click', () => {
        activateFilter(filterAll);
        console.log("Tous les projets:", allProjects);
    });  

});