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

const app = express()
const port = 3000

passport.use(new LocalStrategy(
    (username, password, done) => {
        client.query('SELECT * FROM users WHERE username = $1', [username], (err,result)=>{
            if(err){
                return done(err)
            }

            const user = result.rows[0];
            if(!user || !bcrypt.compareSync(password, user.password_hash)) {
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
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());

app.post('/register', (req, res) => {

  let username = req.body.username;
  let password = req.body.password;
  
    // Check if username is already taken
    client.query('SELECT * FROM users WHERE username = $1', [username], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
  
      if (result.rows.length > 0) {
        return res.status(400).json({ error: 'Username is already taken' });
      }
  
      // If username is available, hash the password and create the user
      const hashedPassword = bcrypt.hashSync(password, 10);
  
      client.query('INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING user_id',
        [username, hashedPassword], (err, result) => {
          if (err) {
            console.log(err,'err')
            return res.status(500).json({ error: 'Internal Server Error' });
          }
  
          const user = result.rows[0]
          const token = jwt.sign({ sub: user }, process.env.JWT_SECRET);
          res.json({ token });
        });
    });
  });
  

app.post('/login', passport.authenticate('local', {session: false}), (req,res)=>{  
    const token = jwt.sign({sub:req.user}, process.env.JWT_SECRET)
    res.json({ token });
})

app.get('/user', 
  passport.authenticate('jwt', { session: false } ),
  (req,res)=>{ user.getUser(req,res)})

// app.delete('/user/:id'
  // passport.authenticate('jwt', { session: false } ),),
  // (req,res)=>{ user.deleteUser(req,res)})

// app.update

// app.create

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
exports.client = client