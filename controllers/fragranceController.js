const fragranceService = require('../services/fragranceService');

const deleteFragrance = (req, res) => {
    const { id } = req.body;
    
    if (!id) {
        return res.status(400).send('ID is required');
    }
    
    // Call the deleteFragrance method from fragranceService
    fragranceService.deleteFragrance(id, (error, result) => {
        if (error) {
            console.error('Error deleting fragrance:', error);
            return res.status(500).send('Error deleting fragrance');
        }
        
        // Check if any rows were affected
        if (result.affectedRows === 0) {
            return res.status(404).send('Fragrance not found');
        }
        
        res.send('Fragrance deleted successfully');
    });
};



const getAllFragrances = (req, res) => {
    fragranceService.getAllFragrances((error, results) => {
        if (error) {
            console.error('Error fetching fragrances:', error);
            return res.status(500).send('Error fetching fragrances');
        }
        res.json(results);
    });
};


// const editFragrance = (req, res) => {
//     const { id, title, brand, gender, price } = req.body;
//     const image = req.files && req.files.image ? `/images/${req.files.image[0].filename}` : req.body.image; // Keep existing image if no new file

//     if (!id || !title || !brand || !gender || !price) {
//         return res.status(400).send('All fields are required');
//     }

//     const fragranceData = { id, title, brand, gender, image, price };

//     fragranceService.editFragrance(fragranceData, (error, result) => {
//         if (error) {
//             console.error('Error editing fragrance:', error);
//             return res.status(500).send('Error editing fragrance');
//         }
//         res.send('Fragrance updated successfully');
//     });
// };

const editFragrance = (req, res) => {
    const { id, title, brand, gender, price } = req.body;
    let image = req.body.image; // Keep the existing image path

    // Check if a new image file is uploaded
    if (req.files && req.files.image) {
        image = `/images/${req.files.image[0].filename}`; // Update the image path if a new file is uploaded
    }

    if (!id || !title || !brand || !gender || !price) {
        return res.status(400).send('All fields are required');
    }

    const fragranceData = { id, title, brand, gender, image, price };

    fragranceService.editFragrance(fragranceData, (error, result) => {
        if (error) {
            console.error('Error editing fragrance:', error);
            return res.status(500).send('Error editing fragrance');
        }
        res.send('Fragrance updated successfully');
    });
};



const createFragrance = (req, res) => {
    const { title, brand, gender, price } = req.body;
    const image = req.files && req.files.image ? `/images/${req.files.image[0].filename}` :0;

    const fragranceData = { title, brand, gender, price, image }; 
    console.log('Form Data:', fragranceData); 

    fragranceService.createFragrance(fragranceData, (err, result) => {
        if (err) {
            console.error('Error saving fragrance:', err);
            return res.status(500).send('Error saving fragrance');
        }
        res.send('Fragrance added successfully!');
    });
};


const getMaleFragrances = (req, res) => {
    fragranceService.getMaleFragrances((error, results) => {
        if (error) {
            console.error('Error fetching male fragrances:', error);
            return res.status(500).send('Error fetching male fragrances');
        }
        res.json(results);
    });
};

const getFemaleFragrances = (req, res) => {
    fragranceService.getFemaleFragrances((error, results) => {
        if (error) {
            console.error('Error fetching female fragrances:', error);
            return res.status(500).send('Error fetching female fragrances');
        }
        res.json(results);
    });
};


const getUnisexFragrances = (req, res) => {
    fragranceService.getUnisexFragrances((error, results) => {
        if (error) {
            console.error('Error fetching unisex fragrances:', error);
            return res.status(500).send('Error fetching unisex fragrances');
        }
        res.json(results);
    });
};

const getMaxPrice = (req, res) => {
    fragranceService.getMaxPrice((error, results) => {
        if (error) {
            console.error('Error fetching unisex fragrances:', error);
            return res.status(500).send('Error fetching unisex fragrances');
        }
        res.json(results);
    });
};



const sortByPricesAsc = (req, res) => {
    fragranceService.sortByPricesAsc((error, results) => {
        if (error) {
            console.error('Error sorting by prices in ascending order:', error);
            return res.status(500).send('Error sorting by prices in ascending order');
        }
        res.json(results);
    });
};


const sortByPricesDesc = (req, res) => {
    fragranceService.sortByPricesDesc((error, results) => {
        if (error) {
            console.error('Error sorting by prices in descending order:', error);
            return res.status(500).send('Error sorting by prices in descendig order');
        }
        res.json(results);
    });
};



module.exports = {
    createFragrance,
    getAllFragrances,
    deleteFragrance,
    sortByPricesAsc,
    sortByPricesDesc,
    editFragrance,
    getMaleFragrances,
    getFemaleFragrances,
    getUnisexFragrances,
    getMaxPrice
};