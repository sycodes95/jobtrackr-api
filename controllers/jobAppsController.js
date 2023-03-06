const pool = require('../db')

exports.job_app_post = (req, res, next) => {
  const { company_name, user_id} = req.body;
  
  const queryText = `
    INSERT INTO job_app
    (company_name, user_id) 
    VALUES ($1, $2) 
    RETURNING job_app_id`;
    
  pool.query(queryText, [company_name, user_id], (err, results) => {
    if (err) {
      return next(err);
    }
    res.json(results.rows[0]);
  });
}

