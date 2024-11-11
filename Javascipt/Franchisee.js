async function confirmSubmission(event) {
    event.preventDefault(); // Prevent immediate form submission
    const confirmed = confirm("Are you sure you want to submit this form?");

    if (confirmed) {
        try {
            const form = document.querySelector('form');
            const formData = new FormData(form);

            const response = await fetch(form.action, {
                method: form.method,
                body: formData,
            });

            if (response.ok) {
                showAlert('Form submitted successfully!', 'success');
                form.reset(); // Clear the form after successful submission
            } else {
                const errorData = await response.json();
                showAlert(`Error: ${errorData.message}`, 'error');
            }
        } catch (error) {
            showAlert(`Submission failed: ${error.message}`, 'error');
        }
    }
}

function addUnitRow() {
    const table = document.getElementById('unitTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    const cells = ['unitName[]', 'unitModel[]', 'unitMotorNo[]', 'unitChassisNo[]', 'unitPlateNo[]'];

    cells.forEach(cell => {
        const newCell = newRow.insertCell();
        const input = document.createElement('input');
        input.type = 'text';
        input.name = cell;
        input.required = true;
        newCell.appendChild(input);
    });
}

function deleteUnitRow() {
    const table = document.getElementById('unitTable');
    const rowCount = table.rows.length;

    if (rowCount > 2) {
        table.deleteRow(rowCount - 1);
    }
}

function showAlert(message, type) {
    const alertContainer = document.getElementById('alert-container');
    const alertMessage = document.getElementById('alert-message');
    const alertIcon = document.getElementById('alert-icon');

    alertMessage.textContent = message;

    if (type === 'success') {
        alertIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
        alertContainer.className = 'alert success';
    } else if (type === 'error') {
        alertIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
        alertContainer.className = 'alert error';
    }

    alertContainer.style.display = 'flex'; // Ensure it is visible
    
    window.scrollTo(0, 0); // Scroll to the top

    setTimeout(() => {
        alertContainer.style.display = 'none'; // Hide after 2 seconds
        // Only clear the form if the submission was successful
        if (type === 'success') {
            clearForm(); 
        }
    }, 2000); // Hide alert after 2 seconds
}

function clearForm() {
    const form = document.querySelector('form');
    form.reset();
}

// Renewal Function
// Modify the checkRenewalEligibility function
async function checkRenewalEligibility() {
    const applicationType = document.querySelector('input[name="applicationType"]:checked').value;

    if (applicationType === 'renewal') {
        const tfid = prompt('Please enter your TFID for renewal:'); // Ask user to input TFID

        if (tfid) {
            try {
                const response = await fetch(`http://localhost:8000/check-renewal?tfid=${encodeURIComponent(tfid)}`);
                const data = await response.json();

                if (data.exists) {
                    const lastRenewalDate = new Date(data.lastRenewalDate);
                    const oneYearAgo = new Date();
                    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

                    if (lastRenewalDate <= oneYearAgo) {
                        alert('You can renew the application.');
                        fetchExistingRecordByTFID(tfid); // Fetch record based on TFID
                    } else {
                        alert('Renewal is not allowed. Please wait until one year has passed since the last renewal.');
                        document.getElementById('newApplication').checked = true;
                    }
                } else {
                    alert('No existing record found for renewal.');
                    document.getElementById('newApplication').checked = true;
                }
            } catch (error) {
                console.error('Error checking renewal:', error);
                alert('An error occurred while checking renewal status.');
            }
        } else {
            alert('Please enter a valid TFID.');
            document.getElementById('newApplication').checked = true;
        }
    }
}

// Fetch existing record based on TFID
async function fetchExistingRecordByTFID(tfid) {
    try {
        const response = await fetch(`http://localhost:8000/fetch-record?tfid=${encodeURIComponent(tfid)}`);
        const data = await response.json();

        if (data.success) {
            const record = data.record;

            // Autofill the form fields as before
            document.getElementById('nameApplicant').value = record.nameApplicant || '';
            document.getElementById('route').value = record.route || '';
            document.getElementById('barangay').value = record.barangay || '';
            document.getElementById('municipality').value = record.municipality || '';
            document.getElementById('province').value = record.province || '';
            document.getElementById('occupation').value = record.occupation || '';

            // Set the type of ownership
            const typeOwnershipSelect = document.getElementById('typeOwnership');
            typeOwnershipSelect.value = record.typeOwnership || 'single';

            // Update unit table
            const unitTableBody = document.getElementById('unitTable').getElementsByTagName('tbody')[0];
            unitTableBody.innerHTML = ''; // Clear existing rows

            if (record.units && record.units.length > 0) {
                record.units.forEach(unit => {
                    const newRow = unitTableBody.insertRow();
                    newRow.insertCell().innerHTML = `<input type="text" name="unitName[]" value="${unit.unit_name}" required>`;
                    newRow.insertCell().innerHTML = `<input type="text" name="unitModel[]" value="${unit.unit_model}" required>`;
                    newRow.insertCell().innerHTML = `<input type="text" name="unitMotorNo[]" value="${unit.motor_no}" required>`;
                    newRow.insertCell().innerHTML = `<input type="text" name="unitChassisNo[]" value="${unit.chassis_no}" required>`;
                    newRow.insertCell().innerHTML = `<input type="text" name="unitPlateNo[]" value="${unit.plate_no}" required>`;
                });
            }

            document.getElementById('numUnits').value = record.numUnits || '';
            document.getElementById('officialDriver').value = record.officialDriver || '';
            document.getElementById('licenseNumber').value = record.licenseNumber || '';
        }
    } catch (error) {
        console.error('Error fetching record:', error);
        alert('An error occurred while fetching the existing record.');
    }
}


document.querySelectorAll('input[name="applicationType"]').forEach(radio => {
    radio.addEventListener('change', checkRenewalEligibility);
});

document.addEventListener('DOMContentLoaded', () => {
    const renewalRadio = document.getElementById('renewalApplication');
    const dateInput = document.getElementById('date');
    const certificationDateInput = document.getElementById('certificationDate');
    const certificateIssueDateInput = document.getElementById('certificateIssueDate');
    const subscribedDayInput = document.getElementById('subscribedDate');
    const subscribedMonthInput = document.getElementById('subscribedMonth');
    const subscribedYearInput = document.getElementById('subscribedYear');

    renewalRadio.addEventListener('change', () => {
        if (renewalRadio.checked) {
            const today = new Date();
            const day = String(today.getDate()).padStart(2, '0'); // Get the day of the month (01-31)
            const month = String(today.getMonth() + 1).padStart(2, '0'); // Get the month (01-12), months are zero-indexed
            const year = today.getFullYear(); // Get the year (e.g., 2024)

            // Set all the date-related inputs
            dateInput.value = today.toISOString().split('T')[0];
            certificationDateInput.value = today.toISOString().split('T')[0];
            certificateIssueDateInput.value = today.toISOString().split('T')[0];
            subscribedDayInput.value = day;
            subscribedMonthInput.value = month;
            subscribedYearInput.value = year;
        }
    });
});
