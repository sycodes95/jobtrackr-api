const express = require('express');
const router = express.Router();
const job_apps_controller = require('../controllers/jobAppsController')


router.post('/job-app-post', job_apps_controller.job_app_post)

router.put('/job-app-put', job_apps_controller.job_app_put)

router.get('/job-app-get', job_apps_controller.job_app_get)

router.get('/job-app-all-get-unpaginated', job_apps_controller.job_app_all_get_unpaginated)

router.delete('/job-app-delete', job_apps_controller.job_app_delete)

module.exports = router;
 