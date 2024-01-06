const db = require('../database');

const getReminders = (req, res) => {
    const userId = req.params.id

    db.pool.query('SELECT * FROM reminders WHERE user_id = $1', [userId], (err, result) => {

        if (err) {
            console.error(err, 'ERROR');
            res.status(500).send('Error retrieving reminder entries.');
        } else {
            console.log(result.rows, 'Reminder entries displayed.');
            res.status(200).json(result.rows);
            console.log(result.rows)
        }
    });
};

const createReminder = (req, res) => {
  
    const { created_at, status, title, description, reminder_date } = req.body;
    const userId = req.params.id

    if(!created_at || !status || !title || !description || !reminder_date){
        return res.status(400).json({ error: 'All fields required.'})
    }

    db.pool.query(
        'INSERT INTO reminders (user_id, created_at, status, title, description, reminder_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [userId, created_at, status, title, description, reminder_date],

        (err, result) => {
            if (err) {
                console.error(err, 'ERROR');
                res.status(500).send('Error creating reminder entry.');
            } else {
                console.log(result.rows[0], 'Reminder entry added!');
                res.status(201).json(result.rows[0]);
            }
        }
    );
};


const deleteReminder = async (req, res) => {
    try {
        const reminderId = req.params.id
        const userId = req.user.user_id

        const result = await db.pool.query('DELETE FROM reminders WHERE reminder_id = $1 AND user_id = $2 RETURNING *', [reminderId, userId])

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Reminder entry not found.' })
        }

        const deletedWeight = result.rows[0]
        console.log(deletedWeight)
        res.status(200).send('Reminder entry deleted!')

        return deletedWeight
    } catch (error) {
        console.error(error, 'Error deleting reminder entry.')
        throw error
    }
};


const updateReminder = async (req, res) => {
    
    const { created_at, status, title, description, reminder_date } = req.body;
    const preExistingData = await db.pool.query(`SELECT * FROM reminders WHERE reminder_id = $1`, [req.params.id])

    const updatedCreatedAt = created_at || preExistingData.rows[0].created_at
    const updatedStatus = status || preExistingData.rows[0].status
    const updatedTitle = title || preExistingData.rows[0].title
    const updatedDescription = description|| preExistingData.rows[0].description
    const updatedReminderDate = reminder_date || preExistingData.rows[0].reminder_date

    db.pool.query(
        `UPDATE reminders SET created_at = $1, status = $2, title = $3, description = $4, reminder_date = $5 WHERE reminder_id = ${req.params.id} RETURNING *`,
        [updatedCreatedAt, updatedStatus, updatedTitle, updatedDescription, updatedReminderDate], 
        
        (err, result) => {
            if (err) {
                console.error(err, 'ERROR');
                res.status(500).send('Error updating reminder entry.');
            } else {
                console.log(result.rows[0], 'Reminder entry updated!');
                res.status(200).json(result.rows[0]);
            }
        }
    );
};

exports.getReminders = getReminders;
exports.createReminder = createReminder;
exports.deleteReminder = deleteReminder;
exports.updateReminder = updateReminder;