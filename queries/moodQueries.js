const db = require('../database');


const getMood = (req, res) => {
    db.pool.query('SELECT * FROM mood_tracker', (err, result) => {
        if (err) {
            console.error(err, 'ERROR');
            res.status(500).send('Error retrieving mood entry data');
        } else {
            console.log(result.rows, 'success');
            res.status(200).json(result.rows);
        }
    });
};

const createMood = (req, res) => {
    const { user_id, emotion, intensity, entry_date } = req.body;

    db.pool.query(
        'INSERT INTO mood_tracker (user_id, emotion, intensity, entry_date) VALUES ($1, $2, $3, $4) RETURNING *',
        [user_id, emotion, intensity, entry_date],
        (err, result) => {
            if (err) {
                console.error(err, 'ERROR');
                res.status(500).send('Error recording mood entry');
            } else {
                console.log(result.rows[0], 'success');
                res.status(201).json(result.rows[0]);
            }
        }
    );
};

const deleteMood = (req, res) => {
    const entryId = req.params.entry_id;

    db.pool.query(
        'DELETE FROM mood_tracker WHERE entry_id = $1 RETURNING *',
        [entryId],
        (err, result) => {
            if (err) {
                console.error(err, 'ERROR');
                res.status(500).send('Error deleting mood entry data');
            } else {
                console.log(result.rows[0], 'success');
                res.status(200).json(result.rows[0]);
            }
        }
    );
};

const updateMood = (req, res) => {
    const entryId = req.params.entry_id;
    const { user_id, emotion, intensity, entry_date } = req.body;

    db.pool.query(
        'UPDATE mood_tracker SET user_id = $1, emotion = $2, intensity = $3, entry_date = $4 WHERE entry_id = $5 RETURNING *',
        [user_id, emotion, intensity, entry_date, entryId],
        (err, result) => {
            if (err) {
                console.error(err, 'ERROR');
                res.status(500).send('Error updating mood entry data');
            } else {
                console.log(result.rows[0], 'success');
                res.status(200).json(result.rows[0]);
            }
        }
    );
};

exports.getMood = getMood;
exports.createMood = createMood;
exports.deleteMood = deleteMood;
exports.updateMood = updateMood;