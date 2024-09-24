document.addEventListener("DOMContentLoaded", function () {

    // Fonction pour afficher les projets sur la page d'accueil
    function displayProjects() {
        const gallery = document.querySelector(".gallery");
        fetch('http://localhost:5678/api/works', {
            method: 'GET',
        })    
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
        fetch('http://localhost:5678/api/categories')
        .then(response => response.json())
        .then(categories => { 
            const uniqueCategoryFilter = new Set();   

            for (let i = 0; i < categories.length; i++) {
                const category = categories[i];

                if (!uniqueCategoryFilter.has(category.name)) {
                    uniqueCategoryFilter.add(category.name);

                const categoryFilter = document.createElement("button");
                categoryFilter.textContent = category.name;
                categoryFilter.type = "submit";
                categoryFilter.className = "filters";
                categoryFilter.id = `filter${category.id}`;
                const filtersButtons = document.querySelector(".category-filters");
                filtersButtons.appendChild(categoryFilter);
                }
            }
        }) 
        .catch(error => {
            console.error("Erreur lors de la récupération des catégories", error);
        });
    }
    
    categoryFilters();
})