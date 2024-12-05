// controllers/bookController.js
const bookService = require('../services/bookService');

// Fetch all books
const getAllBooks = (req, res) => {
    bookService.getAllBooks((error, results) => {
        if (error) {
            console.error('Error fetching books:', error);
            return res.status(500).send('Error fetching books');
        }
        res.json(results);
    });
};

// Create a new book
const createBook = (req, res) => {
    const { name, description, status, author, category_id } = req.body;
    const imageUrl = req.files.image ? `/images/${req.files.image[0].filename}` : null;
    //const pdfUrl = req.files.pdf ? `/files/${req.files.pdf[0].filename}` : null;

    const bookData = { name, description, status, author, category_id, imageUrl};
    console.log('Form Data:', bookData); // Debugging purposes

    bookService.createBook(bookData, (err, result) => {
        if (err) {
            console.error('Error saving book:', err);
            return res.status(500).send('Error saving book');
        }
        res.send('Book created successfully!');
    });
};

// Edit an existing book
const editBook = (req, res) => {
    const { id, name, description, status, image, author, category_id } = req.body;

    if (!id || !name || !description || !status || !image || !author || !category_id) {
        return res.status(400).send('All fields are required');
    }

    const bookData = { id, name, description, status, image, author, category_id };
    bookService.editBook(bookData, (error, result) => {
        if (error) {
            console.error('Error editing book:', error);
            return res.status(500).send('Error editing book');
        }
        res.send('Book updated successfully');
    });
};



// Delete a book
const deleteBook = (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).send('ID is required');
    }

    bookService.deleteBook(id, (error, result) => {
        if (error) {
            console.error('Error deleting book:', error);
            return res.status(500).send('Error deleting book');
        }
        res.send('Book deleted successfully');
    });
};

// Fetch all categories
const getAllCategories = (req, res) => {
    bookService.getAllCategories((error, results) => {
        if (error) {
            console.error('Error fetching categories:', error);
            return res.status(500).send('Error fetching categories');
        }
        res.json(results);
    });
};






















//create a new fragrance










// const deleteFragrance = (req, res) => {
//     const { id } = req.body;
    
//     if (!id) {
//         return res.status(400).send('ID is required');
//     }
    
//     // Call the deleteFragrance method from bookService
//     bookService.deleteFragrance(id, (error, result) => {
//         if (error) {
//             console.error('Error deleting fragrance:', error);
//             return res.status(500).send('Error deleting fragrance');
//         }
        
//         // Check if any rows were affected
//         if (result.affectedRows === 0) {
//             return res.status(404).send('Fragrance not found');
//         }
        
//         res.send('Fragrance deleted successfully');
//     });
// };



// const getAllFragrances = (req, res) => {
//     bookService.getAllFragrances((error, results) => {
//         if (error) {
//             console.error('Error fetching fragrances:', error);
//             return res.status(500).send('Error fetching fragrances');
//         }
//         res.json(results);
//     });
// };

// const editFragrance = (req, res) => {
//     const {id,title, brand, image, gender, price  } = req.body;

//     if (!id || !title || !brand || !image || !gender || !price) {
//         return res.status(400).send('All fields are required');
//     }

//     const fragnanceDataData = { id, title, brand, image, gender, price };
//     bookService.editFragnance(fragnanceDataData, (error, result) => {
//         if (error) {
//             console.error('Error editing fragnance:', error);
//             return res.status(500).send('Error editing fragnance');
//         }
//         res.send('fragnance updated successfully');
//     });
// };


// const createFragrance = (req, res) => {
//     const { title, brand, gender, price } = req.body;
//     const image = req.files && req.files.image ? `/images/${req.files.image[0].filename}` :0;

//     const fragranceData = { title, brand, gender, price, image }; 
//     console.log('Form Data:', fragranceData); 

//     bookService.createFragrance(fragranceData, (err, result) => {
//         if (err) {
//             console.error('Error saving fragrance:', err);
//             return res.status(500).send('Error saving fragrance');
//         }
//         res.send('Fragrance added successfully!');
//     });
// };








module.exports = {
    getAllBooks,
    createBook,
    editBook,
    deleteBook,
    getAllCategories,

};
