const db = require('../database')
const getUser = (req, res) => {
    db.pool.query('SELECT * FROM users', (err, result) => {
        console.log(result, 'result from db')
    })
    console.log(req.user, 'imported console log')
    res.send('success')
}

const deleteUser = (req, res) => {
    const userId = parseInt(req.params.id)
    db.pool.query(`DELETE FROM users WHERE user_id = $1`, [userId], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
}


const updateUser = async (req, res) => {
    const userId = parseInt(req.params.id)
    console.log(req.params, "req.params")
    const { username, password_hash, email, original_weight, height, age, goal_weight } = req.body
    const preExistingData = await db.pool.query(`SELECT * FROM users WHERE user_id = $1`, [req.params.id])
    
    const updatedUsername = username || preExistingData.rows[0].username;
    const updatedPasswordHash = password_hash || preExistingData.rows[0].password_hash;
    const updatedEmail = email || preExistingData.rows[0].email;
    const updatedOriginalWeight = isNaN(original_weight) ? preExistingData.rows[0].original_weight : Number(original_weight);
    const updatedHeight = isNaN(height) ? preExistingData.rows[0].height : Number(height);
    const updatedAge = isNaN(age) ? preExistingData.rows[0].age : Number(age);
    const updatedGoalWeight = isNaN(goal_weight) ? preExistingData.rows[0].goal_weight : Number(goal_weight);


const result = await db.pool.query(
   `UPDATE users SET username = $1, password_hash = $2, email = $3, original_weight = $4, height = $5, age = $6, goal_weight = $7 WHERE user_id = ${req.params.id} RETURNING *`,
   [updatedUsername, updatedPasswordHash, updatedEmail, updatedOriginalWeight, updatedHeight, updatedAge, updatedGoalWeight]
    // `UPDATE users SET email = $1, original_weight = $2, height = $3, age = $4, goal_weight = $5 WHERE user_id = ${req.params.id} RETURNING *`,
    // [updatedEmail, updatedOriginalWeight, updatedHeight, updatedAge, updatedGoalWeight]

    )
    res.json(result.rows[0])

}


exports.getUser = getUser
exports.deleteUser = deleteUser
exports.updateUser = updateUser