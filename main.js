let Button = document.querySelector(".button");
let doneButton = document.querySelector(".add");
let form = document.getElementById('form');
let currentEditIndex = null; // To keep track of the user being edited
let searchInput = document.getElementById('search');

// Toggle password visibility
document.getElementById('eyePass').addEventListener('click', function () {
    const passwordField = document.getElementById('password');
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
    this.classList.toggle('fa-eye'); 
});

// Toggle form visibility
const toggleFormVisibility = () => {
    form.classList.toggle('hide');
    form.classList.toggle('unhide');
};

Button.addEventListener("click", toggleFormVisibility);
doneButton.addEventListener("click", addData);
doneButton.addEventListener("click", toggleFormVisibility);

// Function to add or update data
function addData(event) {
    event.preventDefault(); // Prevent form submission

    // Get values from fields
    var title = document.getElementById('title').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var username = document.getElementById('username').value;

    if (!title || !email || !password ) {
        alert('Please fill all');
        return; // Exit the function if validation fails
    }
    const userData = {
        title: title,
        email: email,
        password: password,
        username: username,
    };

    let users = JSON.parse(localStorage.getItem('users')) || [];

    if (currentEditIndex !== null) {
        // Update existing user
        users[currentEditIndex] = userData;
        currentEditIndex = null; // Reset the index after editing
    } else {
        // Add new user
        users.push(userData);
    }

    // Store data in localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    // Refresh the table
    refreshTable();

    // Clear the form fields
    document.getElementById('form').reset();
}

// Function to refresh the table
function refreshTable() {
    const ele = document.getElementById('table').getElementsByTagName('tbody')[0];
    ele.innerHTML = ''; // Clear existing rows
    loadUsers(); // Reload users from localStorage
}

// Function to add a row to the table
function addRowToTable(userData, index) {
    const ele = document.getElementById('table').getElementsByTagName('tbody')[0];
    const newRow = ele.insertRow();
    newRow.className = "row";

    // Create action cell with remove and edit buttons
    const actionCell = document.createElement('td');

    // Create remove button
    const remove = document.createElement('button');
    remove.textContent = 'remove';
    remove.classList.add('remove', 'button-1');
    remove.onclick = function() {
        newRow.remove(); // Remove the row
        removeUser (userData); // Remove from localStorage
        refreshTable(); // Refresh the table
    };
    actionCell.appendChild(remove);

    // Create edit button
    const edit = document.createElement('button');
    edit.textContent = 'edit';
    edit.classList.add('edit', 'button-1');
    edit.onclick = function() {
        // Populate the form with the user data for editing
        document.getElementById('title').value = userData.title;
        document.getElementById('email').value = userData.email;
        document.getElementById('password').value = userData.password;
        document.getElementById('username').value = userData.username;

        // Set the current edit index
        currentEditIndex = index;

        // Toggle form visibility
        toggleFormVisibility();
    };
    actionCell.appendChild(edit);

    // Add action cell to the new row
    newRow.appendChild(actionCell);

    // Add cells to the new row
    newRow.insertCell(0).innerText = userData.title;
    newRow.insertCell(1).innerText = userData.email;
    
    const passwordCell = newRow.insertCell(2);
    passwordCell.innerText = '●●●●●●●●'; // Display as dots or stars
    passwordCell.style.cursor = 'pointer'; // Change cursor to pointer
    passwordCell.onclick = function() {
        // Toggle password visibility
        if (passwordCell.innerText === '●●●●●●●●') {
            passwordCell.innerText = userData.password; // Show password
        } else {
            passwordCell.innerText = '●●●●●●●●'; // Hide password
        }
    };
    newRow.insertCell(3).innerText = userData.username;

    // Append the new row to the table
    ele.appendChild(newRow);
}

// Function to remove user data from localStorage
function removeUser (userData) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users = users.filter(user => user.email !== userData.email); // Assuming email is unique
    localStorage.setItem('users', JSON.stringify(users));
}

// Function to load users from localStorage on page load
function loadUsers() {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users.forEach((user, index) => {
        addRowToTable(user, index);
    });
}

searchInput.addEventListener('input', searchUsers);

function searchUsers() {
    const query = searchInput.value.toLowerCase(); // Get the search query
    const users = JSON.parse(localStorage.getItem('users')) || []; // Get users from localStorage

    // Clear the table before displaying filtered results
    const ele = document.getElementById('table').getElementsByTagName('tbody')[0];
    ele.innerHTML = '';

    // Filter users based on the search query
    const filteredUsers = users.filter(user => 
        user.title.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query)
    );

    // Display filtered users
    filteredUsers.forEach((user, index) => {
        addRowToTable(user, index);
    });
}

// Load users when the page loads
window.onload = loadUsers;