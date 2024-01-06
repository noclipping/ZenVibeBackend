const db = require('../database');

const getWaterIntake = (req, res) => {
    const userId = req.params.id

    db.pool.query('SELECT * FROM water_intake WHERE user_id = $1', [userId], (err, result) => {

        if (err) {
            console.error(err, 'ERROR');
            res.status(500).send('Error retrieving water intake entries.');
        } else {
            console.log(result.rows, 'Water intake entries displayed.');
            res.status(200).json(result.rows);
            console.log(result.rows)
        }
    });
}

const createWaterIntake = (req, res) => {

    const { cups, entry_date } = req.body
    const userId = req.params.id

    if (!cups || !entry_date) {
        return res.status(400).json({ error: 'All fields required.' })
    }

    if (isNaN(cups)) {
        return res.status(400).json({ error: 'Cups must be a number.' })
    }

    db.pool.query('INSERT INTO water_intake (user_id, cups, entry_date) VALUES ($1, $2, $3) RETURNING *', [userId, cups, entry_date], (err, result) => {
        if (err) {
            console.error(err, 'ERROR');
            res.status(500).send('Error recording water intake entry.');
        } else {
            console.log(result.rows[0], 'Water intake entry added!');
            res.status(201).json(result.rows[0]);
        }
    }
    );
};

const deleteWaterIntake = async (req, res) => {
    try {
        const entryId = req.params.id
        const userId = req.user.user_id

        const result = await db.pool.query('DELETE FROM water_intake WHERE entry_id = $1 AND user_id = $2 RETURNING *', [entryId, userId])

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Water intake entry not found.' })
        }

        const deletedWeight = result.rows[0]
        console.log(deletedWeight)
        res.status(200).send('Water intake entry deleted!')

        return deletedWeight
    } catch (error) {
        console.error(error, 'Error deleting water intake entry.')
        throw error
    }
};


const updateWaterIntake = async (req, res) => {
    const { cups, entry_date } = req.body;
    const preExistingData = await db.pool.query(`SELECT * FROM water_intake WHERE entry_id = $1`, [req.params.id])

    const updatedCups = cups || preExistingData.rows[0].cups
    const updatedEntryDate = entry_date || preExistingData.rows[0].entry_date

    const result = await db.pool.query(`UPDATE water_intake SET cups = $1, entry_date = $2 WHERE entry_id = ${req.params.id} RETURNING *`, [updatedCups, updatedEntryDate], (err, result) => {
            if (err) {
                console.error(err, 'ERROR');
                res.status(500).send('Error updating water intake data');
            } else {
                console.log(result.rows[0], 'Water intake entry updated!');
                res.status(200).json(result.rows[0]);
            }
        }
    );

};

exports.getWaterIntake = getWaterIntake;
exports.createWaterIntake = createWaterIntake;
exports.deleteWaterIntake = deleteWaterIntake;
exports.updateWaterIntake = updateWaterIntake;