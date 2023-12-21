const db = require('../database');

const getWeight = (req, res) => {
    db.pool.query('SELECT * FROM weights', (err, result) => {
        if (err) {
            console.error(err, 'ERROR');
            res.status(500).send('Error retrieving weights');
        } else {
            console.log(result, 'success');
            res.status(200).json(result.rows);
        }
    });
};

const createWeight = (req, res) => {
    console.log(req.body.weight, 'imported console log');
    
    res.status(201).send('Weight created successfully');
};

const deleteWeight = (req, res) => {
    console.log(req.params.user_id, 'deleted console log'); 
    
    res.status(200).send('Weight deleted successfully');
};

const updateWeight = (req, res) => {
    console.log(req.params.user_id, 'updated console log');
    
    res.status(200).send('Weight updated successfully');
};

exports.getWeight = getWeight;
exports.createWeight = createWeight;
exports.deleteWeight = deleteWeight;
exports.updateWeight = updateWeight;