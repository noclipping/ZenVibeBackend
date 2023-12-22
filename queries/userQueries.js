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

const updateUser = (req, res) => {
    const userId = parseInt(req.params.id)
    let { username, password_hash, email, original_weight, height, age, goal_weight } = req.params
    const preExistingData = db.pool.query(`SELECT * FROM users WHERE user_id = $1`, [userId])
    if (!username || username.length <= 0) {
        username = preExistingData.rows[0].username
    }
    if (!password_hash || password_hash.length <= 0){
        password_hash = preExistingData.rows[0].password_hash
    }
    if (!email || email.length <= 0){
        email = preExistingData.rows[0].email
    }
    if(!original_weight || original_weight.length <= 0){
        original_weight = preExistingData.rows[0].original_weight
    }
    if (!height || height.length <= 0){
        height = preExistingData.rows[0].height
    }
    if (!age || age.length <= 0){
        age = preExistingData.rows[0].age
    }
    if (!goal_weight || goal_weight <= 0){
        goal_weight = preExistingData.rows[0].goal_weight
    }

}


exports.getUser = getUser
exports.deleteUser = deleteUser
exports.updateUser = updateUser