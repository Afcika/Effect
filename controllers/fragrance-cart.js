// controllers/reservationController.js
const cartService = require('../services/fragrance-cart');

// Get fragrance from cart by user ID
const getFragrancesFromCartByUserId = (req, res) => {
    const userId = req.user.id;

    cartService.getReservedFragranceByUserId(userId, (err, data) => {
        if (err) {
            console.error('Error fetching fragrance from cart:', err);
            return res.status(500).render('cart', { error: 'Error fetching fragrance from cart' });
        }

        if (!data.fragrances || data.fragrances.length === 0) {
            // Rendering the empty cart view if there are no fragrances
            return res.render('cart', { emptyCart: true });
        }

        // Render the cart view with fragrance data and total price
        return res.render('cart', {
            fragrances: data.fragrances,
            total_price: data.total_price
        });
    });
};




//Add fragrance to the cart
const addToCart = (req, res) => {
    const userId = req.user.id;
    //const userId = req.body.userId;
    const fragranceId = req.params.fragranceId;

    cartService.getUserReservationLimitAndCount(userId, (err, result) => {
        if (err) {
            console.error('Error fetching user data:', err);
            return res.status(500).json({ success: false, message: 'Error fetching user data.' });
        }

        const user = result[0];
        const reservationLimit = user.reservation_limit;
        const reservationCount = user.reservation_count;

        // Check if the user has reached their reservation limit
        if (reservationCount >= reservationLimit) {
            return res.status(400).json({ success: false, message: `You cannot add to cart more than ${reservationLimit} fragrances.` });
        }


        // Check if the user has already reserved this book
        cartService.checkExistingFragrance(userId, fragranceId, (err, results) => {
            if (err) {
                console.error('Error checking existing items in cart:', err);
                return res.status(500).json({ success: false, message: 'Error checking existing items in caart.' });
            }

            if (results.length > 0) {
                return res.status(400).json({ success: false, message: 'You have already added this fragrance in cart' });
            }

            // Create the reservation
            cartService.addToCart(userId, fragranceId, (err) => {
                if (err) {
                    console.error('Error adding fragrance to cart:', err);
                    return res.status(500).json({ success: false, message: 'Error adding fragrance in cart.' });
                }
                return res.json({ success: true, message: 'Fragrance added to cart successfully!' });
            });
        });
    });
};


// Delete fragrance from the cart
// const deleteFromCart = (req, res) => {

//     // const userId = req.user.id;
//     // const fragranceId = req.params.fragranceId;


//     const userId = req.body.userId;
//     const fragranceId = req.params.fragranceId;

//     cartService.deleteFromCart(userId, fragranceId, (err, result) => {
//         if (err) {
//             console.error('Error deleting from cart:', err);
//             return res.status(500).json({ success: false, message: 'Error deleting from cart.' });
//         }

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ success: false, message: 'No item found to delete.' });
//         }

//         return res.json({ success: true, message: 'successfully removed from cart' });
//     });
// };


const deleteFromCart = (req, res) => {
    // Use the user ID from the JWT token
    const userId = req.user.id;
    const fragranceId = req.params.fragranceId;

    cartService.deleteFromCart(userId, fragranceId, (err, result) => {
        if (err) {
            console.error('Error deleting from cart:', err);
            return res.status(500).json({ success: false, message: 'Error deleting from cart.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'No item found to delete.' });
        }

        return res.json({ success: true, message: 'Successfully removed from cart' });
    });
};


// cartController.js
const updateQuantity = (req, res) => {
    const userId = req.user.id; // Get the user ID from the JWT token
    const fragranceId = req.params.fragranceId; // Get fragrance ID from the route parameter
    const { quantity } = req.body; // Get quantity from the request body

    cartService.updateQuantityInCart(userId, fragranceId, quantity, (err, result) => {
        if (err) {
            console.error('Error updating quantity in cart:', err);
            return res.status(500).json({ success: false, message: 'Error updating quantity in cart.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'No item found to update.' });
        }

        return res.json({ success: true, message: 'Successfully updated quantity in cart' });
    });
};


module.exports = {
    getFragrancesFromCartByUserId,
    addToCart,
    deleteFromCart,
    updateQuantity
};
