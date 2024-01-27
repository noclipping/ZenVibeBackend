const db = require("../database");
const getUser = (req, res) => {
  const userId = parseInt(req.params.id);
  console.log(getUser);

  db.pool.query(
    "SELECT * FROM users WHERE user_id = $1",
    [userId],
    (err, result) => {
      res.status(200).json(result.rows[0]);
      console.log(result.rows, "result from db");
      console.log(err);
    }
  );
};

const deleteUser = (req, res) => {
  const userId = parseInt(req.params.id);
  db.pool.query(
    `DELETE FROM users WHERE user_id = $1`,
    [userId],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

//FIX THIS
const updateUser = async (req, res) => {
    // const userId = parseInt(req.params.id)
    console.log(req.params, "req.params")
    const { username, password_hash, email, original_weight, feet, inches, height_inches, age, gender, activity_level, goal_weight } = req.body
    const preExistingData = await db.pool.query(`SELECT * FROM users WHERE user_id = $1`, [req.params.id])

    const updatedUsername = username || preExistingData.rows[0].username;
    const updatedPasswordHash = password_hash || preExistingData.rows[0].password_hash;
    const updatedEmail = email || preExistingData.rows[0].email;
    const updatedOriginalWeight = isNaN(original_weight) ? preExistingData.rows[0].original_weight : Number(original_weight);
    const updatedFeet = isNaN(feet) ? preExistingData.rows[0].feet : Number(feet);
    const updatedInches = isNaN(inches) ? preExistingData.rows[0].inches : Number(inches);
    const updatedHeightInches = isNaN(height_inches) ? preExistingData.rows[0].height_inches : Number(height_inches);
    const updatedAge = isNaN(age) ? preExistingData.rows[0].age : Number(age);
    const updatedGender = gender || preExistingData.rows[0].gender;
    const updatedActivityLevel = activity_level || preExistingData.rows[0].activity_level
    const updatedGoalWeight = isNaN(goal_weight) ? preExistingData.rows[0].goal_weight : Number(goal_weight);

const result = await db.pool.query(
   `UPDATE users SET username = $1, password_hash = $2, email = $3, original_weight = $4, feet = $5, inches = $6, height_inches = $7, age = $8, gender = $9, activity_level = $10, goal_weight = $11 WHERE user_id = ${req.params.id} RETURNING *`,
   [updatedUsername, updatedPasswordHash, updatedEmail, updatedOriginalWeight, updatedFeet, updatedInches, updatedHeightInches, updatedAge, updatedGender, updatedActivityLevel, updatedGoalWeight]
    )
    res.json(result.rows[0])

}

exports.getUser = getUser;
exports.deleteUser = deleteUser;
exports.updateUser = updateUser
