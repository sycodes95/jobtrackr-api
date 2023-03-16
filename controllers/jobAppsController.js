const pool = require("../db");

exports.job_app_post = (req, res, next) => {
  const {
    company_name,
    company_website,
    company_favorite,
    job_app_date,
    job_app_method,
    job_source_website,
    job_position,
    job_fit_rating,
    job_location,
    response_date,
    interview_date,
    offer_amount,
    rejected,
    contact_person_name,
    contact_person_email,
    contact_person_phone,
    notes,
    user_id,
  } = req.body;

  const queryText = `
    INSERT INTO job_app
    (company_name, company_website, company_favorite, job_app_date, job_app_method,
    job_source_website, job_position, job_fit_rating, job_location, response_date,
    interview_date, offer_amount, rejected, contact_person_name, contact_person_email,
    contact_person_phone, notes, user_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) 
    RETURNING job_app_id`;

  pool.query(
    queryText,
    [
      company_name,
      company_website,
      company_favorite,
      job_app_date,
      job_app_method,
      job_source_website,
      job_position,
      job_fit_rating,
      job_location,
      response_date,
      interview_date,
      offer_amount,
      rejected,
      contact_person_name,
      contact_person_email,
      contact_person_phone,
      notes,
      user_id,
    ],
    (errors, results) => {
      if (errors) {
        return res.json(errors);
      }
      res.json(results.rows[0]);
    }
  );
};

exports.job_app_put = (req, res, next) => {
  const { user_id, job_app_id, ...fieldsToUpdate } = req.body;

  const queryArr = [];
  const queryValues = [];

  for (const [key, value] of Object.entries(fieldsToUpdate)) {
    queryArr.push(`${key} = $${queryArr.length + 1}`);
    queryValues.push(value);
  }
 
  const queryText = `
    UPDATE job_app
    SET ${queryArr.join(',')}
    WHERE job_app_id = $${queryValues.length + 1} AND user_id = $${queryValues.length + 2}`;

  queryValues.push(job_app_id);
  queryValues.push(user_id);
  
  pool.query(queryText, queryValues, (errors, results) => {
    if (errors) {
      return res.json(errors);
    }
    res.json(results);
  });
};

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
};

exports.job_app_search_get = (req, res, next) => {
  const searchText = req.query.searchText
  console.log(searchText);
  const user_id = req.query.user_id
  const queryText = `
    SELECT * FROM job_app
    WHERE (job_app_date::text ILIKE $1
    OR company_name::text ILIKE $1
    OR company_website::text ILIKE $1
    OR job_app_method::text ILIKE $1
    OR job_source_website::text ILIKE $1
    OR job_position::text ILIKE $1
    OR job_fit_rating::text ILIKE $1
    OR job_location::text ILIKE $1
    OR response_date::text ILIKE $1
    OR interview_date::text ILIKE $1
    OR offer_amount::text ILIKE $1
    OR rejected::text ILIKE $1)
    AND user_id = $2
  `;

  pool.query(queryText, [`%${searchText}%`, user_id], (errors, results) => {
    if (errors) {
      return next(errors);
    }
    res.json(results.rows);
  });
};

exports.job_app_sort_category_get = (req, res, next) => {
  const user_id = req.query.user_id;
  const column = req.query.column;
  const sortby = parseInt(req.query.sortby) === 1 ? "ASC" : "DESC";

  const jobAppIds = JSON.parse(req.query.jobAppIds || "[]");
  const queryText = `
    SELECT * FROM job_app WHERE user_id = $1 AND job_app_id = ANY($2::int[])
    ORDER BY ${column} ${sortby}`;

  pool.query(queryText, [user_id, jobAppIds], (errors, results) => {
    if (errors) {
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
    res.json(results.rows);
  });
};

exports.job_app_filter_get = (req, res, next) => {
  const user_id = req.query.user_id;
  const filters = JSON.parse(req.query.filters);
  console.log(filters);
  let whereClause = "WHERE user_id = $1";
  let queryParams = [user_id];

  for (const filter of filters) {
    console.log("BREAK", filter);
    if (
      filter.filter === "APPLICATION STATUS" &&
      filter.column !== null &&
      filter.a !== null
    ) {
      for (let i = 0; i < filter.column.length; ++i) {
        whereClause += ` AND ${filter.column[i]} ${filter.a[i]}`;
      }
    }

    if (
      filter.filter === "FAVORITE" &&
      filter.column !== null &&
      filter.a !== null &&
      filter.a !== false
    ) {

      whereClause += ` AND ${filter.column} = ${filter.a}`;
    }

    if (filter.column && filter.a && filter.hasOwnProperty("b") && filter.b) {
      whereClause += ` AND ${filter.column} BETWEEN $${
        queryParams.length + 1
      } AND $${queryParams.length + 2}`;
      queryParams.push(filter.a, filter.b);
    }

    if (filter.column && filter.a && filter.hasOwnProperty("b") && !filter.b) {
      whereClause += ` AND ${filter.column} >= $${queryParams.length + 1}`;
      queryParams.push(filter.a);
    }

    if (filter.column && !filter.a && filter.hasOwnProperty("b") && filter.b) {
      whereClause += ` AND ${filter.column} <= $${queryParams.length + 1}`;
      queryParams.push(filter.b);
    }
  }

  const query = {
    text: `SELECT * FROM job_app ${whereClause}`,
    values: queryParams,
  };

  pool.query(query.text, query.values, (error, result) => {
    if (error) {
      console.error(error);
      return res.sendStatus(500);
    }
    res.json(result.rows);
  });
};

exports.job_app_delete = (req, res, next)=> {
  const job_app_id = req.query.job_app_id;
  const user_id = req.query.user_id;

  const queryText = `DELETE FROM job_app WHERE job_app_id = $1 AND user_id = $2`
  pool.query(queryText, [job_app_id, user_id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json('Error deleting row');
    } else {
      res.json(result);
    }
  });
}
