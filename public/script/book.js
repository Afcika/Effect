

function loadFragrances() {
    fetch('/fragrances/getAllFragrances')  // Route to fetch all fragrances
        .then(response => response.json())
        .then(fragrances => {
            console.log('Fragrances fetched:', fragrances); // Log fetched fragrances
            const fragrancesGrid = document.querySelector('#fragrances-grid');
            const tableBody = document.querySelector('#fragrances-table tbody');
            fragrancesGrid.innerHTML = ''; // Clear previous content
            tableBody.innerHTML = ''; // Clear previous table rows

            fragrances.forEach(fragrance => {
                // Create fragrance card
                const fragranceCard = document.createElement('div');
                fragranceCard.classList.add('fragrance-card');


                // Add fragrance card to grid
                

                // Update fragrance list table (if using a table to list fragrances)
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${fragrance.id}</td>
                    <td>${fragrance.title}</td>
                    <td>${fragrance.brand}</td>
                    <td>     <img src="${fragrance.image}" class="fragrance-image"></td>
                    <td>${fragrance.gender}</td>
                    <td>$${fragrance.price}</td>
                    <td>
                        <button onclick='populateEditForm(${fragrance.id}, ${JSON.stringify(fragrance.title)}, ${JSON.stringify(fragrance.brand)}, "${fragrance.gender}", "${fragrance.image}", ${fragrance.price})'>Edit</button>
                        <button onclick="deleteFragrance(${fragrance.id})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching fragrances:', error));
}



function deleteFragrance(id) {
    const confirmDelete = confirm("Are you sure you want to delete this fragrance?"); // Confirm deletion
    if (!confirmDelete) return; // If the user cancels, do nothing

    fetch('/fragrances/deleteFragrance', {
        method: 'POST', // Use POST method
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }), // Send the fragrance ID in the body
    })
        .then(response => {
            if (response.ok) {
                console.log('Fragrance deleted successfully');
                loadFragrances(); // Reload fragrances after deletion
            } else {
                console.error('Error deleting fragrance:', response.statusText);
            }
        })
        .catch(error => console.error('Error deleting fragrance:', error));
}


// Call the loadFragrances function on page load
document.addEventListener('DOMContentLoaded', () => {
    loadFragrances();  // Fetch and display fragrances on page load
});




function populateEditForm(id, title, brand, gender, image, price) {
    // Set the form fields with the fragrance details
    document.getElementById('fragrance-id').value = id;
    document.getElementById('fragrance-title').value = title;
    document.getElementById('fragrance-brand').value = brand;
    document.getElementById('fragrance-gender').value = gender;
    document.getElementById('fragrance-price').value = price;

    // Display the current image in the image preview element
    const imagePreview = document.getElementById('fragrance-image-preview');
    if (imagePreview) {
        imagePreview.src = image; // Set the src to the current image URL
    }

    // Display the edit form
    document.getElementById('edit-fragrance-form').style.display = 'block';
    document.getElementById('overlay').style.display = 'block'; // Show overlay
}


function hideEditForm() {
    // Hide the edit form and overlay
    document.getElementById('edit-fragrance-form').style.display = 'none';
    document.getElementById('overlay').style.display = 'none'; // Hide overlay
}




function updateFragrance() {
    const form = document.getElementById('fragrance-form');
    const formData = new FormData(form);

    // Check if a new image was uploaded, if not, append the current image path
    const imageInput = document.getElementById('fragrance-image');
    if (imageInput.files.length === 0) {
        const currentImage = document.getElementById('fragrance-image-preview').src;
        formData.append('image', currentImage); // Keep the current image
    }

    fetch('/fragrances/editFragnance', {
        method: 'POST',
        body: formData, 
    })
    .then(response => {
        if (response.ok) {
            console.log('Fragrance updated successfully');
            loadFragrances(); // Reload the fragrances after update
            hideEditForm(); // Hide the edit form
        } else {
            console.error('Error updating fragrance:', response.statusText);
        }
    })
    .catch(error => console.error('Error updating fragrance:', error));
}







// Open popup form
function showCreateFragranceForm() {
    document.getElementById('create-fragrance-form-container').style.display = 'block';
}




function addNewFragrance() {
    // Get values from the form
    const title = document.getElementById('create-title').value;
    const brand = document.getElementById('create-brand').value;
    const gender = document.getElementById('create-gender').value;
    const imageInput = document.getElementById('create-image');
    const price = parseFloat(document.getElementById('create-price').value); // Ensure price is a number

    // Prepare form data
    const formData = new FormData();
    formData.append('title', title);
    formData.append('brand', brand);
    formData.append('gender', gender);
    formData.append('price', price);
    formData.append('image', imageInput.files[0]); // Append the image file

    // Send the fragrance data to the server
    fetch('/fragrances/createFragrance', {
        method: 'POST',
        body: formData, // Use FormData instead of JSON
    })
    .then(response => {
        if (response.ok) {
            console.log('Fragrance added successfully');
            loadFragrances(); // Reload the fragrances after addition
            hideCreateForm(); // Hide the form and overlay
        } else {
            console.error('Error adding fragrance:', response.statusText);
        }
    })
    .catch(error => console.error('Error adding fragrance:', error));
}


function showCreateForm() {
    const formContainer = document.getElementById('create-fragrance-form-container');
    const overlay = document.getElementById('overlay');

    formContainer.style.display = 'block'; // Show the form
    overlay.style.display = 'block'; // Show the overlay
}

// Hide the create form and overlay
function hideCreateForm() {
    const formContainer = document.getElementById('create-fragrance-form-container');
    const overlay = document.getElementById('overlay');

    formContainer.style.display = 'none'; // Hide the form
    overlay.style.display = 'none'; // Hide the overlay
}

// Add event listener to show the form when clicking the link
document.getElementById('show-create-form').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default link behavior
    showCreateForm();
});