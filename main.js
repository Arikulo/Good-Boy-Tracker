const form = document.getElementById('chore-form');
const nameInput = document.getElementById('chore-name');
const valueInput = document.getElementById('chore-value');
const tableBody = document.querySelector('#chore-table tbody');
const totalValue = document.getElementById('total-value');
const saveDayBtn = document.getElementById('save-day');
const resetDayBtn = document.getElementById('reset-day');

// Hobby form elements
const hobbyForm = document.getElementById('hobby-form');
const hobbyNameInput = document.getElementById('hobby-name');
const hobbyValueInput = document.getElementById('hobby-value');
const hobbyTableBody = document.querySelector('#hobby-table tbody');
const hobbyTotalValue = document.getElementById('hobby-total-value');

// Essentials elements
const essentialsList = document.getElementById('essentials-list');
const essentialsTotalValue = document.getElementById('essentials-total-value');

const overallPointsSpan = document.getElementById('overall-points');
const overallPointsMoneySpan = document.getElementById('overall-points-money');
const todayTotalSpan = document.getElementById('today-total');
const spendForm = document.getElementById('spend-form');
const spendAmountInput = document.getElementById('spend-amount');
const spendAmountMoneySpan = document.getElementById('spend-amount-money');

// New: completed activities table
let completedTable = document.getElementById('completed-table-body');
if (!completedTable) {
    // Create completed activities table if not present
    const completedTableElem = document.createElement('table');
    completedTableElem.innerHTML = `
        <thead>
            <tr>
                <th>Completed</th>
                <th>Value</th>
            </tr>
        </thead>
        <tbody id="completed-table-body"></tbody>
    `;
    completedTableElem.style.marginTop = "2em";
    document.body.appendChild(completedTableElem);
    completedTable = document.getElementById('completed-table-body');
}

function getTodayString() {
    const today = new Date();
    return today.toISOString().split('T')[0]; // e.g., "2025-07-04"
}

// Always filter completed activities to only today's on load
function loadCompletedActivitiesForToday() {
    const allCompleted = JSON.parse(localStorage.getItem('completed-activities') || '[]');
    const today = getTodayString();
    const todaysCompleted = allCompleted.filter(act => act.date === today);
    localStorage.setItem('completed-activities', JSON.stringify(todaysCompleted));
    
    // Clear completed essentials if it's a new day
    const lastCompletedDate = localStorage.getItem('last-essentials-date');
    if (lastCompletedDate !== today) {
        localStorage.setItem('completed-essentials-today', JSON.stringify([]));
        localStorage.setItem('last-essentials-date', today);
    }
    
    return todaysCompleted;
}

let completedActivities = loadCompletedActivitiesForToday();
let chores = JSON.parse(localStorage.getItem('today-chores') || '[]');
let hobbies = JSON.parse(localStorage.getItem('today-hobbies') || '[]');
let essentials = JSON.parse(localStorage.getItem('today-essentials') || '[]');
// Load completed essentials after checking for new day
completedActivities; // This triggers the new day check
let completedEssentialsToday = JSON.parse(localStorage.getItem('completed-essentials-today') || '[]');
let overallPoints = parseInt(localStorage.getItem('overall-points') || '0', 10);

function updateTable() {
    tableBody.innerHTML = '';
    let total = 0;
    chores.forEach((chore, idx) => {
        total += chore.value;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${chore.name}</td>
            <td>${chore.value}</td>
            <td><button onclick="removeChore(${idx})">Remove</button></td>
        `;
        tableBody.appendChild(row);
    });
    totalValue.textContent = total;
    localStorage.setItem('today-chores', JSON.stringify(chores));
    updateCompletedTable();
}

function updateHobbyTable() {
    hobbyTableBody.innerHTML = '';
    let total = 0;
    hobbies.forEach((hobby, idx) => {
        total += hobby.value;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${hobby.name}</td>
            <td>${hobby.value}</td>
            <td><button onclick="removeHobby(${idx})">Remove</button></td>
        `;
        hobbyTableBody.appendChild(row);
    });
    hobbyTotalValue.textContent = total;
    localStorage.setItem('today-hobbies', JSON.stringify(hobbies));
    updateCompletedTable();
}

