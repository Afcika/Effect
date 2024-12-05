document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed'); // Check if this message is logged

    // Fetch and display users
    fetch('/admin/users')
        .then(response => response.json())
        .then(users => {
            console.log(users); // Check if users data is received
            const tableBody = document.querySelector('#users-table tbody');
            if (!tableBody) {
                console.error('Users table body not found');
                return; // Exit if the table body does not exist
            }
            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>
                        <button onclick="editUser(${user.id}, '${user.name}', '${user.email}', '${user.role}')">Edit</button>
                        <button onclick="deleteUser(${user.id})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching users:', error);
        });

    // Handle user creation form submission
    const createUserForm = document.querySelector('#create-user-form');
    if (createUserForm) {
        createUserForm.addEventListener('submit', (event) => {
            event.preventDefault();
            console.log('Creating user'); // Check if this message is logged

            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData.entries());

            fetch('/admin/users/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.text())
            .then(message => {
                console.log(message); // Check if creation message is received
                document.querySelector('#create-message').textContent = message;
                // Reload users after creation
                fetch('/admin/users')
                    .then(response => response.json())
                    .then(users => {
                        const tableBody = document.querySelector('#users-table tbody');
                        if (tableBody) {
                            tableBody.innerHTML = '';
                            users.forEach(user => {
                                const row = document.createElement('tr');
                                row.innerHTML = `
                                    <td>${user.id}</td>
                                    <td>${user.name}</td>
                                    <td>${user.email}</td>
                                    <td>${user.role}</td>
                                    <td>
                                        <button onclick="editUser(${user.id}, '${user.name}', '${user.email}', '${user.role}')">Edit</button>
                                        <button onclick="deleteUser(${user.id})">Delete</button>
                                    </td>
                                `;
                                tableBody.appendChild(row);
                            });
                        } else {
                            console.error('Users table body not found after user creation');
                        }
                    });
            })
            .catch(error => {
                console.error('Error creating user:', error);
                document.querySelector('#create-message').textContent = 'Error creating user';
            });
        });
    } else {
        console.error('Create user form not found');
    }

    // Handle user edit form submission
    const editUserForm = document.querySelector('#edit-user-form');
    if (editUserForm) {
        editUserForm.addEventListener('submit', (event) => {
            event.preventDefault();
            console.log('Updating user'); // Check if this message is logged

            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData.entries());

            fetch('/admin/users/edit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.text())
            .then(message => {
                console.log(message); // Check if update message is received
                document.querySelector('#update-message').textContent = message;
                // Reload users after update
                fetch('/admin/users')
                    .then(response => response.json())
                    .then(users => {
                        const tableBody = document.querySelector('#users-table tbody');
                        if (tableBody) {
                            tableBody.innerHTML = '';
                            users.forEach(user => {
                                const row = document.createElement('tr');
                                row.innerHTML = `
                                    <td>${user.id}</td>
                                    <td>${user.name}</td>
                                    <td>${user.email}</td>
                                    <td>${user.role}</td>
                                    <td>
                                        <button onclick="editUser(${user.id}, '${user.name}', '${user.email}', '${user.role}')">Edit</button>
                                        <button onclick="deleteUser(${user.id})">Delete</button>
                                    </td>
                                `;
                                tableBody.appendChild(row);
                            });
                        } else {
                            console.error('Users table body not found after user update');
                        }
                    });
            })
            .catch(error => {
                console.error('Error updating user:', error);
                document.querySelector('#update-message').textContent = 'Error updating user';
            });
        });
    } else {
        console.error('Edit user form not found');
    }

    // Show create user form when button is clicked
    const showCreateFormButton = document.querySelector('#show-create-form');
    if (showCreateFormButton) {
        showCreateFormButton.addEventListener('click', () => {
            const createUserFormContainer = document.querySelector('#create-user-form-container');
            if (createUserFormContainer) {
                createUserFormContainer.classList.toggle('hidden');
            } else {
                console.error('Create user form container not found');
            }
        });
    } else {
        console.error('Show create form button not found');
    }
});

// The editUser function remains unchanged
function editUser(id, name, email, role) {
    console.log('Editing user', id); // Check if this message is logged
    const editUserFormContainer = document.querySelector('#edit-user-form-container');
    if (editUserFormContainer) {
        editUserFormContainer.classList.remove('hidden');
        document.querySelector('#user-id').value = id;
        document.querySelector('#user-name').value = name;
        document.querySelector('#user-email').value = email;
        document.querySelector('#user-role').value = role;
    } else {
        console.error('Edit user form container not found');
    }
}

// The deleteUser function remains unchanged
function deleteUser(id) {
    console.log('Deleting user', id); // Check if this message is logged

    // Show the confirmation dialog first
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        // Check if the user confirmed the action
        if (result.isConfirmed) {
            console.log('User confirmed deletion'); // Debug to see if this line is reached

            fetch('/admin/users/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            })
            .then(response => response.text())
            .then(message => {
                // Show success message after deletion
                Swal.fire({
                    title: "Deleted!",
                    text: "The user has been deleted.",
                    icon: "success"
                });

                // Reload users after deletion
                fetch('/admin/users')
                    .then(response => response.json())
                    .then(users => {
                        const tableBody = document.querySelector('#users-table tbody');
                        if (tableBody) {
                            tableBody.innerHTML = ''; // Clear existing users

                            users.forEach(user => {
                                const row = document.createElement('tr');
                                row.innerHTML = `
                                    <td>${user.id}</td>
                                    <td>${user.name}</td>
                                    <td>${user.email}</td>
                                    <td>${user.role}</td>
                                    <td>
                                        <button onclick="editUser(${user.id}, '${user.name}', '${user.email}', '${user.role}')">Edit</button>
                                        <button onclick="deleteUser(${user.id})">Delete</button>
                                    </td>
                                `;
                                tableBody.appendChild(row);
                            });
                        } else {
                            console.error('Users table body not found after user deletion');
                        }
                    });
            })
            .catch(error => {
                console.error('Error deleting user:', error);
            });
        }
    }).catch((error) => {
        console.error('Error showing confirmation dialog:', error);
    });
}
