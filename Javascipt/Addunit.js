
    function addUnitRow() {
        const table = document.getElementById('unitTable').getElementsByTagName('tbody')[0];
        const newRow = table.insertRow();

        const nameCell = newRow.insertCell(0);
        const modelCell = newRow.insertCell(1);
        const motorNoCell = newRow.insertCell(2);
        const chassisNoCell = newRow.insertCell(3);
        const plateNoCell = newRow.insertCell(4);

        nameCell.innerHTML = '<input type="text" name="unitName[]" required>';
        modelCell.innerHTML = '<input type="text" name="unitModel[]" required>';
        motorNoCell.innerHTML = '<input type="text" name="unitMotorNo[]" required>';
        chassisNoCell.innerHTML = '<input type="text" name="unitChassisNo[]" required>';
        plateNoCell.innerHTML = '<input type="text" name="unitPlateNo[]" required>';
    }
