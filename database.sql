

CREATE DATABASE `master`;

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  name varchar(30) NOT NULL,
  email varchar(30) NOT NULL UNIQUE,
  password varchar(255) NOT NULL,
  role TEXT CHECK(role IN ('admin', 'user')) NOT NULL
);

INSERT INTO users (username, name, password, role) VALUES ('pavolslovak', "Pavol Slovak" ,'admin', 'admin');



CREATE TABLE todos(
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  status TEXT CHECK(status IN ('todo', 'in_progress', 'done')) DEFAULT 'todo',
  isfavourite BOOLEAN DEFAULT FALSE,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO todos ( description,status, user_id) VALUES ('Learn SQL from scratch','in_progress', 1);




/* Commands */


-- psql -U postgres -d master connect to the database from the terminal

-- \conninfo show connection info
-- \q quit postgres
-- \l list all databases
-- \c  <database name> connect to a new database
-- \dt list all tables
-- \d <table name> describe a table



-- run postgresql terminal in vscode
-- brew update
-- brew install postgresql
-- brew services start postgresql  // start postgresql
-- psql -U postgres -d <database name> // connect to the database


