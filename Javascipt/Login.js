const passwordInput = document.getElementById('password');
const togglePasswordIcon = document.querySelector('.toggle-password');
const loadingOverlay = document.getElementById('loadingOverlay');

// Show the toggle icon when there is input in the password field
passwordInput.addEventListener('input', () => {
    togglePasswordIcon.style.display = passwordInput.value ? 'inline' : 'none';
});

function togglePassword() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    // Toggle the icon
    togglePasswordIcon.innerHTML = type === 'password' ? '<i class="fa fa-eye"></i>' : '<i class="fa fa-eye-slash"></i>';
}

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const email = event.target.email.value;
    const password = event.target.password.value;
    const alertContainer = document.getElementById('alert-container');

    // Clear any previous error messages and hide the loading overlay
    alertContainer.innerHTML = '';
    loadingOverlay.style.display = 'none';

    try {
        // Show loading overlay only after form submission
        loadingOverlay.style.display = 'flex';

        // Send login request to the server
        const response = await fetch('/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.status === 401) {
            // Show error message if login is incorrect and hide overlay
            alertContainer.innerHTML = `<div style="color: red; text-align: center;">${result.error}</div>`;
            loadingOverlay.style.display = 'none'; // Hide overlay on error
        } else if (response.ok) {
            // If login is successful, redirect
            window.location.href = '/Dashboard.html';
        } else {
            // Hide loading overlay for any other unexpected response
            loadingOverlay.style.display = 'none';
        }
    } catch (error) {
        console.error("Login error:", error);
        alertContainer.innerHTML = `<div style="color: red; text-align: center;">An error occurred. Please try again later.</div>`;
        loadingOverlay.style.display = 'none'; // Hide overlay on network or server error
    }
});
