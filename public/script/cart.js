document.addEventListener('DOMContentLoaded', () => {
getFragrancesFromCart();
});


// Function to fetch fragrances from cart and log the data in the console
const getFragrancesFromCart = async () => {
    try {
        const response = await fetch('/cart/getFromCart', {
            method: 'GET',
            headers: {
                'Content-Type': 'text/html',  // Expecting HTML content, not JSON
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            }
        });

        // Handle the HTML response directly
        const html = await response.text(); // Parse the response as text
        document.body.innerHTML = html;     // Replace the body content with the new HTML
    } catch (error) {
        console.error('Error fetching fragrances from cart:', error);
    }
};




function removeFromCart(fragranceId) {
    // Show a confirmation dialog before deletion
    const confirmed = confirm('Are you sure you want to remove this item from the cart?');

    if (confirmed) {
        fetch(`/cart/deleteFromCart/${fragranceId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getJWTTokenFromCookies()}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Successfully removed item, now refresh or update the UI
                console.log(data.message);
                location.reload(); // Refresh the page to reflect changes
            } else {
                console.error('Error:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}

function getJWTTokenFromCookies() {
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];
    return cookieValue || '';
}



function updateQuantity(fragranceId, change) {
    const quantityInput = document.getElementById(`quantity-${fragranceId}`);
    let currentQuantity = parseInt(quantityInput.value);

    // Update quantity based on the button clicked
    currentQuantity += change;

    // Prevent quantity from going below 1
    if (currentQuantity < 1) {
        currentQuantity = 1;
    }

    // Update the input field with the new quantity
    quantityInput.value = currentQuantity;

    // Send an update request to the server to save the new quantity
    fetch(`/cart/updateQuantity/${fragranceId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: currentQuantity }),
    })
    .then(response => {
        // Check if the response is OK (status 200-299)
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`Server error: ${text}`);
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log('Quantity updated successfully');
        } else {
            console.error('Error updating quantity:', data.message);
        }
    })
    .catch(error => console.error('Error updating quantity:', error));
    updateTotalPrice();
}



function updateTotalPrice() {
    const cartItems = document.querySelectorAll('.cart-table tbody tr');
    let totalPrice = 0;

    cartItems.forEach(row => {
        const price = parseFloat(row.querySelector('td:nth-child(2)').innerText);
        const quantity = parseInt(row.querySelector('input[type="number"]').value);
        totalPrice += price * quantity; // Calculate total
    });

    // Update the total price display
    document.querySelector('.cart-total h3').innerText = `Total Price: ${totalPrice.toFixed(2)} GEL`;
}

