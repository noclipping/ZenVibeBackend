
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
    const { weight, entry_date } = req.body;
    const userId = req.user.user_id

    if(!weight || !entry_date){
        return res.status(400).json({ error: 'All fields required.'})
    }

    if(isNaN(weight)){
        return res.status(400).json({ error: 'Weight must be a number.'})
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

const deleteWeight = (req, res) => {
    const entryId = parseInt(req.params.id)

    db.pool.query('DELETE FROM weight_data WHERE entry_id = $1 RETURNING *', [entryId], (err, result) => {
        if (err) {
            console.error(err, 'ERROR');
            res.status(500).send('Error deleting weight');
        } else {
            console.log(result.rows[0], 'Weight deleted!');
            res.status(200).json(result.rows[0]);
        }
    });
};

const updateWeight = async (req, res) => {
    
    const { weight, entry_date } = req.body;
    const userId = req.params.id
    const preExistingData = await db.pool.query(`SELECT * FROM weight_data WHERE entry_id = $1`, [req.params.id])

    const udpatedWeight = weight || preExistingData.rows[0].weight
    const updatedEntryDate = entry_date || preExistingData.rows[0].entry_date

    await db.pool.query(`UPDATE weight_data SET user_id = $1, weight = $2, entry_date = $3 WHERE entry_id = ${req.params.id} RETURNING *`, [userId, udpatedWeight, updatedEntryDate], (err, result) => {
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
