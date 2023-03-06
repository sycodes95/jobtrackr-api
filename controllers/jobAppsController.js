const pool = require('../db')

exports.job_app_post = (req,res,next) =>{
  console.log(req.body)
  
  const {company_name, email} = req.body;
  
  const queryText = `
    INSERT INTO job_app
    (company_name, email) 
    VALUES ($1, $2) 
    RETURNING job_app_id`;
  pool.query(queryText, [company_name, email], (err, results) => {
    if (err) {
      return next(err);
    }
    res.json(results.rows[0]);
  });
  
}

