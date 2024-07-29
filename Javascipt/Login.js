const passwordInput = document.getElementById('password');
        const togglePasswordIcon = document.querySelector('.toggle-password');

        // Show the toggle icon when there is input in the password field
        passwordInput.addEventListener('input', () => {
            if (passwordInput.value) {
                togglePasswordIcon.style.display = 'inline';
            } else {
                togglePasswordIcon.style.display = 'none';
            }
        });

        function togglePassword() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // Toggle the icon
            togglePasswordIcon.innerHTML = type === 'password' ? '<i class="fa fa-eye"></i>' : '<i class="fa fa-eye-slash"></i>';
        }