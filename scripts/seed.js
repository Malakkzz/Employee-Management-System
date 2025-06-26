import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfigPath = path.join(__dirname, '../database.yaml');
const dbConfig = yaml.load(fs.readFileSync(dbConfigPath, 'utf8'));

const {
  'sqlite_path': sqlitePath,
} = dbConfig;

const db = new sqlite3.Database(sqlitePath);

const employees = [
  {
    full_name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    date_of_birth: '1990-01-01',
    job_title: 'Developer',
    department: 'Engineering',
    salary: 55000,
    start_date: '2022-01-15',
    end_date: null,
    photo_path: 'photos/john.jpg',
    cv_path: JSON.stringify(['docs/john_cv.pdf', 'docs/john_id.pdf']),
  },
  {
    full_name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '234-567-8901',
    date_of_birth: '1988-06-21',
    job_title: 'Designer',
    department: 'Design',
    salary: 50000,
    start_date: '2021-04-10',
    end_date: null,
    photo_path: 'photos/jane.jpg',
    cv_path: JSON.stringify(['docs/jane_cv.pdf']),
  },
  {
    full_name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '345-678-9012',
    date_of_birth: '1995-11-30',
    job_title: 'HR Manager',
    department: 'HR',
    salary: 60000,
    start_date: '2020-09-01',
    end_date: '2023-12-31',
    photo_path: 'photos/alice.jpg',
    cv_path: JSON.stringify(['docs/alice_cv.pdf', 'docs/alice_id.pdf']),
  },
];

const timesheets = [
  {
   employee_id: 1,
    start_time: '2025-02-10 08:00:00',
    end_time: '2025-02-10 17:00:00',
    summary: 'Worked on project Alpha',
    
  },
  {
    employee_id: 2,
    start_time: '2025-02-11 12:00:00',
    end_time: '2025-02-11 17:00:00',
    summary: 'UI design session',
  },
  {
    employee_id: 3,
    start_time: '2025-02-12 07:00:00',
    end_time: '2025-02-12 16:00:00',
    summary: 'HR onboarding planning',
  },
];


const insertData = (table, data) => {
  const columns = Object.keys(data[0]).join(', ');
  const placeholders = Object.keys(data[0]).map(() => '?').join(', ');

  const insertStmt = db.prepare(`INSERT INTO ${table} (${columns}) VALUES (${placeholders})`);

  data.forEach(row => {
    insertStmt.run(Object.values(row));
  });

  insertStmt.finalize();
};

db.serialize(() => {
  insertData('employees', employees);
  insertData('timesheets', timesheets);
});

db.close(err => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Database seeded successfully.');
  }
});

