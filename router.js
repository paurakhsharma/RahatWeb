var express = require('express')
var router = express.Router()

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})
// define the home page route
router.get('/', function (req, res) {
  // Render Landing page  
  res.render('index')
})
// define the about route
router.get('/map', function (req, res) {
  res.render('map')
})

module.exports = router