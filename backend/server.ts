import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import pg from 'pg';
const { Pool } = pg;
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { DATABASE_URL, PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT = 5432 } = process.env;

const pool = new Pool(
  DATABASE_URL
    ? { 
        connectionString: DATABASE_URL, 
        ssl: { rejectUnauthorized: false } 
      }
    : {
        host: PGHOST,
        database: PGDATABASE,
        user: PGUSER,
        password: PGPASSWORD,
        port: Number(PGPORT),
        ssl: { rejectUnauthorized: false },
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

  app.get("/", (req: Request, res: Response) => {
    res.json({ message: "cofounder backend boilerplate :)" });
  });

  // Catch-all route for SPA routing
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
  // Start the server
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port} and listening on 0.0.0.0`);
  });
}

startServer();

