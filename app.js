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
    title:'UTCG | Home',
    content: `
    <h1>Welcome to the University of Toronto Computer Graphics Club.</h1>

    <p>Computer graphics design really isn't difficult at all when you get like-minded people to help you out. Whether you’re just starting out or looking for new techniques to inspire you, UTCG is here to help. Come join our workshops and learn all about the Adobe suite and more. Sure, you could watch YouTube videos and read all about it but it really doesn’t compare to learning together. It doesn’t matter your area of study, or whether you’re a student, faculty, staff or alumni, just come along, ask questions, and share your experiences!

    <h3>Focuses:</h3>

    <p>Adobe Creative Suite (Photoshop, Photoshop Lightroom, Illustrator, InDesign)
    <p>Sketchup
    <p>Wordpress and web design
    <p>Layout principles
    <p>Digital painting
    <p>...and whatever else you want to learn!

    <h3>Workshops: When and where?</h3>

    <p>Our workshops are held from 3-5pm at WE51A, Wetmore Hall, New College at the University of Toronto. The complete address is as follows:
    <p>Wetmore Hall, New College
    <p>300 Huron Street
    <p>Toronto M5S 2Z3

    <p>Wetmore Hall, New College

    <h3>About the UTCG Group.</h3>

    <p>We’re a Ulife and UTSU recognized campus group at the University of Toronto. Our main aim is to prove to people how easy it is to learn graphic design, and how applicable it is in all academic disciplines. If you have any suggestions, questions, comments, feedback...email us at communication@utcg.org.

    <p>Call us or beep us whenever you want to reach us.

    <p>There are a variety of means through which you can reach us. The quickest and easiest is email, followed by Facebook. To see what we're upto, check out our Twitter.

    `
  });
})

app.get('/about', function(req, res) {
  res.render('home', {
    title:'UTCG | About',
    content : ``
  });
})

app.get('/workshops', function(req, res) {
  res.render('home', {
    title:'UTCG | Workshops',
    content : ``
  });
})

app.get('/gallery', function(req, res) {
  res.render('home', {
    title:'UTCG | Gallery',
    content : ``
  });
})

app.get('/contact', function(req, res) {
  res.render('home', {
    title:'UTCG | Contact',
    content : ``
  });
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});
