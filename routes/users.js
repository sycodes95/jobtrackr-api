const express = require('express');
const router = express.Router();
const users_controller = require('../controllers/usersController')


router.get('/verify-token-get', users_controller.verify_token_get)

router.post('/sign-up-post', users_controller.sign_up_post)

router.get('/log-in-get', users_controller.log_in_get)

router.post('/log-in-post', users_controller.log_in_post)

router.get('/log-out-get', users_controller.log_in_get)

module.exports = router;
