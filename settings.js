// Default data for chores and hobbies
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

// Get current custom data or use defaults
let customChoreData = JSON.parse(localStorage.getItem('custom-chore-data') || JSON.stringify(defaultChoreData));
let customHobbyData = JSON.parse(localStorage.getItem('custom-hobby-data') || JSON.stringify(defaultHobbyData));
let customEssentialData = JSON.parse(localStorage.getItem('custom-essential-data') || JSON.stringify(defaultEssentialData));

// DOM elements
const addChoreForm = document.getElementById('add-chore-form');
const addHobbyForm = document.getElementById('add-hobby-form');
const addEssentialForm = document.getElementById('add-essential-form');
const choresList = document.getElementById('chores-list');
const hobbiesList = document.getElementById('hobbies-list');
const essentialsList = document.getElementById('essentials-list');
const resetDefaultsBtn = document.getElementById('reset-defaults');

// Form inputs
const newChoreName = document.getElementById('new-chore-name');
const newChoreValue = document.getElementById('new-chore-value');
const newHobbyName = document.getElementById('new-hobby-name');
const newHobbyValue = document.getElementById('new-hobby-value');
const newEssentialName = document.getElementById('new-essential-name');
const newEssentialValue = document.getElementById('new-essential-value');

// Render functions
function renderChores() {
    choresList.innerHTML = '';
    Object.entries(customChoreData).forEach(([name, points]) => {
        const card = createItemCard(name, points, 'chore');
        choresList.appendChild(card);
    });
}

function renderHobbies() {
    hobbiesList.innerHTML = '';
    Object.entries(customHobbyData).forEach(([name, points]) => {
        const card = createItemCard(name, points, 'hobby');
        hobbiesList.appendChild(card);
    });
}

function renderEssentials() {
    essentialsList.innerHTML = '';
    Object.entries(customEssentialData).forEach(([name, points]) => {
        const card = createItemCard(name, points, 'essential');
        essentialsList.appendChild(card);
    });
}

function createItemCard(name, points, type) {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
        <div class="item-info">
            <div class="item-name">${name}</div>
            <div class="item-points">${points} points</div>
        </div>
        <div class="item-actions">
            <button class="edit-btn" onclick="editItem('${name}', ${points}, '${type}')">Edit</button>
            <button class="delete-btn" onclick="deleteItem('${name}', '${type}')">Delete</button>
        </div>
    `;
    return card;
}

// Add new items
addChoreForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = newChoreName.value.trim();
    const value = parseInt(newChoreValue.value);
    
    if (name && value > 0) {
        customChoreData[name] = value;
        saveData();
        renderChores();
        newChoreName.value = '';
        newChoreValue.value = '';
    }
});

addHobbyForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = newHobbyName.value.trim();
    const value = parseInt(newHobbyValue.value);
    
    if (name && value > 0) {
        customHobbyData[name] = value;
        saveData();
        renderHobbies();
        newHobbyName.value = '';
        newHobbyValue.value = '';
    }
});

// Add new essentials
addEssentialForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = newEssentialName.value.trim();
    const value = parseInt(newEssentialValue.value);
    
    if (name && value > 0) {
        customEssentialData[name] = value;
        saveData();
        renderEssentials();
        newEssentialName.value = '';
        newEssentialValue.value = '';
    }
});

// Edit item function
window.editItem = function(name, points, type) {
    const card = event.target.closest('.item-card');
    const originalContent = card.innerHTML;
    
    card.innerHTML = `
        <div class="edit-form">
            <input type="text" id="edit-name" value="${name}" required>
            <input type="number" id="edit-points" value="${points}" min="1" required>
            <button onclick="saveEdit('${name}', '${type}', this)">Save</button>
            <button onclick="cancelEdit(this, \`${originalContent.replace(/`/g, '\\`')}\`)">Cancel</button>
        </div>
    `;
};

// Save edit function
window.saveEdit = function(originalName, type, button) {
    const card = button.closest('.item-card');
    const newName = card.querySelector('#edit-name').value.trim();
    const newPoints = parseInt(card.querySelector('#edit-points').value);
    
    if (newName && newPoints > 0) {
        if (type === 'chore') {
            delete customChoreData[originalName];
            customChoreData[newName] = newPoints;
            saveData();
            renderChores();
        } else if (type === 'hobby') {
            delete customHobbyData[originalName];
            customHobbyData[newName] = newPoints;
            saveData();
            renderHobbies();
        } else if (type === 'essential') {
            delete customEssentialData[originalName];
            customEssentialData[newName] = newPoints;
            saveData();
            renderEssentials();
        }
    }
};

// Cancel edit function
window.cancelEdit = function(button, originalContent) {
    const card = button.closest('.item-card');
    card.innerHTML = originalContent;
};

// Delete item function
window.deleteItem = function(name, type) {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
        if (type === 'chore') {
            delete customChoreData[name];
            saveData();
            renderChores();
        } else if (type === 'hobby') {
            delete customHobbyData[name];
            saveData();
            renderHobbies();
        } else if (type === 'essential') {
            delete customEssentialData[name];
            saveData();
            renderEssentials();
        }
    }
};

// Reset to defaults
resetDefaultsBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to reset all chores, hobbies, and essentials to defaults? This will delete all your custom items.')) {
        customChoreData = { ...defaultChoreData };
        customHobbyData = { ...defaultHobbyData };
        customEssentialData = { ...defaultEssentialData };
        saveData();
        renderChores();
        renderHobbies();
        renderEssentials();
    }
});

// Save data to localStorage
function saveData() {
    localStorage.setItem('custom-chore-data', JSON.stringify(customChoreData));
    localStorage.setItem('custom-hobby-data', JSON.stringify(customHobbyData));
    localStorage.setItem('custom-essential-data', JSON.stringify(customEssentialData));
}

// Initialize the page
renderChores();
renderHobbies();
renderEssentials();
