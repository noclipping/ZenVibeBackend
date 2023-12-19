--users

INSERT INTO users (user_id, username, password_hash, email, original_weight, height, age, goal_weight) 
VALUES  (1, 'john_doe', 'password1', 'john@example.com', 160, 180, 25, 150),
        (2, 'alice_smith', 'password2', 'alice@example.com', 140, 165, 30, 130),
        (3, 'bob_jackson', 'password3', 'bob@example.com', 180, 175, 28, 170),
        (4, 'emma_watson', 'password4', 'emma@example.com', 130, 160, 22, 120),
        (5, 'david_jones', 'password5', 'david@example.com', 170, 185, 35, 160),
        (6, 'jane_doe', 'password6', 'jane@example.com', 150, 170, 28, 140),
  (7, 'robert_smith', 'password7', 'robert@example.com', 160, 175, 32, 155),
        (8, 'susan_jackson', 'password8', 'susan@example.com', 140, 160, 29, 130),
  (9, 'michael_watson', 'password9', 'michael@example.com', 180, 190, 30, 175),
  (10, 'olivia_jones', 'password10', 'olivia@example.com', 120, 150, 24, 110),
  (11, 'william_doe', 'password11', 'william@example.com', 155, 180, 26, 145),
  (12, 'emma_smith', 'password12', 'emma@example.com', 135, 165, 31, 125),
  (13, 'benjamin_jackson', 'password13', 'benjamin@example.com', 175, 170, 27, 165),
  (14, 'ava_watson', 'password14', 'ava@example.com', 125, 155, 23, 115),
  (15, 'james_jones', 'password15', 'james@example.com', 165, 185, 33, 155),
  (16, 'chloe_doe', 'password16', 'chloe@example.com', 140, 175, 29, 135),
  (17, 'ethan_smith', 'password17', 'ethan@example.com', 160, 180, 28, 150),
  (18, 'mia_jackson', 'password18', 'mia@example.com', 130, 160, 26, 120),
  (19, 'alexander_watson', 'password19', 'alexander@example.com', 170, 190, 32, 165),
  (20, 'sophia_jones', 'password20', 'sophia@example.com', 110, 150, 25, 105),
  (21, 'oliver_doe', 'password21', 'oliver@example.com', 150, 170, 30, 140),
  (22, 'emily_smith', 'password22', 'emily@example.com', 140, 165, 28, 130),
  (23, 'daniel_jackson', 'password23', 'daniel@example.com', 175, 180, 29, 160),
  (24, 'mia_watson', 'password24', 'mia@example.com', 120, 155, 22, 110),
  (25, 'logan_jones', 'password25', 'logan@example.com', 160, 185, 34, 150);
       

--weight_data

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


-- --food_entries

-- INSERT INTO food_entries (user_id, food_name, calories, entry_date)
-- VALUES
--     (1, 'Chicken Salad', 350, '2023-01-01'),
--     (2, 'Vegetable Stir-Fry', 250, '2023-01-02'),
--     (3, 'Grilled Salmon', 400, '2023-01-03'),
--     (4, 'Quinoa Bowl', 300, '2023-01-04'),
--     (5, 'Pasta Primavera', 450, '2023-01-05'),
--   (6, 'Avocado Toast', 200, '2023-01-06'),
--   (7, 'Caesar Salad', 320, '2023-01-07'),
--   (8, 'Fruit Smoothie', 180, '2023-01-08'),
--   (9, 'Steak and Potatoes', 500, '2023-01-09'),
--   (10, 'Greek Yogurt Parfait', 220, '2023-01-10'),
--   (11, 'Veggie Wrap', 280, '2023-01-11'),
--   (12, 'Oatmeal with Berries', 150, '2023-01-12'),
--   (13, 'Chicken Alfredo', 420, '2023-01-13'),
--   (14, 'Fruit Salad', 120, '2023-01-14'),
--   (15, 'Protein Bar', 200, '2023-01-15'),
--   (16, 'Shrimp Tacos', 350, '2023-01-16'),
--   (17, 'Caprese Sandwich', 300, '2023-01-17'),
--   (18, 'Egg Salad', 240, '2023-01-18'),
--   (19, 'Beef Stir-Fry', 420, '2023-01-19'),
--   (20, 'Vegetarian Pizza', 320, '2023-01-20'),
--   (21, 'Peanut Butter Sandwich', 180, '2023-01-21'),
--   (22, 'Cobb Salad', 380, '2023-01-22'),
--   (23, 'Spaghetti Bolognese', 400, '2023-01-23'),
--   (24, 'Hummus and Veggies', 150, '2023-01-24'),
--   (25, 'Grilled Chicken Wrap', 300, '2023-01-25');