function updateEssentialsSection() {
    essentialsList.innerHTML = '';
    let total = 0;
    
    Object.entries(essentialData).forEach(([name, points]) => {
        const isChecked = essentials.some(essential => essential.name === name);
        const isCompletedToday = completedEssentialsToday.includes(name);
        const isDisabled = isCompletedToday;
        
        if (isChecked && !isCompletedToday) total += points;
        
        const item = document.createElement('div');
        item.className = `essential-item ${isDisabled ? 'disabled-item' : ''}`;
        item.innerHTML = `
            <label>
                <input type="checkbox" ${isChecked ? 'checked' : ''} 
                       ${isDisabled ? 'disabled' : ''}
                       onchange="toggleEssential('${name}', ${points}, this.checked)">
                <span class="essential-name ${isDisabled ? 'completed-today' : ''}">${name}</span>
                <span class="essential-points">(${points} pts)</span>
            </label>
        `;
        essentialsList.appendChild(item);
    });
    
    essentialsTotalValue.textContent = total;
    localStorage.setItem('today-essentials', JSON.stringify(essentials));
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
    updateTodayTotal();
}

window.removeChore = function(idx) {
    chores.splice(idx, 1);
    updateTable();
};

window.removeHobby = function(idx) {
    hobbies.splice(idx, 1);
    updateHobbyTable();
};

window.toggleEssential = function(name, points, isChecked) {
    // Don't allow toggling if already completed today
    if (completedEssentialsToday.includes(name)) {
        return;
    }
    
    if (isChecked) {
        // Add to essentials if not already there
        if (!essentials.some(essential => essential.name === name)) {
            essentials.push({ name, value: points });
        }
    } else {
        // Remove from essentials
        essentials = essentials.filter(essential => essential.name !== name);
    }
    updateEssentialsSection();
};

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = nameInput.value.trim();
    const value = parseInt(valueInput.value, 10);
    if (name && !isNaN(value)) {
        chores.push({ name, value });
        nameInput.value = '';
        valueInput.value = '';
        updateTable();
    }
});

hobbyForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = hobbyNameInput.value.trim();
    const value = parseInt(hobbyValueInput.value, 10);
    if (name && !isNaN(value)) {
        hobbies.push({ name, value });
        hobbyNameInput.value = '';
        hobbyValueInput.value = '';
        updateHobbyTable();
    }
});

saveDayBtn.addEventListener('click', function() {
    const choreTotal = chores.reduce((sum, chore) => sum + chore.value, 0);
    const hobbyTotal = hobbies.reduce((sum, hobby) => sum + hobby.value, 0);
    // Only count essentials that haven't been completed today
    const essentialTotal = essentials
        .filter(essential => !completedEssentialsToday.includes(essential.name))
        .reduce((sum, essential) => sum + essential.value, 0);
    const combinedTotal = choreTotal + hobbyTotal + essentialTotal;
    
    if (combinedTotal === 0) return;
    
    overallPoints += combinedTotal;
    localStorage.setItem('overall-points', overallPoints);
    updateOverallPoints();
    
    // Move chores, hobbies, and essentials to completed list with today's date
    const today = getTodayString();
    const completedChoresWithDate = chores.map(chore => ({
        ...chore,
        date: today
    }));
    const completedHobbiesWithDate = hobbies.map(hobby => ({
        ...hobby,
        date: today
    }));
    const completedEssentialsWithDate = essentials
        .filter(essential => !completedEssentialsToday.includes(essential.name))
        .map(essential => ({
            ...essential,
            date: today
        }));
    
    completedActivities = completedActivities.concat(completedChoresWithDate).concat(completedHobbiesWithDate).concat(completedEssentialsWithDate);
    
    // Mark essentials as completed today (but don't clear them) - only the ones that weren't already completed
    essentials.forEach(essential => {
        if (!completedEssentialsToday.includes(essential.name)) {
            completedEssentialsToday.push(essential.name);
        }
    });
    localStorage.setItem('completed-essentials-today', JSON.stringify(completedEssentialsToday));
    
    chores = [];
    hobbies = [];
    // Don't clear essentials - keep them checked but disabled
    
    // After adding, filter and save only today's completed activities
    completedActivities = completedActivities.filter(act => act.date === today);
    updateTable();
    updateHobbyTable();
    updateEssentialsSection();
    localStorage.setItem('completed-activities', JSON.stringify(completedActivities));
});

resetDayBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to reset today? This will clear all progress and subtract today\'s points from your overall total.')) {
        // Calculate today's total before clearing
        const todayTotal = completedActivities.reduce((sum, activity) => sum + activity.value, 0);
        
        // Subtract today's total from overall points (can go negative)
        overallPoints -= todayTotal;
        localStorage.setItem('overall-points', overallPoints);
        updateOverallPoints();
        
        // Clear today's activities
        chores = [];
        hobbies = [];
        essentials = [];
        completedActivities = [];
        completedEssentialsToday = [];
        
        // Clear localStorage for today's data
        localStorage.setItem('today-chores', JSON.stringify([]));
        localStorage.setItem('today-hobbies', JSON.stringify([]));
        localStorage.setItem('today-essentials', JSON.stringify([]));
        localStorage.setItem('completed-activities', JSON.stringify([]));
        localStorage.setItem('completed-essentials-today', JSON.stringify([]));
        
        // Update all displays
        updateTable();
        updateHobbyTable();
        updateEssentialsSection();
        updateCompletedTable();
        updateTodayTotal();
    }
});

function updateOverallPoints() {
    overallPointsSpan.textContent = overallPoints;
    overallPointsMoneySpan.textContent = `(${pointsToMoney(overallPoints)})`;
}

