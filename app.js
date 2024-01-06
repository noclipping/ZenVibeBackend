const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { Client } = require('pg');
const { Strategy, ExtractJwt } = require('passport-jwt');
require('dotenv').config()
const user = require('./queries/userQueries.js')
const food = require('./queries/foodEntryQueries.js')
const db = require('./database.js')
const client = db.pool
const weight = require('./queries/weightQueries.js')
const reminders = require('./queries/remindersQueries.js')
const water = require('./queries/waterQueries.js')
const activity = require('./queries/activityQueries.js')
const app = express()
const port = 3000



passport.use(new LocalStrategy(
  (username, password, done) => {

    client.query('SELECT * FROM users WHERE username = $1', [username], (err, result) => {
      if (err) {
        return done(err)
      }

      const user = result.rows[0];
      if (!user || !bcrypt.compareSync(password, user.password_hash)) {
        return done(null, false)
      }
      return done(null, user);
    })
  }
))

passport.use('jwt', new Strategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  },
  (jwtPayload, done) => {
    // Log the extracted token
    const token = ExtractJwt.fromAuthHeaderAsBearerToken();
    console.log('Extracted Token:', token);

    console.log('JWT Payload:', jwtPayload); // Log the payload
    client.query('SELECT * FROM users where user_id = $1', [jwtPayload.sub.user_id], (err, result) => {
      if (err) {
        return done(err, false);
      }

      const user = result.rows[0];

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }
));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

function checkAuthorization(req, res, next) {
  console.log((req.params.id), typeof (req.user.user_id))
  if (Number(req.params.id) !== Number(req.user.user_id)) {
    return res.status(403).json({ error: "Unauthorized user." })
  }
  next()
}

async function deleteUpdateAuthorization(req, res, next, tableName) {
  const entryId = req.params.id
  const userId = req.user.user_id
  // const userId = 5
  
  const result = await db.pool.query(`SELECT entry_id FROM ${tableName} WHERE entry_id = $1 AND user_id = $2`, [entryId, userId])
  
  console.log(userId, "THIS")
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Entry not found.' });
  }
  next()
//WORKS BUT PROCESSING IN THUNDERCLIENT RUNS INDEFINITELY
//HOW TO VERIFY THAT THIS USER CANNOT MODIFY ANOTHER'S DATA
}

// async function deleteAndUpdateAuthorization(req, res, next, tableName) {
//   try {
//     const entryId = req.params.id;
//     const userId = req.user.user_id;

//     const result = await db.pool.query(`SELECT user_id FROM ${tableName} WHERE entry_id = $1`, [entryId]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'Entry not found.' });
//     }

//     const entryUserId = result.rows[0].user_id;


//     if (Number(userId) !== Number(entryUserId)) {
//       return res.status(403).json({ error: 'Unauthorized user.' });
//     }

//     next();
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

//check that user id in entry (requesat user id), matches the user_id of entry, once we have tHE entry --> update/delete
app.post('/register', (req, res) => {

  let username = req.body.username;
  let requestedPassword = req.body.password_hash;
  let email = req.body.email
  let original_weight = req.body.original_weight
  let feet = req.body.feet
  let inches = req.body.inches
  let height_inches = (feet * 12) + inches
  let age = req.body.age
  let goal_weight = req.body.goal_weight

  // Check if username is already taken
  client.query('SELECT * FROM users WHERE username = $1', [username], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    if (result.rows.length > 0) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    if (!username || !requestedPassword || !email || !original_weight || !feet || !inches || !height_inches || !age || !goal_weight) {
      return res.status(400).json({ error: 'All fields required.' })
    }

    // If username is available, hash the password and create the user
    const hashedPassword = bcrypt.hashSync(requestedPassword, 10);
    console.log(hashedPassword, "hashed")



    client.query('INSERT INTO users (username, password_hash, email, original_weight, feet, inches, height_inches, age, goal_weight) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING user_id',

      [username, hashedPassword, email, original_weight, feet, inches, height_inches, age, goal_weight], (err, result) => {
        if (err) {
          console.log(err, 'err')

          return res.status(500).json({ error: 'Internal Server Error' });
        }

        const user = result.rows[0]
        const token = jwt.sign({ sub: user }, process.env.JWT_SECRET);
        res.json({ token });
      });
  });
});


