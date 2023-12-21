const db = require('../database')
const getUser = (req,res)=>{
    db.pool.query('SELECT * FROM users', (err, result) => {
        console.log(result,'result from db')
      })
    console.log(req.user,'imported console log')
    res.send('success')
}

const createUser = (req,res)=>{

}

const deleteUser = (req,res)=>{
    // req.body.user_id === req.params.id
}

const updateUser = (req,res)=>{}


exports.getUser = getUser
exports.createUser = createUser
exports.deleteUser = deleteUser
exports.updateUser = updateUser