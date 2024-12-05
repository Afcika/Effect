document.addEventListener('DOMContentLoaded', () => {
    loadCategories(); // Fetch and display categories on page load

    // Toggle "Create Category" form visibility
    document.querySelector('#show-create-form').addEventListener('click', () => {
        document.querySelector('#create-category-form-container').classList.toggle('hidden');
    });

    // Handle category creation form submission
    document.querySelector('#create-category-form').addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        fetch('/category/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.text())
        .then(message => {
            document.querySelector('#create-message').textContent = message;  // Show success/failure message
            loadCategories();  // Reload the categories after successful creation
            event.target.reset();  // Reset form fields after successful submission
            document.querySelector('#create-category-form-container').classList.add('hidden');  // Hide the form
        })
        .catch(error => console.error('Error creating category:', error));
    });

    // Handle edit form submission
    document.querySelector('#edit-category-form').addEventListener('submit', handleEditFormSubmit);
});

// Function to load and display categories
function loadCategories() {
    fetch('/category/all')  // Route to fetch all categories
        .then(response => response.json())
        .then(categories => {
            const tableBody = document.querySelector('#categories-table tbody');
            tableBody.innerHTML = '';  // Clear the table before adding new rows

            categories.forEach(category => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${category.id}</td>
                    <td>${category.name}</td>
                    <td>
                        <button onclick="populateEditForm(${category.id}, '${category.name}')">Edit</button>
                        <button onclick="deleteCategory(${category.id})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching categories:', error));
}

// Function to populate the edit form with selected category data
function populateEditForm(id, name) {
    document.querySelector('#edit-category-form-container').classList.remove('hidden');  // Show the edit form

    // Set the form fields with the selected category data
    document.querySelector('#category-id').value = id;
    document.querySelector('#category-name').value = name;
}

// Handle edit form submission
function handleEditFormSubmit(event) {
    event.preventDefault();  // Prevent default form submission

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    fetch('/category/edit', {  // Route for editing a category
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error updating category.');
        }
        return response.text();
    })
    .then(message => {
        alert(message);  // Notify user of success
        document.querySelector('#edit-category-form-container').classList.add('hidden');  // Hide the edit form
        loadCategories();  // Reload categories after successful edit
    })
    .catch(error => console.error('Error editing category:', error));
}

// Function to delete a category
function deleteCategory(id) {
    if (confirm('Are you sure you want to delete this category?')) {
        fetch('/category/delete', {  // Route for deleting a category
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })  // Send the ID of the category to delete
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error deleting category.');
            }
            return response.text();
        })
        .then(message => {
            alert(message);  // Notify user of success
            loadCategories();  // Reload categories after deletion
        })
        .catch(error => console.error('Error deleting category:', error));
    }
}
