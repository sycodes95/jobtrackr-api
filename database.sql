CREATE DATABASE jobtrackr;






CREATE TABLE job_app(
  job_app_id SERIAL PRIMARY KEY,
  job_app_date DATE, [FILTER]
  company_favorite BOOLEAN, [FILTER]
  company_name VARCHAR(69) NOT NULL UNIQUE,
  company_website VARCHAR(255),

  job_app_method VARCHAR(69), //Company Website, Job Board Website, Recruiter, Referral, Other [FILTER]
  job_source_website VARCHAR(69), X
  job_position VARCHAR(69),
  job_fit_rating INTEGER, [FILTER]
  job_location job_location_type, //On site, remote, hybrid, both [FILTER]
  
  response_date DATE, [FILTER] [COMPARE]
  interview_date DATE, [FILTER] [COMPARE]
  offer_amount INTEGER, [FITLER] [COMPARE]
  rejected VARCHAR,//Res Rejected, Int Rejected [FILTER] 

  contact_person_name VARCHAR(69) [MODAL]
  contact_person_email VARCHAR(69) [MODAL]
  contact_person_phone VARCHAR(20) [MODAL]

  notes VARCHAR(255) [MODAL]

  user_id INTEGER REFERENCES user_info(user_id);
);

CREATE TABLE user_info(
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);