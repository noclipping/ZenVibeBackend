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

    const { cups, entry_date } = req.body;

    if(!cups || !entry_date){
        return res.status(400).json({error: 'All fields required.'})
    }

    if(isNaN(cups)){
        return res.status(400).json({ error: 'Cups must be a number.'})
    }

    db.pool.query(
        'INSERT INTO water_intake (cups, entry_date) VALUES ($1, $2) RETURNING *',
        [cups, entry_date],

    const { user_id, cups, entry_date } = req.body;

    db.pool.query(
        'INSERT INTO water_intake (user_id, cups, entry_date) VALUES ($1, $2, $3) RETURNING *',
        [user_id, cups, entry_date],

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
    const entryId = parseInt(req.params.id)


    db.pool.query('DELETE FROM water_intake WHERE entry_id = $1 RETURNING *', [entryId], (error, result) => {
            if (error) {

    db.pool.query(
        'DELETE FROM water_intake WHERE entry_id = $1 RETURNING *',
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


const updateWaterIntake = async (req, res) => {
    const { cups, entry_date } = req.body;
    const preExistingData = await db.pool.query(`SELECT * FROM water_intake WHERE entry_id = $1`, [req.params.id])


    const updatedCups = cups || preExistingData.rows[0].cups
    const updatedEntryDate = entry_date || preExistingData.rows[0].entry_date

    const result = await db.pool.query(
        `UPDATE water_intake SET cups = $1, entry_date = $2 WHERE entry_id = ${req.params.id} RETURNING *`,
        [updatedCups, updatedEntryDate],

const updateWaterIntake = (req, res) => {
    const entryId = req.params.entry_id;
    const { user_id, cups, entry_date } = req.body;

    db.pool.query(
        'UPDATE water_intake SET user_id = $1, cups = $2, entry_date = $3 WHERE entry_id = $4 RETURNING *',
        [user_id, cups, entry_date, entryId],

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