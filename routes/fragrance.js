const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fragranceController = require('../controllers/fragranceController');

const fragnancesStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, 'public/images');
        } else {
            cb(new Error('Invalid file type'));
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const uploadFragrance = multer({ storage: fragnancesStorage });


router.get('/getAllFragrances', fragranceController.getAllFragrances); //get all
router.post('/createFragrance', uploadFragrance.fields([{ name: 'image' }]), fragranceController.createFragrance);//add new fragnance
router.post('/deleteFragrance', fragranceController.deleteFragrance); //delete fragnance
router.post('/editFragnance', uploadFragrance.fields([{ name: 'image' }]), fragranceController.editFragrance);



//filter by gender
router.get('/getMaleFragrances', fragranceController.getMaleFragrances);
router.get('/getFemaleFragrances', fragranceController.getFemaleFragrances);
router.get('/getUnisexFragrances', fragranceController.getUnisexFragrances);
router.get('/getMaxPrice', fragranceController.getMaxPrice);
router.get('/sortByPricesAsc', fragranceController.sortByPricesAsc);
router.get('/sortByPricesDesc', fragranceController.sortByPricesDesc);

module.exports = router;
