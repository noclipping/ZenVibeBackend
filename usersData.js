const { Pool } = require('pg')
require('dotenv').config()
const bcrypt = require('bcrypt')
const { users, createTables, insertQueries } = require('./seedData/seedData.js')
const pool = new Pool ({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})

//user data seeded before other data; password is hashed before being inserted into the database
async function seedDatabase() {
    
    try {
        await pool.query(createTables);
        console.log('Tables created');

        for (let user of users) {
            console.log(user, "user")
            const saltRounds = 10
            const hashedPassword = await bcrypt.hash(user.password_hash, saltRounds);
            const height_inches = (user.feet * 12) + user.inches
            await pool.query(
                'INSERT INTO users (username, password_hash, email, original_weight, feet, inches, height_inches, age, goal_weight) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', 
                [user.username, hashedPassword, user.email, user.original_weight, user.feet, user.inches, height_inches, user.age, user.goal_weight]
            );
        }
        console.log('Users seeded');

        await pool.query(insertQueries);
        console.log(insertQueries, "queries")
        console.log('Other data seeded');

    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

seedDatabase()