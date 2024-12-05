const express = require("express");
const { checkRole } = require("../middleware/authMiddleware");
const router = express.Router();
const { isAuthenticated } = require('../middleware/authMiddleware');
const { requestEmailChange, updateEmail } = require('../controllers/auth');
// Public routes
router.get("/", (req, res) => {
    res.render("home");
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/login", (req, res) => {
    res.render("login");
});

// router.get("/admin", checkRole(1), (req, res) => {
//     res.render("admin"); // Admin dashboard or page
// });

router.get("/admin", checkRole(1), (req, res) => {
    res.render("book"); // Books management page
});
router.get("/category", checkRole(1), (req, res) => {
    res.render("category"); // Books management page
});
router.get('/home', (req, res) => {
    res.render('home'); // No need to pass userName directly, it's in res.locals now
});

router.get("/user", (req, res) => {
    res.render("user"); // Admin dashboard or page
});
router.get("/confirm-email", (req, res) => {
    res.render("confirm-email"); 
});
router.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile'); // No need to pass userName directly, it's in res.locals now
});
router.get('/books_page', isAuthenticated, (req, res) => {
    res.render('books_page'); // Remove the leading slash
});
router.get('/search', isAuthenticated, (req, res) => {
    res.render('search_page'); // Remove the leading slash
});
router.get('/mybook',isAuthenticated,  (req, res) => {
    res.render('book_reserve'); // Remove the leading slash
});





module.exports = router;
