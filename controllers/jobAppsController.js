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
  
  const user_id = req.query.user_id;
  
  const queryText = `
    SELECT * FROM job_app WHERE user_id = $1 ORDER BY job_app_date DESC`;
    
  pool.query(queryText, [user_id], (errors, results) => {
    
    if (errors) {
      return next(errors);
    }
    res.json(results.rows);
  });
}

exports.job_app_sort_category_get = (req, res, next) => {
  
  const user_id = req.query.user_id ;
  const column = req.query.column ;
  const sortby = parseInt(req.query.sortby) === 1 ? 'ASC' : 'DESC';
  

  const jobAppIds = JSON.parse(req.query.jobAppIds || '[]');
  const queryText = `
    SELECT * FROM job_app WHERE user_id = $1 AND job_app_id = ANY($2::int[])
    ORDER BY ${column} ${sortby}`;
  
  pool.query(queryText, [user_id, jobAppIds], (errors, results) => {
    if (errors) {
      
      return res.status(500).json({ error: 'An unexpected error occurred' });
    }
    res.json(results.rows);
  });
  
}

exports.job_app_filter_get = (req,res,next) =>{
  const user_id = req.query.user_id;
  const filters = JSON.parse(req.query.filters);
  console.log(filters);
  let whereClause = 'WHERE user_id = $1';
  let queryParams = [user_id];

  for (const filter of filters) {
    console.log('BREAK',filter);
    if(filter.filter === 'APPLICATION STATUS' && filter.column !== null && filter.a !== null) {
      for(let i = 0; i < filter.column.length; ++i) {
        whereClause += ` AND ${filter.column[i]} ${filter.a[i]}`;
      }
    }

    if(filter.filter === 'FAVORITE' && filter.column !== null && filter.a !== null && filter.a !== false) {
      whereClause += ` AND ${filter.column} = ${filter.a}`;
    }

    if(filter.column && filter.a && filter.hasOwnProperty('b') && filter.b){
      whereClause += ` AND ${filter.column} BETWEEN $${queryParams.length + 1} AND $${queryParams.length + 2}`;
      queryParams.push(filter.a, filter.b);
    }

    if(filter.column && filter.a && filter.hasOwnProperty('b') && !filter.b) {
      whereClause += ` AND ${filter.column} >= $${queryParams.length + 1}`;
      queryParams.push(filter.a);
    }

    if(filter.column && !filter.a && filter.hasOwnProperty('b') && filter.b) {
      whereClause += ` AND ${filter.column} <= $${queryParams.length + 1}`;
      queryParams.push(filter.b);
    }
    
  }

  const query = {
    text: `SELECT * FROM job_app ${whereClause}`,
    values: queryParams
  };
  
  pool.query(query.text, query.values, (error, result) => {
    
    if (error) {
      console.error(error);
      return res.sendStatus(500);
    }
    res.json(result.rows);
  });
  

}

