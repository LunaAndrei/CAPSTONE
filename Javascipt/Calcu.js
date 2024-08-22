function calculateChange() {
    const total = 170; // The fixed amount for the fee
    const amount = document.getElementById('amount').value;
    const change = amount - total;

    document.getElementById('change').value = `₱${change.toFixed(2)}`;
}
