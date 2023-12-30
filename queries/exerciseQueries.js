const db = require('../database');

const getExerciseEntries = (req, res) => {
    db.pool.query('SELECT * FROM exercise_entries', (err, result) => {
        if (err) {
            console.error(err, 'ERROR');
            res.status(500).send('Error retrieving exercise entries data');
        } else {
            console.log(result.rows, 'success');
            res.status(200).json(result.rows);
        }
    });
};

const createExerciseEntry = (req, res) => {
    const { user_id, exercise_name, sets, reps, lift_weight, duration, entry_date } = req.body;

    db.pool.query(
        'INSERT INTO exercise_entries (user_id, exercise_name, sets, reps, lift_weight, duration, entry_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [user_id, exercise_name, sets, reps, lift_weight, duration, entry_date],
        (err, result) => {
            if (err) {
                console.error(err, 'ERROR');
                res.status(500).send('Error recording exercise entry');
            } else {
                console.log(result.rows[0], 'success');
                res.status(201).json(result.rows[0]);
            }
        }
    );
};

const deleteExerciseEntry = (req, res) => {
    const entryId = req.params.entry_id;

    db.pool.query(
        'DELETE FROM exercise_entries WHERE entry_id = $1 RETURNING *',
        [entryId],
        (err, result) => {
            if (err) {
                console.error(err, 'ERROR');
                res.status(500).send('Error deleting exercise entry data');
            } else {
                console.log(result.rows[0], 'success');
                res.status(200).json(result.rows[0]);
            }
        }
    );
};

const updateExerciseEntry = (req, res) => {
    const entryId = req.params.entry_id;
    const { user_id, exercise_name, sets, reps, lift_weight, duration, entry_date } = req.body;

    db.pool.query(
        'UPDATE exercise_entries SET user_id = $1, exercise_name = $2, sets = $3, reps = $4, lift_weight = $5, duration = $6, entry_date = $7 WHERE entry_id = $8 RETURNING *',
        [user_id, exercise_name, sets, reps, lift_weight, duration, entry_date, entryId],
        (err, result) => {
            if (err) {
                console.error(err, 'ERROR');
                res.status(500).send('Error updating exercise entry data');
            } else {
                console.log(result.rows[0], 'success');
                res.status(200).json(result.rows[0]);
            }
        }
    );
};

exports.getExerciseEntries = getExerciseEntries;
exports.createExerciseEntry = createExerciseEntry;
exports.deleteExerciseEntry = deleteExerciseEntry;
exports.updateExerciseEntry = updateExerciseEntry;