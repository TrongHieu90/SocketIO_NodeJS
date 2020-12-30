var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
const port = 8080;
const server = require('http').createServer(app);
const io = require('socket.io')(server);


// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/stylesheets', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/javascripts', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/javascripts', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use(express.static(path.join(__dirname, 'public')));


//app.use('/', indexRouter);
//app.get('/', (req, res) => res.sendFile(__dirname + 'public/index.html'));
//app.use('/users', usersRouter);

const userArray = [];

io.on('connection', socket => {
    userArray.push(socket.id);
    console.log(userArray);
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

server.listen(port , ()=> console.log('Connected at port: ' + port));

module.exports = app;
