const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('contactus', { title: 'contactus' });
});

module.exports = router;
