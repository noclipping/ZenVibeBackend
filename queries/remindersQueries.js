const db = require('../database');

const getReminders = (req, res) => {
    db.pool.query('SELECT * FROM reminders', (err, result) => {
        if (err) {
            console.error(err, 'ERROR');
            res.status(500).send('Error retrieving reminders');
        } else {
            console.log(result.rows, 'success');
            res.status(200).json(result.rows);
        }
    });
};

const createReminder = (req, res) => {
    const { created_at, status, title, description, reminder_date } = req.body;

    if(!created_at || !status || !title || !description || !reminder_date){
        return res.status(400).json({ error: 'All fields required.'})
    }

    db.pool.query(
        'INSERT INTO reminders (created_at, status, title, description, reminder_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [created_at, status, title, description, reminder_date],
        (err, result) => {
            if (err) {
                console.error(err, 'ERROR');
                res.status(500).send('Error creating reminder');
            } else {
                console.log(result.rows[0], 'success');
                res.status(201).json(result.rows[0]);
            }
        }
    );
};


const deleteReminder = (req, res) => {
    const reminderId = parseInt(req.params.id)

    db.pool.query('DELETE FROM reminders WHERE reminder_id = $1 RETURNING *', [reminderId], (error, results) => {
           if (error) {
                console.error(error, 'ERROR');
                res.status(500).send('Error deleting reminder');
            } else {
                console.log(results.rows[0], 'success');
                res.status(200).json(results.rows);
            }
        }
    );
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
                res.status(500).send('Error updating reminder');
            } else {
                console.log(result.rows[0], 'success');
                res.status(200).json(result.rows[0]);
            }
        }
    );
};

exports.getReminders = getReminders;
exports.createReminder = createReminder;
exports.deleteReminder = deleteReminder;
exports.updateReminder = updateReminder;