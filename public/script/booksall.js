function loadBooks() {
    fetch('/books/all')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(books => {
            const booksContainer = document.getElementById('book-list-container');
            booksContainer.innerHTML = ''; 

            books.forEach(book => {
                const bookElement = document.createElement('div');
                bookElement.classList.add('book-item');
                bookElement.innerHTML = `
                    <img src="${book.image}" alt="${book.name}" class="book-image">
                    <h4 class="book-author">${book.author}</h4>
                    <h5 class="book-title">${book.name}</h5>
                `;
                bookElement.addEventListener('click', () => {
                    window.location.href = `/books/${book.id}`;
                });
                booksContainer.appendChild(bookElement);
            });
        })
        .catch(error => {
            console.error('Error fetching books:', error);
            const booksContainer = document.getElementById('book-list-container');
            booksContainer.innerHTML = '<p>Error loading books. Please try again later.</p>';
        });
}


document.addEventListener('DOMContentLoaded', function() {
    loadBooks();
    var modalManager = new ModalManager();
    modalManager.initialize();  
});