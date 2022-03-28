-- create uuid
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE users (
  user_id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(70) NOT NULL

  )