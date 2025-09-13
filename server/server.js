const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Configure your PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'newspaper_tracker',
    password: 'database123',
    port: 5432,
});

// Test the database connection
pool.query('SELECT NOW()')
    .then(res => console.log('PostgreSQL connected successfully!'))
    .catch(err => console.error('Connection error:', err.stack));

// API to get all daily entries for a specific month/year
app.get('/api/daily-entries/:year/:month', async (req, res) => {
    const { year, month } = req.params;
    try {
        const result = await pool.query(
            `SELECT * FROM daily_entries
             WHERE EXTRACT(YEAR FROM date) = $1 AND EXTRACT(MONTH FROM date) = $2
             ORDER BY date ASC;`,
            [year, month]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching daily entries:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API to save/update daily entry
app.post('/api/daily-entry', async (req, res) => {
    const { date, aaj_ka_anand_price, times_of_india_price } = req.body;
    try {
        // Calculate the total daily price, assuming a count of 1 for each
        const totalDailyPrice = (aaj_ka_anand_price * 1) + (times_of_india_price * 1);

        // Save the daily entry to the database
        const result = await pool.query(
            `INSERT INTO daily_entries (date, aaj_ka_anand_price, times_of_india_price, total_daily_price)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (date) DO UPDATE SET
             aaj_ka_anand_price = EXCLUDED.aaj_ka_anand_price,
             times_of_india_price = EXCLUDED.times_of_india_price,
             total_daily_price = EXCLUDED.total_daily_price
             RETURNING *;`,
            [date, aaj_ka_anand_price, times_of_india_price, totalDailyPrice]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error saving daily entry:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API to get a list of all newspapers
app.get('/api/newspapers', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM newspapers;');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching newspapers:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});