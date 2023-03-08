CREATE DATABASE jobtrackr;

CREATE TYPE job_location_type AS ENUM ('On-site', 'Remote', 'Hybrid', 'Both');


CREATE TABLE job_app(
  job_app_id SERIAL PRIMARY KEY,

  company_favorite BOOLEAN,
  company_name VARCHAR(69) NOT NULL UNIQUE,

  job_title VARCHAR(69)
  job_fit_rating INTEGER, /1/10
  job_app_date DATE,
  job_app_method VARCHAR(69), //Company Website, Job Board Website, Recruiter
  job_source_website VARCHAR(69),

  response BOOLEAN,
  response_date DATE,
  response_rejected BOOLEAN,

  interview BOOLEAN,
  interview_date DATE,
  interview_rejected BOOLEAN,

  offer BOOLEAN,
  offer_amount INTEGER,
  job_location job_location_type, //On site, remote, hybrid, both

  contact_person_name VARCHAR(69)
  contact_person_email VARCHAR()
  contact_person_phone VARCHAR(20)

  notes VARCHAR(255)

  user_id INTEGER REFERENCES user_info(user_id);
);

CREATE TABLE user_info(
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);