-- --water_intake

-- INSERT INTO water_intake (user_id, cups, entry_date)
-- VALUES
--     (1, 8, '2023-01-01'),
--     (2, 6, '2023-01-02'),
--     (3, 10, '2023-01-03'),
--     (4, 5, '2023-01-04'),
--     (5, 7, '2023-01-05'),
-- (6, 9, '2023-01-06'),
--   (7, 8, '2023-01-07'),
--   (8, 7, '2023-01-08'),
--   (9, 12, '2023-01-09'),
--   (10, 5, '2023-01-10'),
--   (11, 10, '2023-01-11'),
--   (12, 8, '2023-01-12'),
--   (13, 11, '2023-01-13'),
--   (14, 6, '2023-01-14'),
--   (15, 9, '2023-01-15'),
--   (16, 7, '2023-01-16'),
--   (17, 8, '2023-01-17'),
--   (18, 6, '2023-01-18'),
--   (19, 10, '2023-01-19'),
--   (20, 8, '2023-01-20'),
--   (21, 7, '2023-01-21'),
--   (22, 9, '2023-01-22'),
--   (23, 11, '2023-01-23'),
--   (24, 6, '2023-01-24'),
--   (25, 8, '2023-01-25');


-- --exercise_entries

-- INSERT INTO exercise_entries (user_id, exercise_name, sets, reps, lift_weight, duration, entry_date)
-- VALUES
--     (1, 'Bench Press', 3, 10, 150, 30, '2023-01-01'),
--     (2, 'Squats', 4, 12, 200, 45, '2023-01-02'),
--     (3, 'Deadlifts', 3, 8, 250, 40, '2023-01-03'),
--     (4, 'Bicep Curls', 3, 15, 30, 20, '2023-01-04'),
--     (5, 'Cardio - Running', null, null, null, 60, '2023-01-05');
--  (6, 'Yoga', NULL, NULL, NULL, 45, '2023-01-06'),
--   (7, 'Plank', NULL, NULL, NULL, 60, '2023-01-07'),
--   (8, 'Cycling', NULL, NULL, NULL, 30, '2023-01-08'),
--   (9, 'Push-ups', NULL, NULL, NULL, 20, '2023-01-09'),
--   (10, 'Swimming', NULL, NULL, NULL, 45, '2023-01-10'),
--   (11, 'Jump Rope', NULL, NULL, NULL, 15, '2023-01-11'),
--   (12, 'Dumbbell Rows', 3, 12, 40, 25, '2023-01-12'),
--   (13, 'HIIT Workout', NULL, NULL, NULL, 30, '2023-01-13'),
--   (14, 'Walking', NULL, NULL, NULL, 40, '2023-01-14'),
--   (15, 'Stair Climbing', NULL, NULL, NULL, 20, '2023-01-15'),
--   (16, 'Chest Flys', 3, 12, 120, 25, '2023-01-16'),
--   (17, 'Leg Press', 3, 15, 180, 35, '2023-01-17'),
--   (18, 'Burpees', NULL, NULL, NULL, 15, '2023-01-18'),
--   (19, 'Pull-ups', NULL, NULL, NULL, 15, '2023-01-19'),
--   (20, 'Pilates', NULL, NULL, NULL, 45, '2023-01-20'),
--   (21, 'Kickboxing', NULL, NULL, NULL, 30, '2023-01-21'),
--   (22, 'Rowing', NULL, NULL, NULL, 30, '2023-01-22'),
--   (23, 'Tricep Dips', 3, 15, 20, 20, '2023-01-23'),
--   (24, 'Elliptical Trainer', NULL, NULL, NULL, 30, '2023-01-24'),
--   (25, 'Biking', NULL, NULL, NULL, 40, '2023-01-25');


-- --mood_tracker

