const db = require('../database')

const getFood = (req, res) => {
    const userId = req.params.id

    db.pool.query('SELECT * FROM food_entries WHERE user_id = $1', [userId], (err, result) => {

        if (err) {
            console.error(err, 'ERROR');
            res.status(500).send('Error retrieving food entries.');
        } else {
            console.log(result.rows, 'Food entries displayed.');
            res.status(200).json(result.rows);
            console.log(result.rows)
        }
    });
}

const addFood = async (req, res) => {
    const { food_name, calories, entry_date } = req.body
    const userId = req.params.id

    if (!food_name || !calories || !entry_date) {
        return res.status(400).json({ error: 'All fields required.' })
    }

    if (isNaN(calories)) {
        return res.status(400).json({ error: 'Calories must be a number.' })
    }

    db.pool.query("INSERT INTO food_entries (user_id, food_name, calories, entry_date) VALUES ($1, $2, $3, $4) RETURNING *", [userId, food_name, calories, entry_date], (err, result) => {
        if (err) {
            console.error(err, 'ERROR');
            res.status(500).send('Error creating food entry');
        } else {
            console.log(result.rows[0], 'Food entry added!');
            res.status(201).json(result.rows[0]);
        }
    }
    )
   
}


const deleteFood = async (req, res) => {
    try {
        const entryId = req.params.id
        const userId = req.user.user_id

        const result = await db.pool.query('DELETE FROM food_entries WHERE entry_id = $1 AND user_id = $2 RETURNING *', [entryId, userId])

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Food entry not found.' })
        }

        const deletedWeight = result.rows[0]
        console.log(deletedWeight)
        res.status(200).send('Food entry deleted!')

        return deletedWeight
    } catch (error) {
        console.error(error, 'Error deleting food entry.')
        throw error
    }
}

const updateFood = async (req, res) => {

    const { food_name, calories, entry_date } = req.body
    const preExistingData = await db.pool.query(`SELECT * FROM food_entries WHERE entry_id = $1`, [req.params.id])

    const updatedFoodName = food_name || preExistingData.rows[0].food_name
    const updatedCalories = calories || preExistingData.rows[0].calories
    const updatedEntryDate = entry_date || preExistingData.rows[0].entry_date

    await db.pool.query(`UPDATE food_entries SET food_name = $1, calories = $2, entry_date = $3 WHERE entry_id = ${req.params.id} RETURNING *`,  [updatedFoodName, updatedCalories, updatedEntryDate], (err, result) => {
        if (err) {
            console.error(err, 'ERROR');
            res.status(500).send('Error updating food entry');
        } else {
            console.log(result.rows[0], 'Food entry updated!');
            res.status(200).json(result.rows[0]);
        }
    })

}

exports.addFood = addFood
exports.getFood = getFood
exports.deleteFood = deleteFood
exports.updateFood = updateFood