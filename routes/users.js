const express = require('express');
const router = express.Router();
const users_controller = require('../controllers/usersController')


router.post('/verify-token-get', users_controller.verify_token_get)

router.post('/sign-up-post', users_controller.sign_up_post)

module.exports = router;
