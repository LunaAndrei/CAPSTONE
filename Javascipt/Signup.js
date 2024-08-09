function showAlert(message, isSuccess) {
    const alertBox = document.getElementById('alert');
    const alertMessage = document.getElementById('alertMessage');
    const alertIcon = document.getElementById('alertIcon');

    alertMessage.textContent = message;
    alertBox.className = isSuccess ? 'alert success' : 'alert error';
    alertIcon.innerHTML = isSuccess ? '&#10004;' : '&#10008;'; // Check mark or "X" mark
    alertBox.style.display = 'block';

    setTimeout(() => {
      alertBox.style.display = 'none';
      document.getElementById('signupForm').reset(); // Clear the form fields
    }, 2000);
  }

  function submitForm(event) {
    event.preventDefault(); // Prevent the default form submission
    const formData = new FormData(event.target);

    fetch('http://localhost:8000/signup_process', { // Update the URL to Node.js endpoint
      method: 'POST',
      body: new URLSearchParams(formData).toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(json => { throw new Error(json.message) });
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      showAlert(data.message, true); // Show success alert
    })
    .catch(error => {
      console.error('Error:', error);
      showAlert('Signup failed: ' + error.message, false); // Show error alert
    });
  }

  const passwordInput = document.getElementById('password');
  const togglePassword = document.getElementById('togglePassword');

  passwordInput.addEventListener('input', function () {
    if (this.value.length > 0) {
      togglePassword.style.display = 'block';
    } else {
      togglePassword.style.display = 'none';
    }
  });

  togglePassword.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    this.classList.toggle('fa-eye-slash'); // Toggle the eye / eye-slash icon
  });