//THIS IS MY COMMENT
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const { Client } = require("pg");
const { Strategy, ExtractJwt } = require("passport-jwt");
require("dotenv").config();
const user = require("./queries/userQueries.js");
const food = require("./queries/foodEntryQueries.js");
const db = require("./database.js");
const client = db.pool;
const weight = require("./queries/weightQueries.js");
const reminders = require("./queries/remindersQueries.js");
const water = require("./queries/waterQueries.js");
const activity = require("./queries/activityQueries.js");
const cookieParser = require("cookie-parser");
//Chat Route added 
const chatRoutes = require('./queries/chat.js'); 
const app = express();
const port = process.env.PORT || 3000; // Use environment variable PORT or default to 3000

app.use(cookieParser()); // Use cookie-parser middleware

app.use((req, res, next) => {
  console.log("Cookies:", req.cookies); // Logs all cookies
  console.log("HTTP-only Cookies:", req.cookies["jwtToken"]); // Logs a specific HTTP-only cookie
  next();
});

passport.use(
  new LocalStrategy((username, password, done) => {
    console.log("local");
    console.log('username',username ,'password', password);
    client.query(
      "SELECT * FROM users WHERE username = $1",
      [username],
      (err, result) => {
        if (err) {
          return done(err);
        }

        const user = result.rows[0];
        if (!user || !bcrypt.compareSync(password, user.password_hash)) {
          return done(null, false);
        }
        return done(null, user);
      }
    );
  })
);

const cookieExtractor = function (req) {
  let token = null;
  console.log(req.cookies);
  if (req && req.cookies) {
    token = req.cookies["jwtToken"]; // The name of your cookie
    console.log(token);
  }
  return token;
};

passport.use(
  "jwt",
  new Strategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.JWT_SECRET,
    },
    (jwtPayload, done) => {
      console.log("JWT Payload:", jwtPayload); // Log the payload
      client.query(
        "SELECT * FROM users where user_id = $1",
        [jwtPayload.sub],
        (err, result) => {
          if (err) {
            return done(err, false);
          }

          const user = result.rows[0];

          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        }
      );
    }
  )
);

const corsOptions = {
  origin: "http://localhost:5173", // or your frontend origin
  credentials: true, // to allow sessions
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());


function checkAuthorization(req, res, next) {
  console.log(req.user, "user");
  if (Number(req.params.id) !== Number(req.user.user_id)) {
    return res.status(403).json({ error: "Unauthorized user." });
  }
  next();
}

async function deleteUpdateAuthorization(req, res, next, tableName) {
  const entryId = req.params.id;
  const userId = req.user.user_id;
  // const userId = 5

  const result = await db.pool.query(
    `SELECT entry_id FROM ${tableName} WHERE entry_id = $1 AND user_id = $2`,
    [entryId, userId]
  );

  console.log(userId, "THIS");
  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Entry not found." });
  }
  next();
}

app.post("/register", (req, res) => {
  let username = req.body.username;
  let requestedPassword = req.body.password_hash;
  let email = req.body.email;
  let original_weight = req.body.original_weight;
  let feet = req.body.feet;
  let inches = req.body.inches;
  let height_inches = feet * 12 + inches;
  let age = req.body.age;
  let gender = req.body.gender
  let activity_level = req.body.activity_level
  let goal_weight = req.body.goal_weight;

  client.query(
    "SELECT * FROM users WHERE username = $1",
    [username],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (result.rows.length > 0) {
        return res.status(400).json({ error: "Username is already taken" });
      }

      const hashedPassword = bcrypt.hashSync(requestedPassword, 10);

      client.query(
        "INSERT INTO users (username, password_hash, email, original_weight, feet, inches, height_inches, age, gender, activity_level, goal_weight) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
        [
          username,
          hashedPassword,
          email,
          original_weight,
          feet,
          inches,
          height_inches,
          age,
          gender,
          activity_level,
          goal_weight,
        ],
       
        (err, result) => {
          if (err) {
            return res.status(500).json({ error: "Internal Server Error" });
          }
          console.log(gender, "gender")
          console.log(activity_level, "activityLevel")
          const newUser = result.rows[0];

          // Create token similarly to the login route
          const token = jwt.sign(
            { sub: newUser.user_id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
          );

          // Set the token as an HTTP-only cookie
          res.cookie("jwtToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });

          // Send a success response
          res.status(200).json({ id: newUser.user_id });
        }
      );
    }
  );
});
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send("Unauthorized");
};

// ChatGPT route
app.post(
  "/chatbot",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userMessage = req.body.message;
      const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: userMessage,
          max_tokens: 150,
        }),
      });

      const data = await response.json();
      res.json({ reply: data.choices[0].text.trim() });
    } catch (error) {
      console.error("ChatGPT API Error:", error);
      res.status(500).send("Error processing your request");
    }
  }
);
app.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    // Assuming user authentication is successful, and `req.user` contains the authenticated user
    const token = jwt.sign({ sub: req.user.user_id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    }); // Adjust the expiresIn as necessary

    // Set the token as an HTTP-only cookie

    const userCookie = res.cookie("jwtToken", token, {
      httpOnly: true, // The cookie can't be accessed by client-side JS
      secure: false, // On production, use secure cookies
      sameSite: "lax", // Helps mitigate CSRF attacks
    });
    console.log(userCookie);
    console.log("================");
    // Send a success response

    res.status(200).json({ id: req.user.user_id });
  }
);

