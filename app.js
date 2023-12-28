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
const db = require('./database.js')
const client = db.pool
const reminders = require('./queries/remindersQueries.js')

const app = express()
const port = 3000

passport.use(new LocalStrategy(
  (username, password_hash, done) => {
    client.query('SELECT * FROM users WHERE username = $1', [username], (err, result) => {
      if (err) {
        return done(err)
      }

      const user = result.rows[0];
      if (!user || !bcrypt.compareSync(password_hash, user.password_hash)) {
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

app.post('/register', (req, res) => {

  let username = req.body.username;
  let requestedPassword = req.body.password_hash;
  let email = req.body.email
  let original_weight = req.body.original_weight
  let height = req.body.height
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

    // If username is available, hash the password and create the user
    const hashedPassword = bcrypt.hashSync(requestedPassword, 10);
    console.log(hashedPassword)

    client.query('INSERT INTO users (username, password_hash, email, original_weight, height, age, goal_weight) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING user_id',

      [username, hashedPassword, email, original_weight, height, age, goal_weight], (err, result) => {
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


app.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  const token = jwt.sign({ sub: req.user }, process.env.JWT_SECRET)
  res.json({ token });
})

app.get('/user',
  passport.authenticate('jwt', { session: false }),
  (req, res) => { user.getUser(req, res) }) 

app.delete('/user/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => { user.deleteUser(req, res) })

app.put('/user/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => { user.updateUser(req,res)})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
exports.client = client