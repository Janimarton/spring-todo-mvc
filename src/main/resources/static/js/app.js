const view = new View();

new Controller(view);

window.addEventListener('load', function () {
    var idToken;
    var accessToken;
    var expiresAt;

    var webAuth = new auth0.WebAuth({
        domain: 'dev-z0dmp7by.eu.auth0.com',
        clientID: '6HEqlEHjmIIO15uf4zAU1q6HWpMOiloI',
        responseType: 'token id_token',
        audience: 'https://springtodo/api',
        scope: 'openid read:admin',
        redirectUri: window.location.href
    });

    var loginStatus = document.querySelector('.container h4');
    var loginView = document.getElementById('login-view');
    var homeView = document.getElementById('home-view');

    var homeViewBtn = document.getElementById('btn-home-view');
    var loginBtn = document.getElementById('btn-login');
    var logoutBtn = document.getElementById('btn-logout');

    loginBtn.addEventListener('click', function (e) {
        e.preventDefault();
        webAuth.authorize();
    });

    logoutBtn.addEventListener('click', logout);

    function handleAuthentication() {
        webAuth.parseHash(function (err, authResult) {
            if (authResult && authResult.accessToken && authResult.idToken) {
                window.location.hash = '';
                localLogin(authResult);
                loginBtn.style.display = 'none';
                homeView.style.display = 'inline-block';
            } else if (err) {
                homeView.style.display = 'inline-block';
                console.log(err);
                alert(
                    'Error: ' + err.error + '. Check the console for further details.'
                );
            }
            displayButtons();
        });
    }

    function localLogin(authResult) {
        // Set isLoggedIn flag in localStorage
        localStorage.setItem('isLoggedIn', 'true');
        // Set the time that the access token will expire at
        expiresAt = JSON.stringify(
            authResult.expiresIn * 1000 + new Date().getTime()
        );
        accessToken = authResult.accessToken;
        localStorage.setItem("accessToken", accessToken);
        idToken = authResult.idToken;
        location.reload();
    }

    function renewTokens() {
        webAuth.checkSession({}, (err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                localLogin(authResult);
            } else if (err) {
                alert(
                    'Could not get a new token ' + err.error + ':' + err.error_description + '.'
                );
                logout();
            }
            displayButtons();
        })
        ;
    }

    function logout() {
        // Remove isLoggedIn flag from localStorage
        localStorage.removeItem('isLoggedIn');
        // Remove tokens and expiry time
        accessToken = '';
        idToken = '';
        expiresAt = 0;
        displayButtons();
    }

    function isAuthenticated() {
        // Check whether the current time is past the
        // Access Token's expiry time
        var expiration = parseInt(expiresAt) || 0;
        return localStorage.getItem('isLoggedIn') === 'true' && new Date().getTime() < expiration;
    }

    function displayButtons() {
        if (isAuthenticated()) {
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'inline-block';
            loginStatus.innerHTML = 'You are logged in!';
        } else {
            loginBtn.style.display = 'inline-block';
            logoutBtn.style.display = 'none';
            loginStatus.innerHTML =
                'You are not logged in! Please log in to continue.';
        }
    }

    if (localStorage.getItem('isLoggedIn') === 'true') {
        renewTokens();
    } else {
        handleAuthentication();
    }

});