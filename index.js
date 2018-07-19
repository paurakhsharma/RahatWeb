const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser')
const { Pool } = require('pg')
require('dotenv').config()


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


const pool = new Pool({
	user: process.env.PGUSER,
	host: process.env.PGHOST,
	database: process.env.PGDATABASE,
	password: process.env.PGPASSWORD,
	port: process.env.PGPORT,
	// ssl: true
});


app.listen(4000, () => {
  console.log("eth is working")

      pool.connect((err, client, done) => {
        // Handle connection errors
        if(err) {
          //done();
          return console.error(err);
        }

        pool.query('SELECT * FROM usertb', (err, result) => {
          if(err){
              return console.error('error running query', err);
          }
          
          console.log(result.rows)
        }); 
      });
        

});


app.get('/', (req, res) => {
    res.render('index',{})
})


app.listen(PORT, () => console.log(`listening on port ${PORT}`))