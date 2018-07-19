const express = require('express')
const app = express()
const path = require('path')
const { Client } = require('pg')
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser')

const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://smartmeter:smartmeter@localhost:5432/smartmeter',
    ssl: true,      
});

client.connect((err, client, done) => {
    if(err) {
        console.error(err);
        return
    }
});

// Define routes here
var routes = require('./router')
app.use('/', routes)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


app.listen(PORT, () => console.log(`listening on port ${PORT}`))