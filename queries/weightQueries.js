
const db = require('../database');

const getWeight = (req, res) => {
    const userId = req.params.id

    db.pool.query('SELECT * FROM weight_data WHERE user_id = $1', [userId], (err, result) => {

        if (err) {
            console.error(err, 'ERROR');
            res.status(500).send('Error retrieving weights');
        } else {
            console.log(result.rows, 'User weight data displayed.');
            res.status(200).json(result.rows);
            console.log(result.rows)
        }
    });
};

const createWeight = (req, res) => {
    const { weight, entry_date } = req.body;
    // const userId = req.user.user_id
    const userId = req.params.id


    if (!weight || !entry_date) {
        return res.status(400).json({ error: 'All fields required.' })
    }

    if (isNaN(weight)) {
        return res.status(400).json({ error: 'Weight must be a number.' })
    }

    db.pool.query('INSERT INTO weight_data (user_id, weight, entry_date) VALUES ($1, $2, $3) RETURNING *', [userId, weight, entry_date], (err, result) => {
        if (err) {
            console.error(err, 'ERROR');
            res.status(500).send('Error creating weight');
        } else {
            console.log(result.rows[0], 'Weight added!');
            res.status(201).json(result.rows[0]);
        }
    });
};

const deleteWeight = async (req, res) => {
    try {
        const entryId = req.params.id
        const userId = req.user.user_id

        const result = await db.pool.query('DELETE FROM weight_data WHERE entry_id = $1 AND user_id = $2 RETURNING *', [entryId, userId])

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Weight entry not found.' })
        }

        const deletedWeight = result.rows[0]
        console.log(deletedWeight)
        res.status(200).send('Weight deleted!')

        return deletedWeight
    } catch (error) {
        console.error(error, 'ERROR deleting weight')
        throw error
    }
};

const updateWeight = async (req, res) => {
    console.log(req.params.id)
    const { weight, entry_date } = req.body;
    const preExistingData = await db.pool.query(`SELECT * FROM weight_data WHERE entry_id = $1`, [req.params.id])

    const udpatedWeight = weight || preExistingData.rows[0].weight
    const updatedEntryDate = entry_date || preExistingData.rows[0].entry_date

    await db.pool.query(`UPDATE weight_data SET weight = $1, entry_date = $2 WHERE entry_id = ${req.params.id} RETURNING *`, [udpatedWeight, updatedEntryDate], (err, result) => {
        if (err) {
            console.error(err, 'ERROR');
            res.status(500).send('Error updating weight');
        } else {
            console.log(result.rows[0], 'Weight updated!');
            res.status(200).json(result.rows[0]);
        }
    });

};

exports.getWeight = getWeight;
exports.createWeight = createWeight;
exports.deleteWeight = deleteWeight;
exports.updateWeight = updateWeight;
