const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { Client } = require('pg');
const { Strategy, ExtractJwt } = require('passport-jwt');


const app = express()
const port = 3000

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'zenvibe',
    password: 'Lebronjames63',
    port: 5432,
  });

  client.connect()

passport.use(new LocalStrategy(
    (username, password, done) => {
        client.query('SELECT * FROM users WHERE username = $1', [username], (err,result)=>{
            if(err){
                return done(err)
            }

            const user = result.rows[0];
            if(!user || !bcrypt.compareSync(password, user.password)) {
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
    (jwtPayload, done)=>{
        client.query('SELECT * FROM users where id = $1', [jwtPayload.sub], (err, result)=>{
            if(err){
                return done(err,false)
            }

            const user = result.rows[0]

            if(user){
                return done(null, user)
            } else {
                return done(null,false)
            }
        })
    }
))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(passport.initialize());

app.post('/register', (req, res) => {
  const token = jwt.sign({ sub: userId }, process.env.JWT_SECRET);
  res.json({ token });
  
    // Check if username is already taken
    client.query('SELECT * FROM users WHERE username = $1', [username], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      if (result.rows.length > 0) {
        return res.status(400).json({ error: 'Username is already taken' });
      }
  
      // If username is available, hash the password and create the user
      const hashedPassword = bcrypt.hashSync(password, 10);
  
      client.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
        [username, hashedPassword], (err, result) => {
          if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
          }
  
          const userId = result.rows[0].id;
          const token = jwt.sign({ sub: userId }, process.env.JWT_SECRET);
          res.json({ token });
        });
    });
  });
  

app.post('/login', passport.authenticate('local', {session: false}), (req,res)=>{
    const token = jwt.sign({sub:req.user.id}, process.env.JWT_SECRET)
    res.json({ token });
})

app.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    const user = req.user;
    res.send(`Hello ${user.username}, welcome home!`)
  });
  


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})