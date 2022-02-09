const http = require('http');
const express = require('express');
const mysql = require('mysql');
const path = require('path');
const bodyParser = require('body-parser');
require("dotenv").config();

const db = mysql.createConnection({
  multipleStatements: true,
  host: 'localhost',
  user: 'root',
  password: process.env.MYSQL_PASS,
  database: 'JobTracker'
})

db.connect(err => {
  if(err) {
    throw err
  }
})

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('main'));
app.use('/', function(req,res){
    res.sendFile(path.join(__dirname+'/main'));
  });

const server = http.createServer(app);
const port = 3000;
server.listen(port);
console.debug('Server listening on port ' + port);


app.post('/info_sent.html', async (req, res, cb) => {
let post = {job_title: req.body.job_title, company_name: req.body.company_name, misc_notes: req.body.misc_notes, url: req.body.job_url, status: req.body.job_status}
let sql = 'INSERT INTO JobTracker.Jobs SET ?'
let query = await db.query(sql, post, err => {
  if(err) {
    throw err;
    }
  res.sendFile(path.join(__dirname+'/main/info_sent.html'));
  })
});

app.post('/show_info.html', (req, res) => { // Creating an item
    let sql = 'SELECT * FROM JobTracker.Jobs WHERE id < 4';
    let query = db.query(sql, (err, results) => {
      if(err) {
        throw err;
      }
    res.sendFile(path.join(__dirname+'/show_info.html'));
    // console.log("Hello");
    // for (k = 0; k < 4; k++) {
    //     let iterator = 0;
    //     console.log((String(results[iterator].job_title)) + (String(results[iterator].company_name)) + (String(results[iterator].misc_notes)) + (String(results[iterator].job_url)) + (String(results[iterator].job_status)));
    //     iterator ++;
    //   };
    })
  });
