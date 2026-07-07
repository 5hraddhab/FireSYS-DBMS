const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'YOUR_PASSWORD', // 🔴 put your password
  database: 'fire_dispatch'
});

db.connect(err => {
  if (err) {
    console.log("DB Error:", err);
    return;
  }
  console.log('MySQL Connected');
});

// ================= INCIDENTS =================
app.get('/incidents', (req, res) => {
  db.query('SELECT * FROM incidents', (err, result) => {
    res.json(result);
  });
});

app.post('/incidents', (req, res) => {
  const { location, type, severity } = req.body;

  db.query(
    'INSERT INTO incidents (location, type, status, severity) VALUES (?, ?, "Active", ?)',
    [location, type, severity],
    () => res.send("Added")
  );
});

// ================= FIREFIGHTERS =================
app.get('/firefighters', (req, res) => {
  db.query('SELECT * FROM firefighters', (err, result) => {
    res.json(result);
  });
});

app.post('/firefighters', (req, res) => {
  const { name } = req.body;

  db.query(
    'INSERT INTO firefighters (name, status) VALUES (?, "Available")',
    [name],
    () => res.send("Added")
  );
});

// ================= TRUCKS =================
app.get('/trucks', (req, res) => {
  db.query('SELECT * FROM trucks', (err, result) => {
    res.json(result);
  });
});

app.post('/trucks', (req, res) => {
  const { name } = req.body;

  db.query(
    'INSERT INTO trucks (name, status) VALUES (?, "Available")',
    [name],
    () => res.send("Added")
  );
});

// ================= DISPATCH =================
app.post('/dispatch', (req, res) => {
  const { incidentId, truckId } = req.body;

  db.query(
    'INSERT INTO dispatch (incident_id, truck_id, status) VALUES (?, ?, "Assigned")',
    [incidentId, truckId],
    () => {
      db.query('UPDATE trucks SET status="Busy" WHERE id=?', [truckId]);
      db.query('UPDATE incidents SET status="In Progress" WHERE id=?', [incidentId]);
      res.send("Dispatched");
    }
  );
});

// ================= START =================
app.listen(5000, () => {
  console.log('Server running on port 5000');
});