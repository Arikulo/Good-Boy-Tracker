const form = document.getElementById('activity-form');
const nameInput = document.getElementById('activity-name');
const valueInput = document.getElementById('activity-value');
const tableBody = document.querySelector('#activity-table tbody');
const totalValue = document.getElementById('total-value');
const saveDayBtn = document.getElementById('save-day');
const savedTotalsTableBody = document.getElementById('saved-totals');
const overallPointsSpan = document.getElementById('overall-points');
const spendForm = document.getElementById('spend-form');
const spendAmountInput = document.getElementById('spend-amount');
const spendDateSelect = document.getElementById('spend-date');

let activities = [];

function updateTable() {
    tableBody.innerHTML = '';
    let total = 0;
    activities.forEach((act, idx) => {
        total += act.value;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${act.name}</td>
            <td>${act.value}</td>
            <td><button onclick="removeActivity(${idx})">Remove</button></td>
        `;
        tableBody.appendChild(row);
    });
    totalValue.textContent = total;
}

window.removeActivity = function(idx) {
    activities.splice(idx, 1);
    updateTable();
};

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = nameInput.value.trim();
    const value = parseInt(valueInput.value, 10);
    if (name && !isNaN(value)) {
        activities.push({ name, value });
        nameInput.value = '';
        valueInput.value = '';
        updateTable();
    }
});

saveDayBtn.addEventListener('click', function() {
    const today = new Date().toISOString().slice(0, 10);
    const total = activities.reduce((sum, act) => sum + act.value, 0);
    if (total === 0) return;
    localStorage.setItem('tracker-' + today, total);
    loadSavedTotals();
    activities = [];
    updateTable();
});

// Helper to get all tracker dates
function getAllTrackerDates() {
    return Object.keys(localStorage)
        .filter(key => key.startsWith('tracker-'))
        .map(key => key.replace('tracker-', ''))
        .sort();
}

// Populate spend date dropdown
function updateSpendDateOptions() {
    spendDateSelect.innerHTML = '';
    getAllTrackerDates().forEach(date => {
        const option = document.createElement('option');
        option.value = date;
        option.textContent = date;
        spendDateSelect.appendChild(option);
    });
}

// Get spent points for a specific date
function getSpentPointsForDate(date) {
    return parseInt(localStorage.getItem('spent-' + date) || '0', 10);
}

// Set spent points for a specific date
function setSpentPointsForDate(date, val) {
    localStorage.setItem('spent-' + date, val);
}

// Update overall points calculation to sum all earned minus all spent
function calculateOverallPoints() {
    let total = 0;
    getAllTrackerDates().forEach(date => {
        const earned = parseInt(localStorage.getItem('tracker-' + date), 10) || 0;
        const spent = getSpentPointsForDate(date);
        total += (earned - spent);
    });
    return total;
}

function updateOverallPoints() {
    overallPointsSpan.textContent = calculateOverallPoints();
}

spendForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const spend = parseInt(spendAmountInput.value, 10);
    const date = spendDateSelect.value;
    const earned = parseInt(localStorage.getItem('tracker-' + date), 10) || 0;
    const alreadySpent = getSpentPointsForDate(date);
    const available = earned - alreadySpent;
    if (!isNaN(spend) && spend > 0 && spend <= available) {
        setSpentPointsForDate(date, alreadySpent + spend);
        updateOverallPoints();
        loadSavedTotals();
        spendAmountInput.value = '';
    } else {
        alert('Not enough points to spend for that day!');
    }
});

// Update the saved totals table
function loadSavedTotals() {
    savedTotalsTableBody.innerHTML = '';
    getAllTrackerDates().forEach(date => {
        const earned = localStorage.getItem('tracker-' + date);
        const spent = getSpentPointsForDate(date);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${date}</td>
            <td>${earned}</td>
            <td>${spent}</td>
        `;
        savedTotalsTableBody.appendChild(row);
    });
    updateSpendDateOptions();
    updateOverallPoints();
}

loadSavedTotals();
updateTable();