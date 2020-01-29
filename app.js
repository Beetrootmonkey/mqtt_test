var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://beetrootmonkey.com');

client.on('connect', function () {
  client.subscribe('test/message', function (err) {
    if (!err) {
      console.log('Connected!');
      client.publish('test/message', 'Server started');
    } else {
      console.error('Error: couldn\' connect!');
    }
  });
});

client.on('message', function (topic, message) {
  // message is Buffer
  console.log('Received message:', message.toString());
});

var mosca = require('mosca');
var broker = new mosca.Server({});
var path = require('path');

app.use(express.static(path.dirname(require.resolve('mosca')) + '/public'));

// app.listen(3000);

module.exports = app;
