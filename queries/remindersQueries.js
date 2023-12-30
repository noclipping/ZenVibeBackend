const db = require('../database');

const getReminders = (req, res) => {
    db.pool.query('SELECT * FROM reminders', (err, result) => {
        if (err) {
            console.error(err, 'ERROR');
            res.status(500).send('Error retrieving reminders data');
        } else {
            console.log(result.rows, 'success');
            res.status(200).json(result.rows);
        }
    });
};

const createReminder = (req, res) => {
    const { user_id, created_at, status, title, description, reminder_date } = req.body;

    db.pool.query(
        'INSERT INTO reminders (user_id, created_at, status, title, description, reminder_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [user_id, created_at, status, title, description, reminder_date],
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
    const reminderId = req.params.reminder_id;

    db.pool.query(
        'DELETE FROM reminders WHERE reminder_id = $1 RETURNING *',
        [reminderId],
        (err, result) => {
            if (err) {
                console.error(err, 'ERROR');
                res.status(500).send('Error deleting reminder');
            } else {
                console.log(result.rows[0], 'success');
                res.status(200).json(result.rows[0]);
            }
        }
    );
};

const updateReminder = (req, res) => {
    const reminderId = req.params.reminder_id;
    const { user_id, created_at, status, title, description, reminder_date } = req.body;

    db.pool.query(
        'UPDATE reminders SET user_id = $1, created_at = $2, status = $3, title = $4, description = $5, reminder_date = $6 WHERE reminder_id = $7 RETURNING *',
        [user_id, created_at, status, title, description, reminder_date, reminderId],
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