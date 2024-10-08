document.addEventListener("DOMContentLoaded", function () {

    const token = localStorage.getItem('token');

    function transformLoginToLogout() {
        const authLink = document.getElementById('auth-link');
        if (token) {
            authLink.innerHTML = '<a href="#">logout</a>';

            authLink.addEventListener("click", function (event) {
                localStorage.removeItem('token');
                window.location.reload();
            });
        }
    }

    transformLoginToLogout();

});