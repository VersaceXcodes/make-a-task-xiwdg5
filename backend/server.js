const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const pg = require('pg');
const { Pool } = pg;
const path = require('path');

dotenv.config();

const { DATABASE_URL, PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT = 5432 } = process.env;

const pool = new Pool(
  DATABASE_URL
    ? { 
        connectionString: DATABASE_URL, 
        ssl: { require: true } 
      }
    : {
        host: PGHOST,
        database: PGDATABASE,
        user: PGUSER,
        password: PGPASSWORD,
        port: Number(PGPORT),
        ssl: { require: true },
      }
);

async function startServer() {
  const client = await pool.connect();

  const app = express();

  const port = process.env.PORT || 3000;
  app.use(cors());
  app.use(express.json({ limit: "5mb" }));

  // Serve static files from the 'public' directory
  app.use(express.static(path.join(__dirname, 'public')));

  app.get("/", (req, res) => {
    res.json({ message: "cofounder backend boilerplate :)" });
  });

  // Catch-all route for SPA routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
  // Start the server
  app.listen(3000, '0.0.0.0', () => {
    console.log(`Server running on port 3000 and listening on 0.0.0.0`);
  });
}

startServer();