-- INSERT INTO mood_tracker (user_id, emotion, intensity, entry_date) 
-- VALUES
--     (1, 'Happy', 4, '2023-01-01'),
--     (2, 'Sad', 3, '2023-01-02'),
--     (3, 'Angry', 5, '2023-01-03'),
--     (4, 'Tranquil', 2, '2023-01-04'),
--     (5, 'Excited', 4, '2023-01-05');
  -- (6, 'Tranquil', 3, '2023-01-06'),
  -- (7, 'Content', 4, '2023-01-07'),
  -- (8, 'Stressed', 5, '2023-01-08'),
  -- (9, 'Angry', 4, '2023-01-09'),
  -- (10, 'Excited', 5, '2023-01-10'),
  -- (11, 'Overwhelmed', 3, '2023-01-11'),
  -- (12, 'Sad', 4, '2023-01-12'),
  -- (13, 'Tranquil', 3, '2023-01-13'),
  -- (14, 'Happy', 4, '2023-01-14'),
  -- (15, 'Happy', 5, '2023-01-15'),
  -- (16, 'Overwhelmed', 2, '2023-01-16'),
  -- (17, 'Anxious', 4, '2023-01-17'),
  -- (18, 'Stressed', 5, '2023-01-18'),
  -- (19, 'Excited', 3, '2023-01-19'),
  -- (20, 'Excited', 4, '2023-01-20'),
  -- (21, 'Sad', 3, '2023-01-21'),
  -- (22, 'Happy', 4, '2023-01-22'),
  -- (23, 'Angry, 2, '2023-01-23'),
  -- (24, 'Content', 4, '2023-01-24'),
  -- (25, 'Anxious', 3, '2023-01-25');

-- --reminders

-- INSERT INTO reminders (user_id, created_at, status, title, description, reminder_date) 
-- VALUES
--     (1, '2023-01-01 08:00:00', 'Active', 'Food Log', 'Log your meals for today', '2023-01-10'),
--     (2, '2023-01-02 10:30:00', 'Active', 'Weight Check-In', 'Weigh yourself and record the weight', '2023-01-15'),
--     (3, '2023-01-03 14:45:00', 'Inactive', 'Exercise Session', 'Complete your workout routine', '2023-01-08'),
--     (4, '2023-01-04 09:15:00', 'Active', 'Food Planning', 'Plan your meals for the upcoming week', '2023-02-05'),
--     (5, '2023-01-05 16:00:00', 'Active', 'Weekly Exercise Review', 'Review and adjust your exercise routine', '2023-01-13');
-- (6, '2023-01-06 12:00:00', 'Inactive', 'Relaxation Time', 'Take some time to relax and unwind', '2023-01-12'),
--   (7, '2023-01-07 18:30:00', 'Active', 'Hydration Reminder', 'Drink at least 8 cups of water today', '2023-01-14'),
--   (8, '2023-01-08 07:45:00', 'Active', 'Morning Stretch', 'Start your day with a quick stretching routine', '2023-01-09'),
--   (9, '2023-01-09 20:00:00', 'Inactive', 'Digital Detox', 'Take a break from screens for an hour', '2023-01-11'),
--   (10, '2023-01-10 09:30:00', 'Active', 'Meal Prep', 'Prepare your meals for the next two days', '2023-01-18'),
--   (11, '2023-01-11 13:15:00', 'Active', 'Lunch Walk', 'Take a short walk during your lunch break', '2023-01-23'),
--   (12, '2023-01-12 17:30:00', 'Inactive', 'Mindfulness Break', 'Practice mindfulness for 10 minutes', '2023-01-22'),
--   (13, '2023-01-13 11:00:00', 'Active', 'Desk Exercises', 'Do some quick exercises at your desk', '2023-01-19'),
--   (14, '2023-01-14 14:45:00', 'Active', 'Evening Relaxation', 'Wind down with a relaxation routine', '2023-01-21'),
--   (15, '2023-01-15 22:00:00', 'Inactive', 'Tech-Free Bedtime', 'Avoid screens 30 minutes before bedtime', '2023-01-20'),
--   (16, '2023-01-16 19:30:00', 'Active', 'Self-Reflection', 'Take some time for self-reflection', '2023-01-24'),
--   (17, '2023-01-17 08:45:00', 'Active', 'Morning Meditation', 'Start your day with a short meditation', '2023-01-25'),
--   (18, '2023-01-18 16:15:00', 'Inactive', 'Book Reading', 'Read a chapter of your favorite book', '2023-01-17'),
--   (19, '2023-01-19 12:30:00', 'Active', 'Workout Playlist', 'Create a playlist for your workout today', '2023-01-16'),
--   (20, '2023-01-20 09:00:00', 'Active', 'Healthy Snack', 'Choose a healthy snack for your mid-morning break', '2023-01-13'),
--   (21, '2023-01-21 15:30:00', 'Inactive', 'DIY Project', 'Start a small DIY project for creativity', '2023-01-14'),
--   (22, '2023-01-22 11:45:00', 'Active', 'Deep Breathing', 'Practice deep breathing for stress relief', '2023-01-12'),
--   (23, '2023-01-23 18:00:00', 'Active', 'Gratitude Journaling', 'Write down three things you're grateful for', '2023-01-11'),
--   (24, '2023-01-24 07:00:00', 'Inactive', 'Morning Stretch', 'Start your day with a quick stretching routine', '2023-01-10'),
--   (25, '2023-01-25 21:00:00', 'Active', 'Nighttime Wind Down', 'Create a calming routine before bedtime', '2023-01-09');

