const express = require('express');
const router = express.Router();
const cartController = require('../controllers/fragrance-cart');
const authenticateToken = require('../middleware/userMiddleware');



// router.get('/getAllFragrances', fragranceController.getAllFragrances); //get all
// router.post('/deleteFragrance', fragranceController.deleteFragrance); //delete fragnance
// router.post('/editFragnance', fragranceController.editFragrance); //edit fragnance


// router.post('/addToCart/:fragranceId', cartController.addToCart);
// router.get('/getFromCart',cartController.getFragrancesFromCartByUserId);
//router.post('/deleteFromCart/:fragranceId',cartController.deleteFromCart);


router.post('/addToCart/:fragranceId',authenticateToken, cartController.addToCart);
router.get('/getFromCart', authenticateToken,cartController.getFragrancesFromCartByUserId);
router.post('/deleteFromCart/:fragranceId', authenticateToken, cartController.deleteFromCart);
router.post('/updateQuantity/:fragranceId', authenticateToken, cartController.updateQuantity);






module.exports = router;
