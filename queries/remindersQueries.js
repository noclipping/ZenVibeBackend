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
    const { title, description, due_date } = req.body;

    db.pool.query(
        'INSERT INTO reminders (title, description, due_date) VALUES ($1, $2, $3) RETURNING *',
        [title, description, due_date],
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
    const { title, description, due_date } = req.body;

    db.pool.query(
        'UPDATE reminders_data SET title = $1, description = $2, due_date = $3 WHERE reminder_id = $4 RETURNING *',
        [title, description, due_date, reminderId],
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