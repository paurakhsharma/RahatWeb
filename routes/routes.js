var util = require('util');
var express = require('express');
var app = express();
var passport = require("passport");


var fs = require('fs');
var request = require('request');
const { Pool, Client } = require('pg')
const bcrypt= require('bcrypt')


//Add forgot password functionality
//Add email confirmation functionality
//Add edit account page


app.use(express.static('public'));

const LocalStrategy = require('passport-local').Strategy;
//const connectionString = process.env.DATABASE_URL;

var currentAccountsData = [];

const pool = new Pool({
	user: process.env.PGUSER,
	host: process.env.PGHOST,
	database: process.env.PGDATABASE,
	password: process.env.PGPASSWORD,
	port: process.env.PGPORT,
	// ssl: true
});

module.exports = function (app) {

	

	app.get('/map', function (req, res) {
		res.render('map')
	  })
	  
	

	app.get('/', function (req, res, next) {
		res.render('index')
	});

	// app.get('/', function (req, res, next) {
	// 	res.render('index', {title: "Home", userData: req.user, messages: {danger: req.flash('danger'), warning: req.flash('warning'), success: req.flash('success')}});
		
	// 	console.log(req.user);
	// });

	app.get('/join', function (req, res, next) {
		res.render('signup')
			//userData: req.user, messages: {danger: req.flash('danger'), warning: req.flash('warning'), success: req.flash('success')}}
	});
	
	
	app.post('/join', async function (req, res) {
		
		try{
			const client = await pool.connect()
			await client.query('BEGIN')
			var pwd = await bcrypt.hash(req.body.password, 5)
			var today= new Date().toISOString().slice(0, 10)

					client.query('INSERT INTO organizationtb (name, address, registrationno, telephone, registrationdate, email, password) VALUES ($1, $2, $3, $4, $5,$6,$7)', [req.body.name,req.body.address, req.body.regno,req.body.phoneno,today,req.body.email, pwd], function(err, result) {
						if(err){console.log(err);}
						else {
						
						client.query('COMMIT')
							console.log(result)
							//req.flash('success','User created.')
							res.redirect('/login')
							return;
						}
					})
					
					
				//}
				
			//}))
			client.release();
		} 
		catch(e){throw(e)}
	});

	app.post('/join/organization', async function (req, res) {
		
		try{
			const client = await pool.connect()
			await client.query('BEGIN')
			var pwd = await bcrypt.hash(req.body.password, 5);
			var today= new Date().toISOString().slice(0, 10)
			await JSON.stringify(client.query('SELECT registerId FROM organizationtb WHERE "registerId"=$1', [req.body.registerId], function(err, result) {
				if(result.rows[0]){
					req.flash('warning', "This  is already registered.");
					res.redirect('/join');
				}
				else{
					client.query('INSERT INTO organizationtb (name,address,registerDate,telephone,creationDate,email, password) VALUES ($1, $2, $3, $4, $5,$6,$7)', [req.body.name,req.body.address,req.body.registerDate,req.body.telephone,today,req.body.email, pwd], function(err, result) {
						if(err){console.log(err);}
						else {
						
						client.query('COMMIT')
							console.log(result)
							req.flash('success','User for organization created.')
							res.redirect('/login');
							return;
						}
					});
				}
			}));
			client.release();
		} 
		catch(e){throw(e)}
	});
	
	// app.get('/account', function (req, res, next) {
	// 	if(req.isAuthenticated()){
	// 		//to render in account.html
	// 		res.render('account', {title: "Account", userData: req.user, userData: req.user, messages: {danger: req.flash('danger'), warning: req.flash('warning'), success: req.flash('success')}});
	// 	}
	// 	else{
	// 		res.redirect('/login');
	// 	}
	// });


		
	app.post('/adddisaster', async function (req, res) {
		
		try{
			const client = await pool.connect()
			await client.query('BEGIN')
			console.log('add disaster called')
			var type=[];
			var refined=[];
			type.push(req.body.flood,req.body.landslide,req.body.drought,req.body.wildfire,req.body.hurricanes);
			type.forEach(function(element) {
				
				if(element!==undefined){
					refined.push(element);

				}
			  });
			
			var type_instring=refined.toString();
<<<<<<< HEAD
			var postedby=req.body.postedby 
			if(postedby== 'undefined'){
				postedby="admin"
				console.log(postedby)
			}
			var postedtime=new Date().toString(); 
			//console.log(req.body.needs);
=======
			var postedby='admin' 
			var postedtime=new Date(); 
			console.log(req.body.needs);
>>>>>>> 5a9be3861bb278c49e6037c859d3576102fb9f70

			
					client.query('INSERT INTO disastertb (type,location,affectedpeople,requirement,postedby,postedtime) VALUES ($1, $2, $3, $4, $5, $6)', [type_instring, req.body.location, req.body.numof, req.body.needs, postedby, postedtime], function(err, result) {
						if(err){console.log(err);}
						else {
						
						client.query('COMMIT')
							//console.log(result)
							//req.flash('success','User created.')
							res.render('org')
							return;
						}
					})
					
					
				//}
				
			//}))
			client.release();
		} 
		catch(e){throw(e)}
	});

	app.post('/login2',async function(req,res){
		
		const client = await pool.connect()
		await client.query('BEGIN')
		var user=[]
		var pwd=[]
		var loggedin=false
		var curuser=req.body.email;
		var curpwd=req.body.password;
		
		console.log(curuser)
		console.log(curpwd)
		let profile={
			name:curuser,
			password:curpwd
		};

		client.query('Select email,password from organizationtb',function(err,result){
					//console.log(res.rows);
					for(i in result.rows){
					user.push(result.rows[i].email)
					pwd.push(result.rows[i].password)
					//console.log(res.rows [i].email)
				}
			var cursor=user.indexOf(curuser);
			if(bcrypt.compareSync(curpwd,pwd[cursor])){
				console.log("logged in");
				loggedin=true;
				res.render('org',{disp: profile})


				
			}else{
				console.log("incorrect username or pwd")
				res.redirect('login')
			}
		
			});
		
				
 });

	app.get('/getdisaster', async function (req, res) {
	try{ const client = await pool.connect()
		 await client.query('BEGIN')
		 client.query("SELECT * FROM disastertb", (err, result) => {
			 console.log(result.rows[0])
			res.send(JSON.stringify({disaster: result.rows}))
		})
		client.release();
	}catch(e){throw(e)}
})

<<<<<<< HEAD
	// app.get('/login', function (req, res, next) {
	// 	if (req.isAuthenticated()) {
	// 		res.redirect('/account');
	// 	}
	// 	else{
	// 		//for rendering in login.ejs
	// 		res.render('login', {title: "Log in", userData: req.user, messages: {danger: req.flash('danger'), warning: req.flash('warning'), success: req.flash('success')}});
	// 	}
	// })
=======
	app.get('/login', function (req, res, next) {
		if (req.isAuthenticated()) {
			res.redirect('/account');
		}
		else{
			//for rendering in login.ejs
			res.render('login', {title: "Log in", userData: req.user, messages: {danger: req.flash('danger'), warning: req.flash('warning'), success: req.flash('success')}});
		}
	})
		
	// });
	
	// app.get('/logout', function(req, res){
		
	// 	console.log(req.isAuthenticated());
	// 	req.logout();
	// 	console.log(req.isAuthenticated());
	// 	req.flash('success', "Logged out. See you soon!");
	// 	res.redirect('/');
	// });
	
	app.get('/adddisaster', (req, res) => {
		res.render('org')
	})

	app.post('/login',	passport.authenticate('local', {
		successRedirect: '/account',
		failureRedirect: '/login',
		failureFlash: true
		}), function(req, res) {
			console.log('Thank you')
		if (req.body.remember) {
			req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
			} else {
			req.session.cookie.expires = false; // Cookie expires at end of session
		}
		res.redirect('/');
	});
	
// }


// passport.use('local', new  LocalStrategy({passReqToCallback : true}, (req, username, password, done) => {
	
// 	loginAttempt();
// 	async function loginAttempt() {
		
		
// 		const client = await pool.connect()
// 		try{
// 			await client.query('BEGIN')
// 			var currentAccountsData = await JSON.stringify(client.query('SELECT id, firstName, email, password FROM "users" WHERE "email"=$1', [username], function(err, result) {
				
// 				if(err) {
// 					return done(err)
// 				}	
// 				if(result.rows[0] == null){
// 					req.flash('danger', "Oops. Incorrect login details.");
// 					return done(null, false);
// 				}
// 				else{
// 					bcrypt.compare(password, result.rows[0].password, function(err, check) {
// 						if (err){
// 							console.log('Error while checking password');
// 							return done();
// 						}
// 						else if (check){
// 							return done(null, [{email: result.rows[0].email, firstName: result.rows[0].firstName}]);
// 						}
// 						else{
// 							req.flash('danger', "Oops. Incorrect login details.");
// 							return done(null, false);
// 						}
// 					});
// 				}
// 			}))
// 		}
>>>>>>> 5a9be3861bb278c49e6037c859d3576102fb9f70
		




	app.get('/adddisaster', (req, res) => {
		var profile={
			email:"admin",
			password:"admin"
		}
		res.render('org',{disp:profile})
	})

			
}