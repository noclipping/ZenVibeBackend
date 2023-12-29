const db = require('../database');


const getWaterIntake = (req, res) => {
    db.pool.query('SELECT * FROM water_intake', (err, result) => {
        if (err) {
            console.error(err, 'ERROR');
            res.status(500).send('Error retrieving water intake data');
        } else {
            console.log(result.rows, 'success');
            res.status(200).json(result.rows);
        }
    });
};

const createWaterIntake = (req, res) => {
    const { amount, date } = req.body;

    db.pool.query(
        'INSERT INTO water_intake (amount, date) VALUES ($1, $2) RETURNING *',
        [amount, date],
        (err, result) => {
            if (err) {
                console.error(err, 'ERROR');
                res.status(500).send('Error recording water intake');
            } else {
                console.log(result.rows[0], 'success');
                res.status(201).json(result.rows[0]);
            }
        }
    );
};

const deleteWaterIntake = (req, res) => {
    const intakeId = req.params.entry_id;

    db.pool.query(
        'DELETE FROM water_intake WHERE intake_id = $1 RETURNING *',
        [intakeId],
        (err, result) => {
            if (err) {
                console.error(err, 'ERROR');
                res.status(500).send('Error deleting water intake data');
            } else {
                console.log(result.rows[0], 'success');
                res.status(200).json(result.rows[0]);
            }
        }
    );
};

const updateWaterIntake = (req, res) => {
    const intakeId = req.params.entry_id;
    const { amount, date } = req.body;

    db.pool.query(
        'UPDATE water_intake SET amount = $1, date = $2 WHERE intake_id = $3 RETURNING *',
        [amount, date, intakeId],
        (err, result) => {
            if (err) {
                console.error(err, 'ERROR');
                res.status(500).send('Error updating water intake data');
            } else {
                console.log(result.rows[0], 'success');
                res.status(200).json(result.rows[0]);
            }
        }
    );
};

exports.getWaterIntake = getWaterIntake;
exports.createWaterIntake = createWaterIntake;
exports.deleteWaterIntake = deleteWaterIntake;
exports.updateWaterIntake = updateWaterIntake;