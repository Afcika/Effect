const db = require('../db/db');

const getAllFragrances = (callback) => {
    const query = `SELECT * FROM fragrances`;
    db.query(query, callback);
};

const deleteFragrance = (id, callback) => {
    const query = `DELETE FROM fragrances WHERE id = ?`;
    db.query(query, [id], callback);
};



const createFragrance = (fragranceData, callback) => {
    const { title, brand, image, gender, price } = fragranceData;
    const query = `INSERT INTO fragrances (title, brand, image, gender, price) VALUES (?, ?, ?, ?, ?)`;
    const values = [title, brand, image, gender, price, ];
    db.query(query, values, callback);
};


const editFragrance = (fragranceData, callback) => {
    const { id, title, brand, image, gender, price } = fragranceData;
    const query = `UPDATE fragrances SET title = ?, brand = ?,  image = ?, gender = ?, price = ? WHERE id = ?`;
    const values = [title,brand, image, gender, price,id];
    db.query(query, values, callback);
};


const getMaleFragrances = (callback) => {
    const query = `SELECT * FROM fragrances where gender='M'`;
    db.query(query, callback);
};

const getFemaleFragrances = (callback) => {
    const query = `SELECT * FROM fragrances where gender='F'`;
    db.query(query, callback);
};


const getUnisexFragrances = (callback) => {
    const query = `SELECT * FROM fragrances where gender='U'`;
    db.query(query, callback);
};


const getMaxPrice = (callback) => {
    const query = `SELECT MAX(price) AS max_price FROM fragrances`;
    db.query(query, callback);
};

const sortByPricesAsc=(callback) =>{
    const query=`select * from fragrances order by price`;
    db.query(query, callback);
}

const sortByPricesDesc=(callback) =>{
    const query=`select * from fragrances order by price desc`;
    db.query(query, callback);
}



module.exports = {
    createFragrance,
    getAllFragrances,
    deleteFragrance,
    editFragrance,
    getMaleFragrances,
    getFemaleFragrances,
    getUnisexFragrances,
    sortByPricesDesc,
    sortByPricesAsc,
    getMaxPrice
};
