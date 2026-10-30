CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company VARCHAR(150) NOT NULL,
  role VARCHAR(150) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Applied'
    CHECK (status IN ('Applied', 'Interview', 'Offer', 'Rejected')),
  job_link TEXT,
  salary VARCHAR(50),
  notes TEXT,
  applied_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW()
);