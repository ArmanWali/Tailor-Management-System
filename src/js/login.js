// Electron-based login functionality for Tailor Management System
console.log('Login script loaded');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    console.log('window.api available:', window.api !== undefined);

    // Set up login form event listener
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    } else {
        console.error('Login form not found');
    }
});

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    console.log('Login form submitted');

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        showLoginError('Please enter both username and password');
        return;
    }

    try {
        // Send login request to main process via Electron IPC
        console.log('Sending login request to main process');
        window.api.send('login', { username, password });
    } catch (error) {
        console.error('Error sending login request:', error);
        showLoginError('Failed to connect to authentication service');
    }
}

// Handle login response from main process
if (window.api && window.api.receive) {
    window.api.receive('login-response', (response) => {
        console.log('Received login response:', response);

        if (response.success) {
            console.log('Login successful');

            // Store user info in session storage
            const userInfo = {
                username: response.user.username,
                name: response.user.name,
                role: response.user.role,
                loginTime: new Date().toISOString()
            };
            sessionStorage.setItem('user', JSON.stringify(userInfo));            // Redirect to dashboard
            console.log('Redirecting to dashboard...');
            window.location.href = 'pages/dashboard.html';
        } else {
            console.log('Login failed - invalid credentials');
            showLoginError('Invalid username or password');
        }
    });
} else {
    console.error('Electron API not available - running in web mode');
}

// Show login error message
function showLoginError(message = 'Login failed. Please try again.') {
    const errorElement = document.getElementById('login-error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';

        // Hide error after 5 seconds
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    } else {
        console.error('Error element not found');
        alert(message);
    }
}
