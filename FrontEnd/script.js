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

})