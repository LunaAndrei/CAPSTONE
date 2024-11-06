let showingOccuPermit = true;

function toggleTable() {
    const toggleButton = document.getElementById('toggleButton');
    if (showingOccuPermit) {
        displayInspectionsApplicants();
        toggleButton.innerText = "Show the Applicants for Occupational Permit";
    } else {
        displayOccuPermitApplicants();
        toggleButton.innerText = "Show the Applicants for the Inspections";
    }
    showingOccuPermit = !showingOccuPermit;
}

// Display OccuPermit applicants in a table
async function displayOccuPermitApplicants() {
    const occuPermitApplicants = await fetchData('http://localhost:8000/data/occupermit-applicants');
    const applicantTable = document.getElementById('applicantTable');
    applicantTable.innerHTML = ''; 

    const tableContainer = document.createElement('div');
    tableContainer.classList.add('table-container');

    const table = document.createElement('table');
    table.classList.add('applicant-table');

    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `<th>Occuid</th><th>Name</th>`;
    table.appendChild(headerRow);

    occuPermitApplicants.forEach(applicant => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${applicant.Occuid}</td><td>${applicant.applicant_name}</td>`;
        table.appendChild(row);
    });

    tableContainer.appendChild(table);
    applicantTable.appendChild(tableContainer);
}

// Display Inspections applicants in a table
async function displayInspectionsApplicants() {
    const inspectionsApplicants = await fetchData('http://localhost:8000/data/inspections-applicants');
    const applicantTable = document.getElementById('applicantTable');
    applicantTable.innerHTML = ''; 

    const tableContainer = document.createElement('div');
    tableContainer.classList.add('table-container');

    const table = document.createElement('table');
    table.classList.add('applicant-table');

    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `<th>MTOP ID</th><th>Name</th>`;
    table.appendChild(headerRow);

    inspectionsApplicants.forEach(applicant => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${applicant.mtop_id}</td><td>${applicant.applicant_name}</td>`;
        table.appendChild(row);
    });

    tableContainer.appendChild(table);
    applicantTable.appendChild(tableContainer);
}

// Fetch data from a given URL
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error fetching data from ${url}`);
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Initial call to display OccuPermit list on page load
displayOccuPermitApplicants();


