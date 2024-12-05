document.addEventListener('DOMContentLoaded', function () {
    const searchQueryInput = document.getElementById('search-query');
    const bookListContainer = document.getElementById('book-list-container');

    // Debounce function to limit the rate of the search
    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Function to fetch and display search results
    function fetchSearchResults(query) {
        if (query) {
            fetch(`/search/search?query=${encodeURIComponent(query)}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Search failed');
                    }
                    return response.json();
                })
                .then(data => {
                    updateBookList(data);
                })
                .catch(error => {
                    console.error('Error fetching search results:', error);
                    bookListContainer.innerHTML = '<p>Error fetching search results. Please try again.</p>';
                });
        } else {
            // Clear results if the input is empty
            bookListContainer.innerHTML = '';
        }
    }

    // Event listener for input changes with debounce
    searchQueryInput.addEventListener('input', debounce(function () {
        const query = searchQueryInput.value.trim();
        fetchSearchResults(query);
    }, 300)); // Adjust delay as needed (300ms in this case)

    // Function to update the book-list-container with search results
    function updateBookList(results) {
        bookListContainer.innerHTML = '';  // Clear existing books

        if (results.length === 0) {
            bookListContainer.innerHTML = '<p>No results found.</p>';
            return;
        }

        results.forEach(book => {
            const bookItemDiv = document.createElement('div');
            bookItemDiv.classList.add('book-item');

            // Set the inner HTML of the book-item div
            bookItemDiv.innerHTML = `
                <img src="${book.image}" alt="${book.name}" class="book-image">
                <h4 class="book-author">${book.author}</h4>
                <h5 class="book-title">${book.name}</h5>
            `;

            // Add a click event to open the modal
            bookItemDiv.addEventListener('click', () => {
                openBookModal(book);
            });

            // Append the new book-item div to the book-list-container
            bookListContainer.appendChild(bookItemDiv);
        });
    }

    // Function to open the modal with book details
    function openBookModal(book) {
        const modalTitle = document.getElementById('modal-book-title');
        const modalAuthor = document.getElementById('modal-book-author');
        const modalDescription = document.getElementById('modal-book-description');
        const modalStatus = document.getElementById('modal-book-status');
        const bookModal = document.getElementById('book-modal');

        modalTitle.textContent = book.name;
        modalAuthor.textContent = `Author: ${book.author}`;
        modalDescription.textContent = `Description: ${book.description}`;
        modalStatus.textContent = `Status: ${book.status}`;
        bookModal.classList.remove('hidden');  // Show the modal
    }

    // Close modal functionality
    const closeBookModal = document.getElementById('close-book-modal');
    closeBookModal.addEventListener('click', () => {
        const bookModal = document.getElementById('book-modal');
        bookModal.classList.add('hidden');  // Hide the modal
    });
});
