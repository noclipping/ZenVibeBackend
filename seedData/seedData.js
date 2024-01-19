const users = [
    { username: 'john_doe', password_hash: 'securePassword1', email: 'john.doe@example.com', original_weight: 160, feet: 5, inches: 11, age: 25, goal_weight: 150 },
    { username: 'alice_smith', password_hash: 'strongPass123', email: 'alice.smith@example.com', original_weight: 140, feet: 5, inches: 5, age: 30, goal_weight: 130 },
    { username: 'bob_jones', password_hash: 'secretPass567', email: 'bob.jones@example.com', original_weight: 180, feet: 5, inches: 9, age: 28, goal_weight: 170 },
    { username: 'emily_wilson', password_hash: 'password456', email: 'emily.wilson@example.com', original_weight: 120, feet: 5, inches: 4, age: 22, goal_weight: 110 },
    { username: 'chris_martin', password_hash: 'coldplayFan89', email: 'chris.martin@example.com', original_weight: 150, feet: 6, inches: 0, age: 35, goal_weight: 140 },
    { username: 'lisa_smith', password_hash: 'lisa1234', email: 'lisa.smith@example.com', original_weight: 170, feet: 5, inches: 8, age: 27, goal_weight: 160 },
    { username: 'david_williams', password_hash: 'pianoMan007', email: 'david.williams@example.com', original_weight: 130, feet: 5, inches: 6, age: 32, goal_weight: 120 },
    { username: 'olivia_miller', password_hash: 'sunshine22', email: 'olivia.miller@example.com', original_weight: 155, feet: 5, inches: 10, age: 29, goal_weight: 145 },
    { username: 'samuel_jackson', password_hash: 'pulpFiction1', email: 'samuel.jackson@example.com', original_weight: 140, feet: 5, inches: 2, age: 24, goal_weight: 130 },
    { username: 'natalie_carter', password_hash: 'blueSky789', email: 'natalie.carter@example.com', original_weight: 165, feet: 6, inches: 2, age: 31, goal_weight: 155 },
    { username: 'michael_jordan', password_hash: 'goat23', email: 'michael.jordan@example.com', original_weight: 190, feet: 6, inches: 6, age: 58, goal_weight: 180 },
    { username: 'emma_roberts', password_hash: 'screamQueen', email: 'emma.roberts@example.com', original_weight: 125, feet: 5, inches: 3, age: 31, goal_weight: 115 },
    { username: 'justin_bieber', password_hash: 'belieber4eva', email: 'justin.bieber@example.com', original_weight: 140, feet: 5, inches: 7, age: 28, goal_weight: 130 },
    { username: 'taylor_swift', password_hash: 'shakeItOff22', email: 'taylor.swift@example.com', original_weight: 130, feet: 5, inches: 10, age: 32, goal_weight: 120 },
    { username: 'ryan_gosling', password_hash: 'notebookFan123', email: 'ryan.gosling@example.com', original_weight: 160, feet: 6, inches: 1, age: 41, goal_weight: 150 },
    { username: 'jennifer_aniston', password_hash: 'friendsForever', email: 'jennifer.aniston@example.com', original_weight: 135, feet: 5, inches: 6, age: 53, goal_weight: 125 },
    { username: 'leonardo_dicaprio', password_hash: 'oscarWinner2020', email: 'leonardo.dicaprio@example.com', original_weight: 150, feet: 6, inches: 0, age: 47, goal_weight: 140 },
    { username: 'megan_fox', password_hash: 'transformerGirl', email: 'megan.fox@example.com', original_weight: 125, feet: 5, inches: 4, age: 35, goal_weight: 115 },
    { username: 'brad_pitt', password_hash: 'fightClub99', email: 'brad.pitt@example.com', original_weight: 170, feet: 5, inches: 11, age: 58, goal_weight: 160 },
    { username: 'angelina_jolie', password_hash: 'tombRaider007', email: 'angelina.jolie@example.com', original_weight: 120, feet: 5, inches: 6, age: 46, goal_weight: 110 },
    { username: 'scarlett_johansson', password_hash:'blackWidow123', email: 'scarlett.johansson@example.com', original_weight: 140, feet: 5, inches: 3, age: 37, goal_weight: 130 },
    { username: 'chadwick_boseman', password_hash: 'blackPanther42', email: 'chadwick.boseman@example.com', original_weight: 160, feet: 6, inches: 0, age: 43, goal_weight: 150 },
    { username: 'zendaya', password_hash: 'euphoria2022', email: 'zendaya@example.com', original_weight: 130, feet: 5, inches: 10, age: 25, goal_weight: 120 },
    { username: "spiderman", "password_hash": "webslinger123", "email": "spidey@example.com", "original_weight": 160, "feet": 6, "inches": 0, "age": 22, "goal_weight": 150 },
    { "username": "blackwidow", "password_hash": "redroom007", "email": "natasha@example.com", "original_weight": 120, "feet": 5, "inches": 7, "age": 30, "goal_weight": 115 }

]

