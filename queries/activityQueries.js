const db = require('../database');

const getActivity = (req, res) => {
    db.pool.query('SELECT * FROM activity_entries', (err, result) => {
        if (err) {
            console.error(err, 'ERROR');
            res.status(500).send('Error retrieving activity entries data');
        } else {
            console.log(result.rows, 'success');
            res.status(200).json(result.rows);
        }
    });
};

const createActivity = (req, res) => {
    const { activity_name, sets, reps, lift_weight, duration, entry_date } = req.body;

    if(!activity_name || !entry_date){
        return res.status(400).json( { error: "All fields required." })
    }

    if(isNaN(sets)){
        return res.status(400).json({ error: 'Sets must be a number.'})
    }

    if(isNaN(reps)){
        return res.status(400).json({ error: 'Reps must be a number.'})
    }

    if(isNaN(lift_weight)){
        return res.status(400).json({ error: 'Weight lifted must be a number.'})
    }

    if(isNaN(duration)){
        return res.status(400).json({ error: 'Duration must be a number.'})
    }
    
    db.pool.query(
        'INSERT INTO activity_entries (activity_name, sets, reps, lift_weight, duration, entry_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [activity_name, sets, reps, lift_weight, duration, entry_date],
        (err, result) => {
            if (err) {
                console.error(err, 'ERROR');
                res.status(500).send('Error recording activity entry');
            } else {
                console.log(result.rows[0], 'success');
                res.status(201).json(result.rows[0]);
            }
        }
    );
};


const deleteActivity = (req, res) => {
    const entryId = parseInt(req.params.id)

    db.pool.query(
        'DELETE FROM activity_entries WHERE entry_id = $1 RETURNING *',
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

const updateActivity = async (req, res) => {
    
    const { activity_name, sets, reps, lift_weight, duration, entry_date } = req.body;
    const preExistingData = await db.pool.query(`SELECT * FROM activity_entries WHERE entry_id = $1`, [req.params.id] )

    const updatedAcitivityName = activity_name || preExistingData.rows[0].activity_name
    const updatedSets = sets || preExistingData.rows[0].sets
    const updatedReps = reps|| preExistingData.rows[0].reps
    const updatedLiftWeight = lift_weight|| preExistingData.rows[0].lift_weight
    const updatedDuration = duration|| preExistingData.rows[0].duration
    const updatedEntryDate = entry_date || preExistingData.rows[0].entry_date


    db.pool.query(
        `UPDATE activity_entries SET activity_name = $1, sets = $2, reps = $3, lift_weight = $4, duration = $5, entry_date = $6 WHERE entry_id = ${req.params.id} RETURNING *`,
        [updatedAcitivityName, updatedSets, updatedReps, updatedLiftWeight, updatedDuration, updatedEntryDate],
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

exports.getActivity = getActivity
exports.createActivity = createActivity;
exports.deleteActivity = deleteActivity;
exports.updateActivity = updateActivity