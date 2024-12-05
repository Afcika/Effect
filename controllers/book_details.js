// controllers/bookController.js
const path = require('path');
const bookService = require('../services/book_details');

// Get book details with reservation status
const getBookDetails = (req, res) => {
    const bookId = req.params.id;
    const userId = req.user.id;

    bookService.getBookById(bookId, userId, (error, results) => {
        if (error) {
            console.error('Error fetching book details:', error);
            return res.status(500).send('Error fetching book details');
        }

        if (results.length === 0) {
            return res.status(404).send('Book not found');
        }

        res.render('book-details', { book: results[0], is_reserved: results[0].is_reserved });
    });
};

// Get PDF of a book by its ID
const getBookPdf = (req, res) => {
    const bookId = req.params.id;

    bookService.getBookPdfById(bookId, (error, results) => {
        if (error) {
            console.error('Error fetching PDF URL:', error);
            return res.status(500).send('Error fetching PDF URL');
        }

        if (results.length === 0 || !results[0].pdf_url) {
            return res.status(404).send('PDF not found');
        }

        const pdfPath = results[0].pdf_url;
        const filePath = path.join(__dirname, '../public', pdfPath); 

        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Error sending PDF file:', err);
                return res.status(500).send('Error sending PDF file');
            }
        });
    });
};

module.exports = {
    getBookDetails,
    getBookPdf
};
