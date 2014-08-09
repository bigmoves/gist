var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('orchestrate')(require('./config').api_key);

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/gists/:key', function(req, res) {
  db.get('gists', req.params.key)
    .then(function(results) {
      res.json(results.body);
    })
    .fail(function(err) {
      res.status(err.statusCode)
        .json({ message: err.body.message });
    });
});

app.get('/api/gists/:key/revisions', function(req, res) {
  db.newEventReader()
    .from('gists', req.params.key)
    .type('revision')
    .list()
    .then(function(results) {
      res.json(results.body.results);
    })
    .fail(function(err) {
      res.status(err.statusCode)
        .json({ message: err.body.message });
    });
});

app.get('/api/gists/:key/:ref', function(req, res, next) {
  db.get('gists', req.params.key, req.params.ref)
    .then(function(results) {
      res.json(results.body);
    })
    .fail(function(err) {
      res.status(err.statusCode)
        .json({ message: err.body.message });
    });
});

app.put('/api/gists/:key', function(req, res) {
  db.put('gists', req.params.key, req.body)
    .then(function(results) {
      req.body.ref = results.headers.location.split('/')[5];
      return db.newEventBuilder()
        .from('gists', req.params.key)
        .type('revision')
        .data(req.body)
        .create();
    })
    .then(function(results) {
      req.body.key = req.params.key;
      res.json(req.body);
    })
    .fail(function(err) {
      res.status(err.statusCode)
        .json({ message: err.body.message });
    });
});

app.post('/api/gists', function(req, res) {
  db.post('gists', req.body)
    .then(function(results) {
      req.body.key = results.headers.location.split('/')[3];
      req.body.ref = results.headers.location.split('/')[5];
      return db.newEventBuilder()
        .from('gists', req.body.key)
        .type('revision')
        .data(req.body)
        .create();
    })
    .then(function() {
      res.json(req.body);
    })
    .fail(function(err) {
      res.status(err.statusCode)
        .json({ message: err.body.message });
    });
});

app.delete('/api/gists/:key', function(req, res) {
  db.remove('gists', req.params.key, true)
    .then(function(results) {
      res.status(results.statusCode).end();
    })
    .fail(function(err) {
      res.status(err.statusCode)
        .json({ message: err.body.message });
    });
});

app.get('*', function(req, res) {
  res.sendfile('./public/index.html');
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.json(err.status || 500, {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.json(err.status || 500, {
    message: err.message,
    error: {}
  });
});


module.exports = app;
