const db = require('../database')

const getFood = (req, res) => {
    db.pool.query('SELECT * FROM food_entries', (err, result) => {
        console.log(result, 'result from db')
    })
    console.log(req.user, 'imported console log')
    res.send('success')
}

const addFood = async (req, res) => {
    const {food_name, calories, entry_date} = req.body

    if(!food_name || !calories || !entry_date){
        return res.status(400).json({error: 'All fields required.'})
    }

    if(isNaN(calories)){
        return res.status(400).json({ error: 'Calories must be a number.'})
    }

    const result = await db.pool.query(
        "INSERT INTO food_entries (food_name, calories, entry_date) VALUES ($1, $2, $3) RETURNING *",
        [food_name, calories, entry_date]
    )
    res.json(result.rows[0])
}


const deleteFood = (req, res) => {
    const entryId = parseInt(req.params.id)
    db.pool.query(`DELETE FROM food_entries WHERE entry_id = $1`, [entryId], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
}

const updateFood = async (req, res) => {
    
    console.log(req.params, "req.params")
    const { food_name, calories, entry_date } = req.body
    const preExistingData = await db.pool.query(`SELECT * FROM food_entries WHERE entry_id = $1`, [req.params.id])

    const updatedFoodName = food_name || preExistingData.rows[0].food_name
    const updatedCalories = calories || preExistingData.rows[0].calories
    const updatedEntryDate = entry_date || preExistingData.rows[0].entry_date
   
const result = await db.pool.query(
   `UPDATE food_entries SET food_name = $1, calories = $2, entry_date = $3 WHERE entry_id = ${req.params.id} RETURNING *`,
   [updatedFoodName, updatedCalories, updatedEntryDate]

    )
    res.json(result.rows[0])

}

exports.addFood = addFood
exports.getFood = getFood
exports.deleteFood = deleteFood
exports.updateFood = updateFood