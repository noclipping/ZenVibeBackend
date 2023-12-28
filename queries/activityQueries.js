const db = require('../database')

const getActivity = (req, res) => {
    db.pool.query('SELECT * FROM activity_entries', (err, result) => {
        console.log(result, 'result from db')
    })
    console.log(req.user, 'imported console log')
    res.send('success')
}




exports.getActivity = getActivity