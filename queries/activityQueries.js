const db = require('../database');

const getActivity = (req, res) => {
    const userId = req.params.id

    db.pool.query('SELECT * FROM activity_entries WHERE user_id = $1', [userId], (err, result) => {

        if (err) {
            console.error(err, 'ERROR');
            res.status(500).send('Error retrieving activity entries.');
        } else {
            console.log(result.rows, 'Activity entries displayed.');
            res.status(200).json(result.rows);
            console.log(result.rows)
        }
    });
};

const createActivity = (req, res) => {
    const { activity_name, sets, reps, lift_weight, duration, entry_date } = req.body
    const userId = req.params.id

    if(!activity_name || !entry_date){
        return res.status(400).json( { error: "This field is required." })
    }

    if(sets !== undefined && isNaN(sets)){
        return res.status(400).json({ error: 'Sets must be a number.'})
    }

    if(reps !== undefined && isNaN(reps)){
        return res.status(400).json({ error: 'Reps must be a number.'})
    }

    if(lift_weight !== undefined && isNaN(lift_weight)){
        return res.status(400).json({ error: 'Weight lifted must be a number.'})
    }

    if(duration !== undefined && isNaN(duration)){
        return res.status(400).json({ error: 'Duration must be a number.'})
    }
    
    db.pool.query(
        'INSERT INTO activity_entries (user_id, activity_name, sets, reps, lift_weight, duration, entry_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [userId, activity_name, sets, reps, lift_weight, duration, entry_date],
        (err, result) => {
            if (err) {
                console.error(err, 'ERROR');
                res.status(500).send('Error recording activity entry.');
            } else {
                console.log(result.rows[0], 'Activity entry added!');
                res.status(201).json(result.rows[0]);
            }
        }
    );
};


const deleteActivity = async (req, res) => {
    try {
        const entryId = req.params.id
        const userId = req.user.user_id

        const result = await db.pool.query('DELETE FROM activity_entries WHERE entry_id = $1 AND user_id = $2 RETURNING *', [entryId, userId])

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Activity entry not found.' })
        }

        const deletedWeight = result.rows[0]
        console.log(deletedWeight)
        res.status(200).send('Activity entry deleted!')

        return deletedWeight
    } catch (error) {
        console.error(error, 'Error deleting activity entry.')
        throw error
    }
};

const updateActivity = async (req, res) => {
    
    const { activity_name, sets, reps, lift_weight, duration, entry_date } = req.body;
    const preExistingData = await db.pool.query(`SELECT * FROM activity_entries WHERE entry_id = $1`, [req.params.id] )

    if(preExistingData.rows.length === 0){
        return res.status(404).json({ error: "Activity entry does not exist."})
    }

    const updatedActivityName = activity_name || preExistingData.rows[0].activity_name
    const updatedSets = sets || preExistingData.rows[0].sets
    const updatedReps = reps|| preExistingData.rows[0].reps
    const updatedLiftWeight = lift_weight|| preExistingData.rows[0].lift_weight
    const updatedDuration = duration|| preExistingData.rows[0].duration
    const updatedEntryDate = entry_date || preExistingData.rows[0].entry_date


    db.pool.query(
        `UPDATE activity_entries SET activity_name = $1, sets = $2, reps = $3, lift_weight = $4, duration = $5, entry_date = $6 WHERE entry_id = ${req.params.id} RETURNING *`,
        [updatedActivityName, updatedSets, updatedReps, updatedLiftWeight, updatedDuration, updatedEntryDate],
        (err, result) => {
            if (err) {
                console.error(err, 'ERROR');
                res.status(500).send('Error updating activity entry.');
            } else {
                console.log(result.rows[0], 'Activity entry updated!');
                res.status(200).json(result.rows[0]);
            }
        }
    );
};

exports.getActivity = getActivity
exports.createActivity = createActivity;
exports.deleteActivity = deleteActivity;
exports.updateActivity = updateActivity