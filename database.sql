CREATE DATABASE jobtrackr;

CREATE TABLE job_app(
  job_app_id SERIAL PRIMARY KEY,
  company_name VARCHAR(69) NOT NULL UNIQUE,
  user_id INTEGER REFERENCES user_info(user_id);
);

CREATE TABLE user(
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);