function updateTodayTotal() {
    const todayTotal = completedActivities.reduce((sum, activity) => sum + activity.value, 0);
    todayTotalSpan.textContent = todayTotal;
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

// Add event listener to update spend amount money display
spendAmountInput.addEventListener('input', function() {
    const spendAmount = parseInt(this.value, 10);
    if (!isNaN(spendAmount) && spendAmount > 0) {
        spendAmountMoneySpan.textContent = `(${pointsToMoney(spendAmount)})`;
    } else {
        spendAmountMoneySpan.textContent = '';
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

// Data for predefined chores and hobbies with their point values
// Load custom data from localStorage or use defaults
const defaultChoreData = {
    "Dishes": 3,
    "Vacuum": 5,
    "Laundry": 4,
    "Make Bed": 2,
    "Clean Bathroom": 6,
    "Take Out Trash": 2,
    "Kitchen Deep Clean": 8,
    "Organize Room": 5,
    "Dust Furniture": 3,
    "Mop Floors": 4
};

const defaultHobbyData = {
    "Reading": 4,
    "Exercise": 6,
    "Meditation": 5,
    "Drawing/Art": 5,
    "Learning Language": 6,
    "Coding Practice": 7,
    "Writing": 4,
    "Playing Instrument": 5,
    "Gardening": 4,
    "Cooking New Recipe": 5
};

const defaultEssentialData = {
    "Drink Water": 1,
    "Take Vitamins": 2,
    "Brush Teeth": 2,
    "Shower": 3,
    "Skincare Routine": 2,
    "Stretch": 3,
    "Plan Tomorrow": 3,
    "Tidy Workspace": 2,
    "Check Emails": 1,
    "Review Goals": 4
};

let choreData = JSON.parse(localStorage.getItem('custom-chore-data') || JSON.stringify(defaultChoreData));
let hobbyData = JSON.parse(localStorage.getItem('custom-hobby-data') || JSON.stringify(defaultHobbyData));
let essentialData = JSON.parse(localStorage.getItem('custom-essential-data') || JSON.stringify(defaultEssentialData));

// Function to handle auto-filling values when predefined options are selected
function handleChoreSelection() {
    const choreName = nameInput.value.trim();
    if (choreData[choreName]) {
        valueInput.value = choreData[choreName];
    }
}

function handleHobbySelection() {
    const hobbyName = hobbyNameInput.value.trim();
    if (hobbyData[hobbyName]) {
        hobbyValueInput.value = hobbyData[hobbyName];
    }
}

// Add event listeners for auto-filling values
nameInput.addEventListener('input', handleChoreSelection);
hobbyNameInput.addEventListener('input', handleHobbySelection);

// Function to update datalist options dynamically
function updateDatalistOptions() {
    const choreOptions = document.getElementById('chore-options');
    const hobbyOptions = document.getElementById('hobby-options');
    
    // Clear existing options
    choreOptions.innerHTML = '';
    hobbyOptions.innerHTML = '';
    
    // Add chore options
    Object.entries(choreData).forEach(([name, points]) => {
        const option = document.createElement('option');
        option.value = name;
        option.setAttribute('data-points', points);
        option.textContent = `${name} - ${points} points`;
        choreOptions.appendChild(option);
    });
    
    // Add hobby options
    Object.entries(hobbyData).forEach(([name, points]) => {
        const option = document.createElement('option');
        option.value = name;
        option.setAttribute('data-points', points);
        option.textContent = `${name} - ${points} points`;
        hobbyOptions.appendChild(option);
    });
}

// Update datalist options on page load
updateDatalistOptions();

updateTable();
updateHobbyTable();
updateEssentialsSection();
updateOverallPoints();
updateTodayTotal();

// Listen for storage changes to update datalist when settings change
window.addEventListener('storage', function(e) {
    if (e.key === 'custom-chore-data' || e.key === 'custom-hobby-data' || e.key === 'custom-essential-data') {
        // Reload the data and update datalists
        choreData = JSON.parse(localStorage.getItem('custom-chore-data') || JSON.stringify(defaultChoreData));
        hobbyData = JSON.parse(localStorage.getItem('custom-hobby-data') || JSON.stringify(defaultHobbyData));
        essentialData = JSON.parse(localStorage.getItem('custom-essential-data') || JSON.stringify(defaultEssentialData));
        updateDatalistOptions();
        updateEssentialsSection();
    }
});

// Also check for changes when the page gains focus (when returning from settings)
window.addEventListener('focus', function() {
    const newChoreData = JSON.parse(localStorage.getItem('custom-chore-data') || JSON.stringify(defaultChoreData));
    const newHobbyData = JSON.parse(localStorage.getItem('custom-hobby-data') || JSON.stringify(defaultHobbyData));
    const newEssentialData = JSON.parse(localStorage.getItem('custom-essential-data') || JSON.stringify(defaultEssentialData));
    
    // Check if data has changed
    if (JSON.stringify(newChoreData) !== JSON.stringify(choreData) || 
        JSON.stringify(newHobbyData) !== JSON.stringify(hobbyData) ||
        JSON.stringify(newEssentialData) !== JSON.stringify(essentialData)) {
        
        // Update the data and refresh datalists
        Object.assign(choreData, newChoreData);
        Object.assign(hobbyData, newHobbyData);
        Object.assign(essentialData, newEssentialData);
        updateDatalistOptions();
        updateEssentialsSection();
    }
});

// Convert points to money (6 pence per point)
function pointsToMoney(points) {
    const pounds = (points * 0.06).toFixed(2);
    return `£${pounds}`;
}