app.post("/logout", (req, res) => {
  res.clearCookie("jwtToken");
  res.json({ message: "Logged out successfully" });
});

app.get(
  "/user/:id",
  passport.authenticate("jwt", { session: false }),
  checkAuthorization,
  (req, res) => {
    user.getUser(req, res);
  }
);

app.delete(
  "/user/:id",
  passport.authenticate("jwt", { session: false }),
  checkAuthorization,
  (req, res) => {
    user.deleteUser(req, res);
  }
);

app.put(
  "/user/:id",
  passport.authenticate("jwt", { session: false }),
  checkAuthorization,
  (req, res) => {
    user.updateUser(req, res);
  }
);

app.post(
  "/weight/:id",
  passport.authenticate("jwt", { session: false }),
  checkAuthorization,
  (req, res) => {
    console.log("test", req.body);
    weight.createWeight(req, res);
  }
);

app.get(
  "/weight/:id",
  passport.authenticate("jwt", { session: false }),
  checkAuthorization,
  (req, res) => {
    weight.getWeight(req, res);
  }
);

app.delete(
  "/weight/:id",
  passport.authenticate("jwt", { session: false }),
  deleteUpdateAuthorization,
  (req, res) => {
    weight.deleteWeight(req, res);
  }
);

//get the last weight entry
app.get(
  "/weight/latest/:id",
  passport.authenticate("jwt", { session: false }),
  checkAuthorization,
  (req, res) => {
    weight.getLatestWeightEntry(req, res);
  }
);

app.put(
  "/weight/:id",
  passport.authenticate("jwt", { session: false }),
  deleteUpdateAuthorization,
  (req, res) => {
    weight.updateWeight(req, res);
  }
);

app.post(
  "/food/:id",
  passport.authenticate("jwt", { session: false }),
  checkAuthorization,
  (req, res) => {
    food.addFood(req, res);
  }
);

app.get(
  "/food/:id",
  passport.authenticate("jwt", { session: false }),
  checkAuthorization,
  (req, res) => {
    food.getFood(req, res);
  }
);

app.delete(
  "/food/:id",
  passport.authenticate("jwt", { session: false }),
  deleteUpdateAuthorization,
  (req, res) => {
    food.deleteFood(req, res);
  }
);

app.put(
  "/food/:id",
  passport.authenticate("jwt", { session: false }),
  deleteUpdateAuthorization,
  (req, res) => {
    food.updateFood(req, res);
  }
);

app.get(
  "/water/:id",
  passport.authenticate("jwt", { session: false }),
  checkAuthorization,
  (req, res) => {
    water.getWaterIntake(req, res);
  }
);

app.post(
  "/water/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    water.createWaterIntake(req, res);
  }
);

app.delete(
  "/water/:id",
  passport.authenticate("jwt", { session: false }),
  deleteUpdateAuthorization,
  (req, res) => {
    water.deleteWaterIntake(req, res);
  }
);

app.put(
  "/water/:id",
  passport.authenticate("jwt", { session: false }),
  deleteUpdateAuthorization,
  (req, res) => {
    water.updateWaterIntake(req, res);
  }
);

app.get(
  "/activity/:id",
  passport.authenticate("jwt", { session: false }),
  checkAuthorization,
  (req, res) => {
    activity.getActivity(req, res);
  }
);

app.post(
  "/activity/:id",
  passport.authenticate("jwt", { session: false }),
  checkAuthorization,
  (req, res) => {
    activity.createActivity(req, res);
  }
);

app.delete(
  "/activity/:id",
  passport.authenticate("jwt", { session: false }),
  deleteUpdateAuthorization,
  (req, res) => {
    activity.deleteActivity(req, res);
  }
);

app.put(
  "/activity/:id",
  passport.authenticate("jwt", { session: false }),
  deleteUpdateAuthorization,
  (req, res) => {
    activity.updateActivity(req, res);
  }
);

app.get(
  "/reminder/:id",
  passport.authenticate("jwt", { session: false }),
  checkAuthorization,
  (req, res) => {
    reminders.getReminders(req, res);
  }
);

app.post(
  "/reminder/:id",
  passport.authenticate("jwt", { session: false }),
  checkAuthorization,
  (req, res) => {
    reminders.createReminder(req, res);
  }
);

app.delete(
  "/reminder/:id",
  passport.authenticate("jwt", { session: false }),
  deleteUpdateAuthorization,
  (req, res) => {
    reminders.deleteReminder(req, res);
  }
);

app.put(
  "/reminder/:id",
  passport.authenticate("jwt", { session: false }),
  deleteUpdateAuthorization,
  (req, res) => {
    reminders.updateReminder(req, res);
  }
);
//added route for AI 
app.use('/api', chatRoutes)

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});

exports.client = client;
