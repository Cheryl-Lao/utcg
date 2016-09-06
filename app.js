var express = require('express');
var path = require('path');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var app = express();

app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.text({ type: 'text/html' }));
app.use(express.static(path.join(__dirname, '/public')));

var db_config = {
  host     : 'us-cdbr-iron-east-04.cleardb.net',
  user     : 'b9f4c4c08a6b24',
  password : '2b8e5918',
  database : 'heroku_f723c3ee1ec533c'
};

var conn = mysql.createConnection(db_config);

function handleDisconnect() {
  conn = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

  conn.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  conn.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();

app.get('/', function(req, res) {
  res.render('home', {
    title:'UTCG | Home'
  });
})

app.get('/about', function(req, res) {
  res.render('home', {
    title:'UTCG | About'
  });
})

app.get('/workshops', function(req, res) {
  res.render('home', {
    title:'UTCG | Workshops'
  });
})

app.get('/gallery', function(req, res) {
  res.render('home', {
    title:'UTCG | Gallery'
  });
})

app.get('/contact', function(req, res) {
  res.render('home', {
    title:'UTCG | Contact'
  });
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});
