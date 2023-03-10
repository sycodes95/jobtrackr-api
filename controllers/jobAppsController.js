const pool = require('../db')

exports.job_app_post = (req, res, next) => {
  
  const {company_name, company_website, company_favorite, job_app_date, job_app_method,
    job_source_website, job_position, job_fit_rating, job_location, response_date,
    interview_date, offer_amount, rejected, contact_person_name, contact_person_email,
    contact_person_phone, notes, user_id} = req.body;
  
  const queryText = `
    INSERT INTO job_app
    (company_name, company_website, company_favorite, job_app_date, job_app_method,
    job_source_website, job_position, job_fit_rating, job_location, response_date,
    interview_date, offer_amount, rejected, contact_person_name, contact_person_email,
    contact_person_phone, notes, user_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) 
    RETURNING job_app_id`;
    
  pool.query(queryText, [company_name, company_website, company_favorite, job_app_date, job_app_method,
    job_source_website, job_position, job_fit_rating, job_location, response_date,
    interview_date, offer_amount, rejected, contact_person_name, contact_person_email,
    contact_person_phone, notes, user_id], (errors, results) => {
    if (errors) {
      return res.json(errors);
    }
    res.json(results.rows[0]);
  });
}

exports.job_app_all_get = (req, res, next) => {
  console.log('PARAMSSS', req.params);
  const user_id = req.query.user_id;
  
  const queryText = `
    SELECT * FROM job_app WHERE user_id = $1 ORDER BY job_app_date DESC`;
    
  pool.query(queryText, [user_id], (errors, results) => {
    console.log('RESULTSSS', results);
    if (errors) {
      return next(errors);
    }
    res.json(results.rows);
  });
}

