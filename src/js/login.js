// Add debugging
console.log('Login script loaded');
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    console.log('window.api available:', window.api !== undefined);
});

// Login form submission
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    console.log('Login form submitted');

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        showLoginError();
        return;
    }

    try {
        // Send login request to main process
        console.log('Sending login request to main process');
        window.api.send('login', { username, password });
    } catch (error) {
        console.error('Error sending login request:', error);
        showLoginError();
    }
});

// Handle login response
window.api.receive('login-response', (response) => {
    if (response.success) {
        // Store user info in session storage
        sessionStorage.setItem('user', JSON.stringify(response.user));

        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } else {
        showLoginError();
    }
});

function showLoginError() {
    const errorElement = document.getElementById('login-error');
    errorElement.style.display = 'block';

    // Hide error after 3 seconds
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 3000);
}
