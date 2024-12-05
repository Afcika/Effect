document.addEventListener('DOMContentLoaded', function() {
    const reserveButtons = document.querySelectorAll('.reserve-btn');
    const burgerBtn = document.getElementById('burger-btn');
    const sidebar = document.getElementById('sidebar');

    burgerBtn.addEventListener('click', function() {
        console.log("Burger button clicked!");
        sidebar.classList.toggle('active');
        console.log(sidebar.classList);
    });

    // Fetch and display reserved books when the page loads
    fetchReservedBooks();

    reserveButtons.forEach(button => {
        button.addEventListener('click', function() {
            const bookId = this.getAttribute('data-book-id');
            reserveBook(bookId);
        });
    });

    function reserveBook(bookId) {
        fetch(`/books/reserve/${bookId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwt')}` // Include the JWT if needed
            },
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.text().then(text => {
                    throw new Error(`Failed to reserve book: ${text}`);
                });
            }
        })
        .then(data => {
            document.getElementById('message').innerText = data.message;
            fetchReservedBooks(); // Refresh the reserved books list after a successful reservation
        })
        .catch(error => {
            document.getElementById('message').innerText = error.message;
        });
    }

    function fetchReservedBooks() {
        fetch('/book/mybook', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            }
        })
        .then(response => response.json())
        .then(data => {
            const reservedBooksList = document.getElementById('reserved-books-list');
            reservedBooksList.innerHTML = '';
            
            if (Array.isArray(data) && data.length > 0) {
                data.forEach(book => {
                    const div = document.createElement('div');
                    div.className = "book-item";
    
                    const img = document.createElement('img');
                    img.src = book.image;
                    img.alt = book.name;
    
                    const title = document.createElement('h4');
                    title.textContent = book.name;
    
                    const author = document.createElement('h5');
                    author.textContent = `by ${book.author}`;
    
                    // Create delete (X) icon
                    const deleteIcon = document.createElement('span');
                    deleteIcon.textContent = 'X'; // You can style this as needed
                    deleteIcon.className = 'delete-icon';
                    deleteIcon.addEventListener('click', (e) => {
                        e.stopPropagation(); // Prevent redirect when clicking on the X icon
                        deleteReservation(book.id);
                    });
    
                    div.appendChild(img);
                    div.appendChild(title);
                    div.appendChild(author);
                    div.appendChild(deleteIcon); // Add the delete icon to the book item
                    div.addEventListener('click', () => {
                        window.location.href = `/books/${book.id}`;
                    });
                    reservedBooksList.appendChild(div);
                });
            } else {
                const div = document.createElement('div');
                div.textContent = 'არ გაქვთ დარეზერვებული წიგნები ';
                reservedBooksList.appendChild(div);
            }
        })
        .catch(error => {
            document.getElementById('message').textContent = 'Error fetching reserved books: ' + error.message;
        });
    }
    
    function deleteReservation(bookId) {
        Swal.fire({
            text: "გნებავთ რეზერვაციის გაუქმება?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'დიახ',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // If the user confirms, proceed with the deletion
                fetch(`/book/reserve/${bookId}`, {
                    method: 'DELETE',
                })
                .then(response => response.json())
                .then(data => {
                    document.getElementById('message').innerText = data.message;
                    fetchReservedBooks(); // Refresh the list after deleting
                    Swal.fire(
                        'წაიშალა',
                        'თქვენი რეზერვაცია წარმატებით წაიშალა',
                    );
                })
                .catch(error => {
                    Swal.fire('Error!', 'There was an error deleting your reservation.', 'error');
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // If the user cancels, show a cancellation message
                Swal.fire(
                    'Cancelled',
                    'Your reservation is safe :)',
                    'info'
                );
            }
        });
    }
    
});
