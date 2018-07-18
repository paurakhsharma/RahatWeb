const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/rahatweb');
var Schema = mongoose.Schema;
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser')

mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to database')
    });

// Define schema
var UsersSchema = new Schema({
    name:  String,
    address: String,
    citizenshipid:   String,
    creationdate: { type: Date, default: Date.now },
  });

  // Compile model from schema
var UserModel = mongoose.model('UserModel', UsersSchema)  

// Create an instance of model SomeModel
var user_instance = new UserModel({
    name: 'Paurakh Sharma',
    address: 'Kavrepalanchok',
    citizenshipid: '1253565',
    creationdate: Date.now(),
    })

// Save the new model instance, passing a callback
user_instance.save(function (err) {
    if (err) return handleError(err);
    console.log('Model saved')
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

const Users = mongoose.model('users', { name: String });



const kitty = new Users({ name: 'Zildjian' });
kitty.save().then(() => console.log('meow'));




app.get('/', (req, res) => {
    res.render('index')
})


app.listen(PORT, () => console.log(`listening on port ${PORT}`))