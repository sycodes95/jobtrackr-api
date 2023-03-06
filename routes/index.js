const express = require('express');
const router = express.Router();
const job_apps_controller = require('../controllers/jobAppsController')

router.post('/job-app-post', job_apps_controller.job_app_post)

module.exports = router;
