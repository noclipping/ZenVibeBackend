
const db = require('../database');

const getWeight = (req, res) => {
    const userId = req.params.id

    db.pool.query('SELECT * FROM weight_data WHERE user_id = $1', [userId], (err, result) => {

        if (err) {
            console.error(err, 'ERROR');
            res.status(500).send('Error retrieving weight entries.');
        } else {
            console.log(result.rows, 'Weight entries displayed.');
            res.status(200).json(result.rows);
            console.log(result.rows)
        }
    });
};

const createWeight = (req, res) => {
    const { weight, entry_date } = req.body;
    // const userId = req.user.user_id
    const userId = req.params.id


    if (!weight && !entry_date) {
        console.log(weight, entry_date, "test")
        return res.status(400).json({ error: 'All fields required.' })
        
    }

    if (isNaN(weight)) {
        return res.status(400).json({ error: 'Weight must be a number.' })
    }

    db.pool.query('INSERT INTO weight_data (user_id, weight, entry_date) VALUES ($1, $2, $3) RETURNING *', [userId, weight, entry_date], (err, result) => {
        if (err) {
            console.error(err, 'ERROR');
            res.status(500).send('Error creating weight entry');
        } else {
            console.log(result.rows[0], 'Weight entry added!');
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
        res.status(200).send('Weight entry deleted!')

        return deletedWeight
    } catch (error) {
        console.error(error, 'Error deleting weight entry.')
        throw error
    }
};

//added weight Quieries last weight delete 
const getLatestWeightEntry = async (req, res) => {
    const userId = req.params.id;

    try {
        const result = await db.pool.query('SELECT * FROM weight_data WHERE user_id = $1 ORDER BY entry_date DESC LIMIT 1', [userId]);
        
        if (result.rows.length === 0) {
            res.status(404).send('No weight entries found for this user.');
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving the latest weight entry.');
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
            res.status(500).send('Error updating weight entry');
        } else {
            console.log(result.rows[0], 'Weight entry updated!');
            res.status(200).json(result.rows[0]);
        }
    });

};

exports.getWeight = getWeight;
exports.createWeight = createWeight;
exports.deleteWeight = deleteWeight;
exports.updateWeight = updateWeight;
exports.getLatestWeightEntry = getLatestWeightEntry;