app.post('/login',
  passport.authenticate('local', { session: false }), (req, res) => {

    console.log(`Welcome, ${req.user.username}!`);

    const token = jwt.sign({ sub: req.user }, process.env.JWT_SECRET);
    res.json({ token });
  });


app.get('/user/:id',
  passport.authenticate('jwt', { session: false }),
  checkAuthorization,
  (req, res) => { user.getUser(req, res) })

app.delete('/user/:id',
  passport.authenticate('jwt', { session: false }),
  checkAuthorization,
  (req, res) => { user.deleteUser(req, res) })

app.put('/user/:id',
  passport.authenticate('jwt', { session: false }),
  checkAuthorization,
  (req, res) => { user.updateUser(req, res) })



app.post('/weight/:id',
  passport.authenticate('jwt', { session: false }),
  checkAuthorization,
  (req, res) => { weight.createWeight(req, res) })

app.get('/weight/:id',
  passport.authenticate('jwt', { session: false }),
  deleteUpdateAuthorization,
  (req, res) => { weight.getWeight(req, res) })

app.delete('/weight/:id',
  passport.authenticate('jwt', { session: false }),
  // checkAuthorization,
  deleteUpdateAuthorization,
  (req, res) => { weight.deleteWeight(req, res) })

// app.delete('/weight/:id',
//   passport.authenticate('jwt', { session: false }),
//   async (req, res) => {
//     try {

//       await deleteAndUpdateAuthorization(req, res, () => { }, 'weight_data');

//       const deletedWeight = await weight.deleteWeight(req, res);

//       } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   }
// );

// app.put('/weight/:id',
//   passport.authenticate('jwt', { session: false }),
//   async (req, res) => {
//     try {
//       // Use the generic middleware to check authorization and update for the weight_data table
//       await deleteAndUpdateAuthorization(req, res, () => {}, 'weight_data');
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   }
// );




app.put('/weight/:id',
  passport.authenticate('jwt', { session: false }),
  deleteUpdateAuthorization,
  (req, res) => { weight.updateWeight(req, res) })

//WORKS FOR UPDATE


app.post('/food',
  passport.authenticate('jwt', { session: false }),
  (req, res) => { food.addFood(req, res) })

app.get('/food',
  passport.authenticate('jwt', { session: false }),
  (req, res) => { food.getFood(req, res) })

app.delete('/food/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => { food.deleteFood(req, res) })

app.put('/food/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => { food.updateFood(req, res) })



app.get('/reminders',
  passport.authenticate('jwt', { session: false }),
  (req, res) => { reminders.getReminders(req, res) })

app.post('/reminders',
  passport.authenticate('jwt', { session: false }),
  (req, res) => { reminders.createReminder(req, res) })

app.delete('/reminders/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => { reminders.deleteReminder(req, res) })

app.put('/reminders/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => { reminders.updateReminder(req, res) })



app.get('/water',
  passport.authenticate('jwt', { session: false }),
  (req, res) => { water.getWaterIntake(req, res) })

app.post('/water',
  passport.authenticate('jwt', { session: false }),
  (req, res) => { water.createWaterIntake(req, res) })

app.delete('/water/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => { water.deleteWaterIntake(req, res) })

app.put('/water/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => { water.updateWaterIntake(req, res) })


app.get('/activity',
  passport.authenticate('jwt', { session: false }),
  (req, res) => { activity.getActivity(req, res) })

app.post('/activity',
  passport.authenticate('jwt', { session: false }),
  (req, res) => { activity.createActivity(req, res) })

app.delete('/activity/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => { activity.deleteActivity(req, res) })

app.put('/activity/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => { activity.updateActivity(req, res) })

// app.create
app.get("/weight", (req, res) => {
  weight.getWeight(req, res)
})
//app.post.delete.put
app.post('/weight', (req, res) => {
  weight.createWeight(req, res)
})
app.delete('/weight/:user_id', (req, res) => {
  weight.deleteWeight(req, res)
})
app.put('/weight/:user_id', (req, res) => {
  weight.updateWeight(req, res)
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
exports.client = client