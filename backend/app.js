var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(require('connect-history-api-fallback')());
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/api', require('./routes'))
/* var indexRouter = require('./routes/index');
var scrapRouter = require('./routes/scraps');
var authorRouter = require('./routes/authors');
var movieRouter = require('./routes/movies');
var topicRouter = require('./routes/topics');
app.use('/', indexRouter);
app.use('/api/scraps', scrapRouter);
app.use('/api/authors', authorRouter);
app.use('/api/movies', movieRouter);
app.use('/api/topics', topicRouter); */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
  console.log('404 not found...');
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

module.exports = app;
