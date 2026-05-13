# Sudeep P — Portfolio (Full-Stack)

## Stack
- **Frontend**: Vanilla HTML/CSS/JS (no build step)
- **Backend**: Node.js + Express
- **Database**: MySQL
- **Auth**: JWT + bcrypt (admin-only)

## Project Structure
```
portfolio/
├── server.js          ← Express API server
├── schema.sql         ← MySQL schema + seed data
├── package.json
├── .env.example       ← copy to .env and fill in values
└── public/
    ├── index.html     ← Public portfolio page
    └── admin.html     ← Admin panel (login required)
```

## Setup

### 1. MySQL
```bash
mysql -u root -p < schema.sql
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
# Edit .env with your DB credentials and a strong JWT_SECRET
```

### 4. Start the server
```bash
npm start          # production
npm run dev        # development (auto-reload with nodemon)
```

The server runs on **http://localhost:3000**

- Portfolio:  http://localhost:3000/
- Admin:      http://localhost:3000/admin.html

## Default Admin Credentials
```
Username: admin
Password: admin123
```
**Change the password immediately after first login** via the Admin → Change Password tab.

## How it works
- `GET /api/portfolio` — public endpoint, returns all portfolio data as JSON
- `POST /api/login`    — returns JWT token (8h expiry)
- `PUT/POST/DELETE /api/admin/*` — protected routes, require Bearer token
- The public `index.html` fetches `/api/portfolio` on load and renders everything
- The `admin.html` stores the JWT in localStorage and includes it in all API calls

## Changing the admin password (via SQL if needed)
```bash
node -e "const b=require('bcrypt'); b.hash('yourNewPassword',10).then(h=>console.log(h))"
# Copy the hash, then:
mysql -u root -p sudeep_portfolio -e "UPDATE admin_users SET password='HASH_HERE' WHERE username='admin';"
```

## Deployment tips
- Use **nginx** as a reverse proxy in front of Node
- Set `NODE_ENV=production` in `.env`
- Use **PM2** to keep the server running: `pm2 start server.js --name portfolio`
- Keep `.env` out of version control (it's in `.gitignore`)
