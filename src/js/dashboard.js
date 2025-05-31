// Dashboard initialization
document.addEventListener('DOMContentLoaded', function () {
    console.log('Dashboard DOM loaded');

    try {
        // Check if user is logged in (optional for development)
        checkUserSession();

        // Set up event listeners
        setupEventListeners();

        console.log('Dashboard initialized successfully');
    } catch (error) {
        console.error('Error initializing dashboard:', error);
    }
});

// Check user session (optional authentication check)
function checkUserSession() {
    try {
        const user = sessionStorage.getItem('user');
        if (user) {
            const userData = JSON.parse(user);
            console.log('User logged in:', userData.username);
        } else {
            console.log('No user session found, but allowing access for development');
            // In production, you might want to redirect to login:
            // window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Error checking user session:', error);
    }
}

// Set up all event listeners
function setupEventListeners() {
    console.log('Setting up event listeners');

    // Logout link
    if (document.getElementById('logout-link')) {
        console.log('Found logout-link');
        document.getElementById('logout-link').addEventListener('click', function (e) {
            console.log('Logout link clicked');
            e.preventDefault();
            logout();
        });
    } else {
        console.error('logout-link element not found');
    }

    // Dashboard cards navigation
    if (document.getElementById('add-customer-card')) {
        console.log('Found add-customer-card');
        document.getElementById('add-customer-card').addEventListener('click', function () {
            console.log('Add customer card clicked');
            window.location.href = 'add-customer.html';
        });
    } else {
        console.error('add-customer-card element not found');
    }

    if (document.getElementById('manage-customers-card')) {
        console.log('Found manage-customers-card');
        document.getElementById('manage-customers-card').addEventListener('click', function () {
            console.log('Manage customers card clicked');
            window.location.href = 'manage-customers.html';
        });
    } else {
        console.error('manage-customers-card element not found');
    }
}

// Logout function
function logout() {
    console.log('Logging out');

    try {
        // Clear any stored user data
        sessionStorage.removeItem('user');
        localStorage.removeItem('user');        // Redirect to login page
        window.location.href = '../index.html';
    } catch (error) {
        console.error('Error logging out:', error);
        alert('Error logging out. Please try closing the application.');
    }
}

