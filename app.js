const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const cors = require('cors')
const pool = require('./db')
require('dotenv').config()

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: "dogs", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(cors({credentials: true, origin: [
  'http://localhost:3000', 
  'http://localhost:3001', 
  'http://localhost:3002', 
  'https://jobtrackr.up.railway.app', 
  'https://jobtrackr.pro', 
]}));
/*
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'https://jobtrackr.up.railway.app']);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
*/

app.use('/', indexRouter);
app.use('/users', usersRouter);

passport.use(
  new LocalStrategy({ usernameField: 'email' },(email, password, done) => {
    pool.query('SELECT * FROM user_info WHERE email = $1', [email], (err, user) => {
      if (err) { 
        return done(err);
      }
      if (user.rows.length === 0) {
        return done(null, false, { message: "Incorrect username" });
      }
      bcrypt.compare(password, user.rows[0].password, (err, res) => {
        if (res) {
          // passwords match! log user in
          return done(null, user)
        } else {
          
          // passwords do not match!
          return done(null, false, { message: "Incorrect password" })
        }
      })
      
    });
  })
);

passport.serializeUser(function(user, done) {
  
  const user_id = user.rows[0].user_id
  done(null, user_id);
});

passport.deserializeUser(function(id, done) {
  
  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, user) => {
    if (error) {
      throw error;
    }
    done(null, user.rows[0]);
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
 
module.exports = app;  
   