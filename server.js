require('dotenv').config();
const express  = require('express');
const mysql    = require('mysql2/promise');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const cors     = require('cors');
const path     = require('path');
const bcrypt = require('bcryptjs');
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 3306,
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASS     || '',
  database: process.env.DB_NAME     || 'sudeep_portfolio',
  waitForConnections: true,
  connectionLimit: 10
});

function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorised' });
  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// AUTH
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'username and password required' });
  try {
    const [rows] = await pool.query('SELECT * FROM admin_users WHERE username = ?', [username]);
    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, rows[0].password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: rows[0].id, username: rows[0].username }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/change-password', authRequired, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < 6)
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  try {
    const [rows] = await pool.query('SELECT * FROM admin_users WHERE id = ?', [req.admin.id]);
    const match = await bcrypt.compare(currentPassword, rows[0].password);
    if (!match) return res.status(401).json({ error: 'Current password incorrect' });
    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE admin_users SET password = ? WHERE id = ?', [hash, req.admin.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUBLIC
app.get('/api/portfolio', async (req, res) => {
  try {
    const [[profile]]      = await pool.query('SELECT * FROM profile LIMIT 1');
    const [links]          = await pool.query('SELECT * FROM links ORDER BY sort_order, id');
    const [skills]         = await pool.query('SELECT * FROM skills ORDER BY sort_order, id');
    const [projects]       = await pool.query('SELECT * FROM projects ORDER BY sort_order, id');
    const [education]      = await pool.query('SELECT * FROM education ORDER BY sort_order, id');
    const [certifications] = await pool.query('SELECT * FROM certifications ORDER BY sort_order, id');
    const [achievements]   = await pool.query('SELECT * FROM achievements ORDER BY sort_order, id');
    res.json({ profile, links, skills, projects, education, certifications, achievements });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN - Profile
app.put('/api/admin/profile', authRequired, async (req, res) => {
  const { name, title, bio, email, phone } = req.body;
  try {
    await pool.query('UPDATE profile SET name=?, title=?, bio=?, email=?, phone=? WHERE id=1', [name, title, bio, email, phone]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ADMIN - Links
app.post('/api/admin/links', authRequired, async (req, res) => {
  const { label, url } = req.body;
  try {
    const [r] = await pool.query('INSERT INTO links (label, url) VALUES (?,?)', [label, url]);
    res.json({ id: r.insertId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/admin/links/:id', authRequired, async (req, res) => {
  try {
    await pool.query('DELETE FROM links WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ADMIN - Skills
app.post('/api/admin/skills', authRequired, async (req, res) => {
  const { category, skill } = req.body;
  try {
    const [r] = await pool.query('INSERT INTO skills (category, skill) VALUES (?,?)', [category, skill]);
    res.json({ id: r.insertId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/admin/skills/:id', authRequired, async (req, res) => {
  try {
    await pool.query('DELETE FROM skills WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ADMIN - Projects
app.post('/api/admin/projects', authRequired, async (req, res) => {
  const { name, stack, description, status, url } = req.body;
  try {
    const [r] = await pool.query('INSERT INTO projects (name, stack, description, status, url) VALUES (?,?,?,?,?)', [name, stack, description, status, url]);
    res.json({ id: r.insertId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.put('/api/admin/projects/:id', authRequired, async (req, res) => {
  const { name, stack, description, status, url } = req.body;
  try {
    await pool.query('UPDATE projects SET name=?, stack=?, description=?, status=?, url=? WHERE id=?', [name, stack, description, status, url, req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/admin/projects/:id', authRequired, async (req, res) => {
  try {
    await pool.query('DELETE FROM projects WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ADMIN - Education
app.post('/api/admin/education', authRequired, async (req, res) => {
  const { degree, school, place, score, year } = req.body;
  try {
    const [r] = await pool.query('INSERT INTO education (degree, school, place, score, year) VALUES (?,?,?,?,?)', [degree, school, place, score, year]);
    res.json({ id: r.insertId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.put('/api/admin/education/:id', authRequired, async (req, res) => {
  const { degree, school, place, score, year } = req.body;
  try {
    await pool.query('UPDATE education SET degree=?, school=?, place=?, score=?, year=? WHERE id=?', [degree, school, place, score, year, req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/admin/education/:id', authRequired, async (req, res) => {
  try {
    await pool.query('DELETE FROM education WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ADMIN - Certifications
app.post('/api/admin/certifications', authRequired, async (req, res) => {
  const { name, issued_by } = req.body;
  try {
    const [r] = await pool.query('INSERT INTO certifications (name, issued_by) VALUES (?,?)', [name, issued_by]);
    res.json({ id: r.insertId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/admin/certifications/:id', authRequired, async (req, res) => {
  try {
    await pool.query('DELETE FROM certifications WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ADMIN - Achievements
app.post('/api/admin/achievements', authRequired, async (req, res) => {
  const { title, issued_by, rank_badge } = req.body;
  try {
    const [r] = await pool.query('INSERT INTO achievements (title, issued_by, rank_badge) VALUES (?,?,?)', [title, issued_by, rank_badge]);
    res.json({ id: r.insertId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/admin/achievements/:id', authRequired, async (req, res) => {
  try {
    await pool.query('DELETE FROM achievements WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Catch-all
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// START
app.listen(PORT, async () => {
  console.log('\n===========================================');
  console.log('  Server : http://localhost:' + PORT);
  console.log('  Admin  : http://localhost:' + PORT + '/admin.html');
  console.log('===========================================\n');

  // Test DB
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query('SELECT COUNT(*) AS cnt FROM profile');
    conn.release();
    console.log('MySQL OK - profile rows: ' + rows[0].cnt);
  } catch (err) {
    console.error('MySQL FAILED: ' + err.message);
    console.error('Check .env:');
    console.error('  DB_HOST=' + process.env.DB_HOST);
    console.error('  DB_USER=' + process.env.DB_USER);
    console.error('  DB_NAME=' + process.env.DB_NAME);
    console.error('  DB_PASS=' + (process.env.DB_PASS ? '(set)' : 'EMPTY - THIS IS THE PROBLEM'));
    return;
  }

  // Fix admin password if it was hashed with native bcrypt
  try {
    const conn = await pool.getConnection();
    const [admins] = await conn.query('SELECT * FROM admin_users WHERE username = ?', ['admin']);
    conn.release();
    if (!admins.length) {
      console.error('No admin user found! Run setup.sql again.');
    } else {
      const valid = await bcrypt.compare('admin123', admins[0].password);
      if (!valid) {
        console.log('Password hash mismatch - auto-fixing...');
        const newHash = await bcrypt.hash('admin123', 10);
        const conn2 = await pool.getConnection();
        await conn2.query('UPDATE admin_users SET password = ? WHERE username = ?', [newHash, 'admin']);
        conn2.release();
        console.log('Password fixed! Login: admin / admin123');
      } else {
        console.log('Admin OK - Login: admin / admin123');
      }
    }
  } catch (err) {
    console.error('Admin check error: ' + err.message);
  }
});
