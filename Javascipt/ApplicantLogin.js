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


        document.addEventListener('DOMContentLoaded', function() {
          const rightArrow = document.querySelector('.right-arrow');
          const leftArrow = document.querySelector('.left-arrow');
          const infoSection = document.querySelector('.info-section');
      
          // Save the original content of the info section
          const originalContent = `
            <div class="arrow-button left-arrow">
              <i class="fas fa-chevron-left"></i>
            </div>
            <h2>Occupational Permit</h2>
            <p>
              Occupational permits, also known as <br>professional licenses or occupational licenses,<br> are legal requirements in many jurisdictions<br> for individuals to practice certain professions <br>or occupations. These permits are typically<br> issued by governmental or professional<br> regulatory bodies and are meant to ensure <br>that practitioners meet certain standards of<br> education, training, competency, and ethical <br>conduct.
            </p>
            <div class="image-container1">
              <img class="Ocpermit" src="Pic/OccupationalPermit.jpg" alt="Occupational Permit">
            </div>
            <div class="info2">
              <h2>Motorized Tricycle Operator's Permit (MTOP)</h2>
              <p class="p2">
                The issuance of Motorized Tricycle <br>Operator's Permit is a requirement <br>of the Land Transportation Office <br>(LTO) for the legal operation of <br>Motorized Tricycle Unit within<br>the area of jurisdiction of the <br>municipality. It is also a legal <br>requirement for the renewal of<br> vehicle registration at LTO.
              </p>
              <div class="image-container2">
                <img class="image2" src="Pic/TricyclePermit.png" alt="Tricycle Permit">
              </div>
            </div>
            <div class="arrow-button right-arrow">
              <i class="fas fa-chevron-right"></i>
            </div>
          `;
      
          // Extended content for data privacy reminder with an image at the bottom
          const privacyContent = `
            <div class="arrow-button left-arrow">
              <i class="fas fa-chevron-left"></i>
            </div>
            <h2>Data Privacy Reminder</h2>
            <p>
              Your privacy is important to us. All information collected from users is treated with the utmost confidentiality. 
              The data collected will only be used for purposes specified during collection and will not be shared with third 
              parties without your explicit consent. We are committed to protecting your personal data and ensuring its security. 
              Any data you provide will be handled in compliance with data protection regulations. We continuously review our 
              procedures to enhance our security and to safeguard your information. Should you have any concerns or questions 
              about how your data is handled, feel free to reach out to our support team.
            </p>
            <div class="image-container">
              <img src="Pic/PrivacyImage.png" alt="Privacy" style="width: 90%; padding-top:10px; border-radius: 10px; box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);">
            </div>
          `;
      
          // New content for client information
          const clientInfoContent = `
          <div class="arrow-button right-arrow">
            <i class="fas fa-chevron-right"></i>
          </div>
          <h2>Client Information</h2>
          <p>
            <strong>Office Name:</strong> Ecenter San Luis<br>
            <strong>Office Hours:</strong> Monday to Friday, 8:00 AM - 5:00 PM<br>
            <strong>Department:</strong> Occupational Permit Department<br>
            <strong>Location:</strong> San Luis
          </p>
          <div class="image-container">
            <img src="Pic/ClientImage.png" alt="Client Information" style="width: 100%; padding-top:10px; border-radius: 10px; box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);">
          </div>
        `;
        
      
          // Right arrow button click event for privacy content
          function showPrivacyContent() {
            infoSection.innerHTML = privacyContent;
            attachEventListeners();
          }
      
          // Left arrow button click event for original content
          function showOriginalContent() {
            infoSection.innerHTML = originalContent;
            attachEventListeners();
          }
      
          // Left arrow button click event for privacy content
          function showClientInfoContent() {
            infoSection.innerHTML = clientInfoContent;
            attachEventListeners();
          }
      
          // Handle click for the left arrow in the original content
          function attachEventListeners() {
            const newLeftArrow = document.querySelector('.left-arrow');
            const newRightArrow = document.querySelector('.right-arrow');
      
            if (newRightArrow) {
              newRightArrow.addEventListener('click', function() {
                if (infoSection.innerHTML.includes('Client Information')) {
                  showOriginalContent();
                } else {
                  showPrivacyContent();
                }
              });
            }
      
            if (newLeftArrow) {
              newLeftArrow.addEventListener('click', function() {
                if (infoSection.innerHTML.includes('Occupational Permit')) {
                  showClientInfoContent();
                } else if (infoSection.innerHTML.includes('Data Privacy Reminder')) {
                  showOriginalContent();
                }
              });
            }
          }
      
          // Initial display
          infoSection.innerHTML = originalContent;
          attachEventListeners();
      });
      


      // ApplicantLogin.js
  const loadingOverlay = document.getElementById('loadingOverlay');
    document.getElementById("loginForm").addEventListener("submit", async function(event) {
      event.preventDefault();

      // Collect form data
      const formData = new FormData(this);
      const jsonData = Object.fromEntries(formData.entries());
      loadingOverlay.style.display = 'none';
      

      try {
        loadingOverlay.style.display = 'flex';
        // Send POST request to login endpoint
        const response = await fetch("/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonData)
        });

        // Process response
        if (response.ok) {
          window.location.href = "applicantdashboard.html"; // Redirect on success
        } else {
          const result = await response.json();
          showAlert(result.message, "error");
          loadingOverlay.style.display = 'none'; // Show error message
        }
      } catch (error) {
        showAlert("An error occurred. Please try again.", "error");
        loadingOverlay.style.display = 'none';
      }
    });

    // Function to display alert messages
    function showAlert(message, type) {
      const alertContainer = document.getElementById("alert-container");
      alertContainer.innerHTML = `<div class="alert ${type}">${message}</div>`;
      setTimeout(() => {
        alertContainer.innerHTML = ""; // Clear the alert after a delay
      }, 3000);
    }
