const pool = require('../db')

const passport = require("passport");

const bcrypt = require("bcryptjs")

const jwt = require('jsonwebtoken')

const { check, body, validationResult } = require("express-validator");

require('dotenv').config()

exports.verify_token_get = (req,res,next) => {
  
  const bearerHeader = req.headers['authorization'];
  
  if(typeof bearerHeader !== 'undefined'){
    const bearer = bearerHeader.split(' ')
    const bearerToken = bearer[1];
    
    jwt.verify(bearerToken, process.env.JWT_SECRETKEY, (err, user)=>{
      
      if(err) { 
        return res.status(401).json({error: "Invalid token"});
      } else {
        
        res.json({
          message: 'User authorized',
          user
        })
      }
    })
  } else {
    return res.status(401).json({error: "Invalid token"}); 
  }
}

exports.sign_up_post = [
  body('email').isEmail(),
  check('password').exists(),
  check('confirm_password')
    .exists()
    .custom((value, { req }) => {
      if(value !== req.body.password){
        throw new Error('Passwords don\'t match')
      }
      return true
    }),
    
  (req, res, next) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(errors);
    }
    const plainPassword = req.body.password
    
    bcrypt.hash(plainPassword, 10, (err, hashedPassword) =>{
      if(err){
        return next(err)
      }
      const queryText = `
        INSERT INTO user_info
        ( email, password) 
        VALUES ($1, $2) 
        RETURNING *`;
      const values = [
        req.body.email,
        hashedPassword,
      ];
      pool.query(queryText, values, (errors, result) => {
        
        if (errors) { 
          return res.json({errors});
        }
        res.json({user: result.rows[0]});
      });
      
      
    })
    
  }
];

exports.log_in_get = (req, res) =>{
  res.json({user: req.user})
}

exports.log_in_post = (req, res, next) =>{
  passport.authenticate("local", (errors, user) =>{
    
    if(errors) {
      
      return next(errors)
    }
    if(user.length === 0 || !user){
      return res.json('no user')
    }
    req.logIn(user, (errors) =>{
      if(errors) {
        
        return next(errors)
      }
      //return res.render('index', {user: user})
      const token = jwt.sign({ user: user}, process.env.JWT_SECRETKEY);
      return res.json({token})
    })
  })(req,res,next)
}

exports.log_out_get = (req,res,next) =>{
  req.logout(function (err){
    if(err) {
      return res.json({error: err})
    }
    res.clearCookie('token');
    res.json({logout: 'Log out successful'})
  })
}