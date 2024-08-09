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

        document.getElementById('loginForm').addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const email = event.target.email.value;
            const password = event.target.password.value;
            
            const response = await fetch('/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ email, password })
            });
      
            const result = await response.json();
            
            if (response.status === 401) {
              const alertContainer = document.getElementById('alert-container');
              alertContainer.innerHTML = `<div style="color: red; text-align: center;">${result.error}</div>`;
            } else if (response.ok) {
              window.location.href = '/Dashboard.html';
            }
          });