const createTables = `
DROP TABLE IF EXISTS users, weight_data, food_entries, water_intake, activity_entries, mood_tracker, reminders cascade;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    original_weight FLOAT,
    feet INT,
    inches INT,
    height_inches INT,
    age INT,
    goal_weight FLOAT
    activity_level VARCHAR(255),
    gender VARCHAR(255)
);

  CREATE TABLE weight_data (
    entry_id SERIAL PRIMARY KEY,
    user_id INT,
    weight FLOAT,
    entry_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE food_entries (
    entry_id SERIAL PRIMARY KEY,
    user_id INT,
    food_name VARCHAR(255),
    calories INT,
    entry_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE water_intake (
    entry_id SERIAL PRIMARY KEY,
    user_id INT,
    cups INT,
    entry_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE activity_entries (
    entry_id SERIAL PRIMARY KEY,
    user_id INT,
    activity_name VARCHAR(255),
    sets INT,
    reps INT,
    lift_weight INT,
    duration INT,
    entry_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE mood_tracker (
    entry_id SERIAL PRIMARY KEY,
    user_id INT,
    emotion VARCHAR(255) CHECK (emotion IN ('Happy', 'Sad', 'Angry', 'Tranquil', 'Content', 'Anxious', 'Stressed', 'Overwhelmed', 'Excited', 'Bored', 'Lonely', 'Inspired', 'Frustrated', 'Energetic', 'Confused')),
    intensity INT,
    entry_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE reminders (
    reminder_id SERIAL PRIMARY KEY,
    user_id INT,
    created_at DATE,
    status VARCHAR(255) CHECK (status IN ('Active', 'Inactive')),
    title VARCHAR(255),
    description TEXT,
    reminder_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
`

