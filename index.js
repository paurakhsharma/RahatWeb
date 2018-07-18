const express = require('express')
const app = express()
const path = require('path')

const PORT = process.env.PORT || 5000

const bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index')
})


app.listen(PORT, () => console.log(`listening on port ${PORT}`))