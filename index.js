const express = require('express');
const app = express();
const port = 8080;
app.use(express.json());

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});
app.listen(port, () => { 
    console.log(`App running on port ${port}.`)
});

app.post('/students', (req, res) => {
    const { name, age, major, hobby } = req.body;
    pool.query('INSERT INTO students(name, age, major, hobby) VALUES($1, $2, $3, $4) RETURNING *', 
               [name, age, major, hobby], 
               (error, results) => {
        if (error) {
            res.status(500).json({ status: 'error', message: error.toString() });
        } else {
            res.status(200).json({ status: 'success', message: 'Inserted the following student:', data: results.rows[0] });
        }
    });
});


app.get('/students/:id', (req, res) => {
    const id = req.params.id;
    pool.query('SELECT * FROM students WHERE student_id = $1', [id], (error, results) => {
        if (error) {
            res.status(500).json({ status: 'error', message: error.toString() });
        } else {
            res.status(200).json({ status: 'success', data: results.rows[0] });
        }
    });
});