const insertQueries = `

INSERT INTO weight_data (user_id, weight, entry_date) 
VALUES
    (1, 155.5, '2023-01-01'),
    (2, 130.0, '2023-01-02'), 
    (3, 175.2, '2023-01-03'),
    (4, 118.7, '2023-01-04'),
    (5, 162.3, '2023-01-05'),
 (6, 145.0, '2023-01-06'),
  (7, 155.8, '2023-01-07'),
  (8, 135.2, '2023-01-08'),
  (9, 190.5, '2023-01-09'),
  (10, 112.5, '2023-01-10'),
  (11, 180.3, '2023-01-11'),
  (12, 155.7, '2023-01-12'),
  (13, 170.0, '2023-01-13'),
  (14, 120.6, '2023-01-14'),
  (15, 185.0, '2023-01-15'),
  (16, 172.5, '2023-01-16'),
  (17, 160.2, '2023-01-17'),
  (18, 155.0, '2023-01-18'),
  (19, 192.5, '2023-01-19'),
  (20, 100.0, '2023-01-20'),
  (21, 160.8, '2023-01-21'),
  (22, 145.3, '2023-01-22'),
  (23, 180.0, '2023-01-23'),
  (24, 110.2, '2023-01-24'),
  (25, 175.5, '2023-01-25');

INSERT INTO food_entries (user_id, food_name, calories, entry_date)
VALUES
    (1, 'Chicken Salad', 350, '2023-01-01'),
    (2, 'Vegetable Stir-Fry', 250, '2023-01-02'),
    (3, 'Grilled Salmon', 400, '2023-01-03'),
    (4, 'Quinoa Bowl', 300, '2023-01-04'),
    (5, 'Pasta Primavera', 450, '2023-01-05'),
  (6, 'Avocado Toast', 200, '2023-01-06'),
  (7, 'Caesar Salad', 320, '2023-01-07'),
  (8, 'Fruit Smoothie', 180, '2023-01-08'),
  (9, 'Steak and Potatoes', 500, '2023-01-09'),
  (10, 'Greek Yogurt Parfait', 220, '2023-01-10'),
  (11, 'Veggie Wrap', 280, '2023-01-11'),
  (12, 'Oatmeal with Berries', 150, '2023-01-12'),
  (13, 'Chicken Alfredo', 420, '2023-01-13'),
  (14, 'Fruit Salad', 120, '2023-01-14'),
  (15, 'Protein Bar', 200, '2023-01-15'),
  (16, 'Shrimp Tacos', 350, '2023-01-16'),
  (17, 'Caprese Sandwich', 300, '2023-01-17'),
  (18, 'Egg Salad', 240, '2023-01-18'),
  (19, 'Beef Stir-Fry', 420, '2023-01-19'),
  (20, 'Vegetarian Pizza', 320, '2023-01-20'),
  (21, 'Peanut Butter Sandwich', 180, '2023-01-21'),
  (22, 'Cobb Salad', 380, '2023-01-22'),
  (23, 'Spaghetti Bolognese', 400, '2023-01-23'),
  (24, 'Hummus and Veggies', 150, '2023-01-24'),
  (25, 'Grilled Chicken Wrap', 300, '2023-01-25');

INSERT INTO water_intake (user_id, cups, entry_date)
VALUES
    (1, 8, '2023-01-01'),
    (2, 6, '2023-01-02'),
    (3, 10, '2023-01-03'),
    (4, 5, '2023-01-04'),
    (5, 7, '2023-01-05'),
(6, 9, '2023-01-06'),
  (7, 8, '2023-01-07'),
  (8, 7, '2023-01-08'),
  (9, 12, '2023-01-09'),
  (10, 5, '2023-01-10'),
  (11, 10, '2023-01-11'),
  (12, 8, '2023-01-12'),
  (13, 11, '2023-01-13'),
  (14, 6, '2023-01-14'),
  (15, 9, '2023-01-15'),
  (16, 7, '2023-01-16'),
  (17, 8, '2023-01-17'),
  (18, 6, '2023-01-18'),
  (19, 10, '2023-01-19'),
  (20, 8, '2023-01-20'),
  (21, 7, '2023-01-21'),
  (22, 9, '2023-01-22'),
  (23, 11, '2023-01-23'),
  (24, 6, '2023-01-24'),
  (25, 8, '2023-01-25');

INSERT INTO activity_entries (user_id, activity_name, sets, reps, lift_weight, duration, entry_date)
VALUES
    (1, 'Bench Press', 3, 10, 150, 30, '2023-01-01'),
    (2, 'Squats', 4, 12, 200, 45, '2023-01-02'),
    (3, 'Deadlifts', 3, 8, 250, 40, '2023-01-03'),
    (4, 'Bicep Curls', 3, 15, 30, 20, '2023-01-04'),
    (5, 'Cardio - Running', null, null, null, 60, '2023-01-05'),
 (6, 'Yoga', NULL, NULL, NULL, 45, '2023-01-06'),
  (7, 'Plank', NULL, NULL, NULL, 60, '2023-01-07'),
  (8, 'Cycling', NULL, NULL, NULL, 30, '2023-01-08'),
  (9, 'Push-ups', NULL, NULL, NULL, 20, '2023-01-09'),
  (10, 'Swimming', NULL, NULL, NULL, 45, '2023-01-10'),
  (11, 'Jump Rope', NULL, NULL, NULL, 15, '2023-01-11'),
  (12, 'Dumbbell Rows', 3, 12, 40, 25, '2023-01-12'),
  (13, 'HIIT Workout', NULL, NULL, NULL, 30, '2023-01-13'),
  (14, 'Walking', NULL, NULL, NULL, 40, '2023-01-14'),
  (15, 'Stair Climbing', NULL, NULL, NULL, 20, '2023-01-15'),
  (16, 'Chest Flys', 3, 12, 120, 25, '2023-01-16'),
  (17, 'Leg Press', 3, 15, 180, 35, '2023-01-17'),
  (18, 'Burpees', NULL, NULL, NULL, 15, '2023-01-18'),
  (19, 'Pull-ups', NULL, NULL, NULL, 15, '2023-01-19'),
  (20, 'Pilates', NULL, NULL, NULL, 45, '2023-01-20'),
  (21, 'Kickboxing', NULL, NULL, NULL, 30, '2023-01-21'),
  (22, 'Rowing', NULL, NULL, NULL, 30, '2023-01-22'),
  (23, 'Tricep Dips', 3, 15, 20, 20, '2023-01-23'),
  (24, 'Elliptical Trainer', NULL, NULL, NULL, 30, '2023-01-24'),
  (25, 'Biking', NULL, NULL, NULL, 40, '2023-01-25');

INSERT INTO mood_tracker (user_id, emotion, intensity, entry_date) 
VALUES
    (1, 'Happy', 4, '2023-01-01'),
    (2, 'Sad', 3, '2023-01-02'),
    (3, 'Angry', 5, '2023-01-03'),
    (4, 'Tranquil', 2, '2023-01-04'),
    (5, 'Excited', 4, '2023-01-05'),
  (6, 'Tranquil', 3, '2023-01-06'),
  (7, 'Content', 4, '2023-01-07'),
  (8, 'Stressed', 5, '2023-01-08'),
  (9, 'Angry', 4, '2023-01-09'),
  (10, 'Excited', 5, '2023-01-10'),
  (11, 'Overwhelmed', 3, '2023-01-11'),
  (12, 'Sad', 4, '2023-01-12'),
  (13, 'Tranquil', 3, '2023-01-13'),
  (14, 'Happy', 4, '2023-01-14'),
  (15, 'Happy', 5, '2023-01-15'),
  (16, 'Overwhelmed', 2, '2023-01-16'),
  (17, 'Anxious', 4, '2023-01-17'),
  (18, 'Stressed', 5, '2023-01-18'),
  (19, 'Excited', 3, '2023-01-19'),
  (20, 'Excited', 4, '2023-01-20'),
  (21, 'Sad', 3, '2023-01-21'),
  (22, 'Happy', 4, '2023-01-22'),
  (23, 'Angry', 2, '2023-01-23'),
  (24, 'Content', 4, '2023-01-24'),
  (25, 'Anxious', 3, '2023-01-25');

INSERT INTO reminders (user_id, created_at, status, title, description, reminder_date) 
VALUES
    (1, '2023-01-01 08:00:00', 'Active', 'Food Log', 'Log your meals for today', '2023-01-10'),
    (2, '2023-01-02 10:30:00', 'Active', 'Weight Check-In', 'Weigh yourself and record the weight', '2023-01-15'),
    (3, '2023-01-03 14:45:00', 'Inactive', 'Exercise Session', 'Complete your workout routine', '2023-01-08'),
    (4, '2023-01-04 09:15:00', 'Active', 'Food Planning', 'Plan your meals for the upcoming week', '2023-02-05'),
    (5, '2023-01-05 16:00:00', 'Active', 'Weekly Exercise Review', 'Review and adjust your exercise routine', '2023-01-13'),
(6, '2023-01-06 12:00:00', 'Inactive', 'Relaxation Time', 'Take some time to relax and unwind', '2023-01-12'),
  (7, '2023-01-07 18:30:00', 'Active', 'Hydration Reminder', 'Drink at least 8 cups of water today', '2023-01-14'),
  (8, '2023-01-08 07:45:00', 'Active', 'Morning Stretch', 'Start your day with a quick stretching routine', '2023-01-09'),
  (9, '2023-01-09 20:00:00', 'Inactive', 'Digital Detox', 'Take a break from screens for an hour', '2023-01-11'),
  (10, '2023-01-10 09:30:00', 'Active', 'Meal Prep', 'Prepare your meals for the next two days', '2023-01-18'),
  (11, '2023-01-11 13:15:00', 'Active', 'Lunch Walk', 'Take a short walk during your lunch break', '2023-01-23'),
  (12, '2023-01-12 17:30:00', 'Inactive', 'Mindfulness Break', 'Practice mindfulness for 10 minutes', '2023-01-22'),
  (13, '2023-01-13 11:00:00', 'Active', 'Desk Exercises', 'Do some quick exercises at your desk', '2023-01-19'),
  (14, '2023-01-14 14:45:00', 'Active', 'Evening Relaxation', 'Wind down with a relaxation routine', '2023-01-21'),
  (15, '2023-01-15 22:00:00', 'Inactive', 'Tech-Free Bedtime', 'Avoid screens 30 minutes before bedtime', '2023-01-20'),
  (16, '2023-01-16 19:30:00', 'Active', 'Self-Reflection', 'Take some time for self-reflection', '2023-01-24'),
  (17, '2023-01-17 08:45:00', 'Active', 'Morning Meditation', 'Start your day with a short meditation', '2023-01-25'),
  (18, '2023-01-18 16:15:00', 'Inactive', 'Book Reading', 'Read a chapter of your favorite book', '2023-01-17'),
  (19, '2023-01-19 12:30:00', 'Active', 'Workout Playlist', 'Create a playlist for your workout today', '2023-01-16'),
  (20, '2023-01-20 09:00:00', 'Active', 'Healthy Snack', 'Choose a healthy snack for your mid-morning break', '2023-01-13'),
  (21, '2023-01-21 15:30:00', 'Inactive', 'DIY Project', 'Start a small DIY project for creativity', '2023-01-14'),
  (22, '2023-01-22 11:45:00', 'Active', 'Deep Breathing', 'Practice deep breathing for stress relief', '2023-01-12'),
  (23, '2023-01-23 18:00:00', 'Active', 'Gratitude Journaling', 'Write down three things youre grateful for', '2023-01-11'),
  (24, '2023-01-24 07:00:00', 'Inactive', 'Morning Stretch', 'Start your day with a quick stretching routine', '2023-01-10'),
  (25, '2023-01-25 21:00:00', 'Active', 'Nighttime Wind Down', 'Create a calming routine before bedtime', '2023-01-09');

`



module.exports = {
    users,
    createTables,
    insertQueries
}