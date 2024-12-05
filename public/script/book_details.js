document.addEventListener('DOMContentLoaded', () => {
    const reserveButton = document.getElementById('reserveButton');
    const deleteButton = document.getElementById('deleteButton');
    const bookId = reserveButton ? reserveButton.getAttribute('data-book-id') : null;
    const viewBookButton = document.getElementById('viewBookButton');

    // Reserve button functionality
    if (reserveButton) {
        reserveButton.addEventListener('click', async function() {
            try {
                const response = await fetch(`/book/reserve/${bookId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                });

                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'წარმატებით დარეზერვდა!'
                    });
                    reserveButton.style.display = 'none';
                    deleteButton.style.display = 'inline-block';
                } else {
                    const error = await response.json();
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: error.message
                    });
                }
            } catch (err) {
                console.error('Error reserving book:', err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error reserving book'
                });
            }
        });
    }

    // Delete button functionality
    if (deleteButton) {
        deleteButton.addEventListener('click', async function() {
            try {
                const response = await fetch(`/book/reserve/${bookId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                });

                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'წარმატებით გაუქმდა!'
                    });
                    deleteButton.style.display = 'none';
                    reserveButton.style.display = 'inline-block';
                } else {
                    const error = await response.json();
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: error.message
                    });
                }
            } catch (err) {
                console.error('Error deleting reservation:', err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error deleting reservation'
                });
            }
        });
    }

    // View PDF button functionality
    if (viewBookButton) {
        viewBookButton.addEventListener('click', async function () {
            try {
                const response = await fetch(`/books/pdf/${bookId}`);

                if (!response.ok) {
                    throw new Error('Error loading PDF');
                }

                const pdfUrl = await response.url; // Get the URL of the PDF
                
                // Open the PDF in a new tab
                window.open(pdfUrl, '_blank');
            } catch (err) {
                console.error('Error fetching PDF:', err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error fetching PDF'
                });
            }
        });
    }
});
