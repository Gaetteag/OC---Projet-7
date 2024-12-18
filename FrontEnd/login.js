const loginForm = document.querySelector("form");
const connectionButton = document.getElementById('connection-btn');
let connectionErrorMessage;

connectionButton.addEventListener('click', (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const emailRegex = /[a-z0-9._-]+@[a-z0-9._-]+\.[a-z0-9._-]/;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        connectionError("Veuillez renseigner un e-mail et un mot de passe");
    } else if (!emailRegex.test(email)) {
        connectionError("Veuillez entrer une adresse e-mail valide");
    } else {
        const data = { email: email, password: password };

    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(connection => {
            if (connection.token) {
                localStorage.setItem('token', connection.token);                    
                // Redirige vers la page d'accueil après connexion réussie
                window.location.href = "index.html";
            } else {
                // Affiche un message d'erreur si l'authentification échoue
                connectionError("Erreur dans l’identifiant ou le mot de passe");
            }
        })
    }
});

function connectionError(errorMessage) {
    if (!connectionErrorMessage) {
        // Crée un nouvel élément pour le message d'erreur
        connectionErrorMessage = document.createElement("p");
        connectionErrorMessage.id = "connection-error-message";

        // Insère l'élément au dessus du formulaire
        loginForm.prepend(connectionErrorMessage);
    }
    // Crée le texte du message d'erreur
    connectionErrorMessage.textContent = errorMessage;
}