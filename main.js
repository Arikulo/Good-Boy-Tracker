const form = document.getElementById('activity-form');
const nameInput = document.getElementById('activity-name');
const valueInput = document.getElementById('activity-value');
const tableBody = document.querySelector('#activity-table tbody');
const totalValue = document.getElementById('total-value');
const saveDayBtn = document.getElementById('save-day');
const overallPointsSpan = document.getElementById('overall-points');
const spendForm = document.getElementById('spend-form');
const spendAmountInput = document.getElementById('spend-amount');

// New: completed activities table
let completedTable = document.getElementById('completed-table-body');
if (!completedTable) {
    // Create completed activities table if not present
    const completedTableElem = document.createElement('table');
    completedTableElem.innerHTML = `
        <thead>
            <tr>
                <th>Completed Activity</th>
                <th>Value</th>
            </tr>
        </thead>
        <tbody id="completed-table-body"></tbody>
    `;
    completedTableElem.style.marginTop = "2em";
    document.body.appendChild(completedTableElem);
    completedTable = document.getElementById('completed-table-body');
}

let activities = JSON.parse(localStorage.getItem('today-activities') || '[]');
let completedActivities = JSON.parse(localStorage.getItem('completed-activities') || '[]');
let overallPoints = parseInt(localStorage.getItem('overall-points') || '0', 10);

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
    localStorage.setItem('today-activities', JSON.stringify(activities));
    updateCompletedTable();
}

function updateCompletedTable() {
    completedTable.innerHTML = '';
    completedActivities.forEach(act => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${act.name}</td>
            <td>${act.value}</td>
        `;
        completedTable.appendChild(row);
    });
    localStorage.setItem('completed-activities', JSON.stringify(completedActivities));
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
    const total = activities.reduce((sum, act) => sum + act.value, 0);
    if (total === 0) return;
    overallPoints += total;
    localStorage.setItem('overall-points', overallPoints);
    updateOverallPoints();
    // Move activities to completed list
    completedActivities = completedActivities.concat(activities);
    activities = [];
    updateTable();
    // Save completed list
    localStorage.setItem('completed-activities', JSON.stringify(completedActivities));
});

function updateOverallPoints() {
    overallPointsSpan.textContent = overallPoints;
}

spendForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const spend = parseInt(spendAmountInput.value, 10);
    if (!isNaN(spend) && spend > 0 && spend <= overallPoints) {
        overallPoints -= spend;
        localStorage.setItem('overall-points', overallPoints);
        updateOverallPoints();
        spendAmountInput.value = '';
    } else {
        alert('Not enough points to spend!');
    }
});

function updateCurrentDateTime() {
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString();
    document.getElementById('current-datetime').textContent = `Current Date & Time: ${dateStr} ${timeStr}`;
}
setInterval(updateCurrentDateTime, 1000);
updateCurrentDateTime();

updateTable();
updateOverallPoints();