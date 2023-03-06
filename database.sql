CREATE DATABASE jobtrackr;

CREATE TABLE job_app(
  job_app_id SERIAL PRIMARY KEY,
  company_name VARCHAR(69),
  email VARCHAR(255)
);