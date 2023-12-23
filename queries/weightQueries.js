const db = require('../database');

const getWeight = (req, res) => {
    db.pool.query('SELECT * FROM weight_data', (err, result) => {
        if (err) {
            console.error(err, 'ERROR');
            res.status(500).send('Error retrieving weights');
        } else {
            console.log(result.rows, 'success');
            res.status(200).json(result.rows);
        }
    });
};

const createWeight = (req, res) => {
    const { weight } = req.body;

    db.pool.query('INSERT INTO weight_data (weight) VALUES ($1) RETURNING *', [weight], (err, result) => {
        if (err) {
            console.error(err, 'ERROR');
            res.status(500).send('Error creating weight');
        } else {
            console.log(result.rows[0], 'success');
            res.status(201).json(result.rows[0]);
        }
    });
};

const deleteWeight = (req, res) => {
    const userId = req.params.user_id;

    db.pool.query('DELETE FROM weight_data WHERE user_id = $1 RETURNING *', [userId], (err, result) => {
        if (err) {
            console.error(err, 'ERROR');
            res.status(500).send('Error deleting weight');
        } else {
            console.log(result.rows[0], 'success');
            res.status(200).json(result.rows[0]);
        }
    });
};

const updateWeight = (req, res) => {
    const userId = req.params.user_id;
    const { weight } = req.body;

    db.pool.query('UPDATE weight_data SET weight = $1 WHERE user_id = $2 RETURNING *', [weight, userId], (err, result) => {
        if (err) {
            console.error(err, 'ERROR');
            res.status(500).send('Error updating weight');
        } else {
            console.log(result.rows[0], 'success');
            res.status(200).json(result.rows[0]);
        }
    });
};

exports.getWeight = getWeight;
exports.createWeight = createWeight;
exports.deleteWeight = deleteWeight;
exports.updateWeight = updateWeight;
