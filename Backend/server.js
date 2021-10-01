// Mahir Mahboob
// Nuzhat Khan
// CSCI 499
// Backend--Project

const http = require('http');
const express = require('express');
const mysql = require('mysql');
const { response } = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const exphbs = require('express-handlebars');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const app = express();
const flash = require('express-flash');
const { Console } = require('console');
const bodyParser = require('body-parser');


//Middleware 
app.use(express.json());

app.use(session({
    secret: "verygoodsecret",
    resave: false,
    saveUninitialized: true
}));
app.use(express.urlencoded({ extended: false }));
app.use(require('cookie-parser')()); // i can do this like const cookieParser = require('cookie-parser'); Then, app.use(cookie-parser())
app.use(cors());
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
//passport.js
app.use(passport.initialize());
app.use(passport.session());


//db = database
var dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'Library'     // Our Database is called Library in MySQL Workbench. Then the table is called book_information
}

let connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
    if (err) {
        console.log('Not connected');
    }
    else {
        console.log('Connected to the MySQL server.');
    }
});

/*
This end-point will return books based on the genre that user selected. User can only select one genre
*/
app.get('/home/:genre', (req, res) => {

    const genre_given_by_user = (req.params.genre);
    //console.log(genre_given_by_user);
    connection.query('SELECT * FROM book_information WHERE genre= ? ORDER BY rating LIMIT 5', genre_given_by_user, function (err, result) {

        if (err) {
            res.status(404).send('Not working');
        }

        else {
            //console.log(response);
            res.status(201).send(result);
        }

    })
})

// User takes a quiz
app.post('/takeaquiz', (req, res) => {
    const user_genre1 = req.body.user_genre1;
    const user_genre2 = req.body.user_genre2;
    const user_genre3 = req.body.user_genre3;

    const age_range = req.body.age_range;
    const maximum_pages = req.body.maximum_pages;
    const publication_date = req.body.publication_date;
    const trigger_warning = req.body.trigger_warning
    const best_seller = req.body.best_seller;
    const series = req.body.series;

    /*
    console.log(user_genre1);
    console.log(age_range);
    console.log(maximum_pages);
    console.log(publication_date);
    console.log(trigger_warning);
    console.log(best_seller);
    console.log(series);
    */


const sqlquery = `SELECT *
    FROM book_information
    WHERE (genre = ? or genre = ? or genre = ?)
    AND 
    (age_range = ? AND maximum_pages <= ? AND publication_date >= ? AND trigger_warning = ? AND best_seller = ? AND series = ?) ORDER BY rating LIMIT 5`;


    connection.query(sqlquery, [user_genre1, user_genre2, user_genre3, age_range, maximum_pages,publication_date,trigger_warning,best_seller,series], function (err, result){
        if (err){
            res.status(404).send("There is some problem");
        }
        else{
            res.status(201).send(result);
        }
    })

})


//This End-point will return a random book name with 75% or higher rating to the user.
app.get('/surpriseme', (req, res) => {
    connection.query('SELECT * FROM book_information WHERE rating >= 75 ORDER BY rand() LIMIT 1', function (err, result) {

        if (err) {
            res.status(404).send('There is some problem with getting one random book with 75 or higher rating for the user');
        }

        else {
            res.status(201).send(result);
        }


    })
})

app.get('/searchup', (req, res) => {
connection.query('SELECT * FROM book_information order by book_name', function (err, result) {

        if (err) {
            res.status(404).send('Not working');
        }

        else {
            //console.log(response);
            res.status(201).send(result);
        }

    })
    
})

/*
We will create the register part below
This is the video that i found very helpful--https://www.youtube.com/watch?v=AZOZVyLrMvc&list=PLw_UK6aNYDb77hVcuz7SZd-LdyFKC1tZr&index=5&ab_channel=TelmoSampaio
This is the second video that i found very helpful---https://www.youtube.com/watch?v=-RCnNyD0L-s&list=PLw_UK6aNYDb77hVcuz7SZd-LdyFKC1tZr&index=6&ab_channel=WebDevSimplified
(I only watched upto 12 minute of the second video)
you have to install bcryptjs------npm i bcrypt
*/

app.post('/rest/register', async(req, res) => {
    
    const username = req.body.username;
    const password = req.body.password;
    const passwordconfirm = req.body.passwordConfirm;

    try {
    // we take the email that user entered and check if that usernmae already exist in our databse
    connection.query('select username from user_table where username = ?', [username], async (err, result) => {
        
        if (err) {
            res.send({err:err});
        }

        // if result is more that 0 meanning, in our database a email exact email exist that means user can not use the email.
        if (result.length > 0) {
            return res.status(404).send("That email already exist");
            
            //return res.send(err, {message:"That email already exist"});
            //return res.send({message:'that username already exist'});

            //return res.render('/signup', {
                //message: "That email already exist"
            //})
        }

        else if (password != passwordconfirm){
            
            //console.log('Your password does not match');
            
            return res.status(406).send("Your password does not match");
            //return res.render('register', {
                //message: "Your password does not match"
            //})
        }

        let hashedpassword = await bcrypt.hash(password, 10);
        connection.query('insert into user_table set ?', {username: username, password: hashedpassword},(err, result) => {
            if (err){
                res.send({err:err})
            }

            else
            {
                //console.log(result)
                return res.status(201).send(result);
                //res.redirect('/login');
                //console.log(result)
                //res.redirect('/signup', {
                //message: "User Registered"
            //}) 
            }
        } )
    })
   } catch{
    console.log("something went wrong")
   }
 
});



/*
For login, we will use passpost..... here is the link---https://www.npmjs.com/package/passport
Here is another link that I used and found it very helpful---https://www.youtube.com/watch?v=W5Tb1MIeg-I&list=PLw_UK6aNYDb77hVcuz7SZd-LdyFKC1tZr&index=9&ab_channel=TylerPotts

*/

passport.use(new LocalStrategy(function(username,password, done){
   connection.query('select * from user_table where username = ?', [username],function(err,user){
    if(err)
    {
        //console.log("we having database problem");
        return done(err)          
    }
    else if(user.length == 0)
    {
        //console.log("there are no account with this username");
        return done(null,false,{message: 'Incorrect user name'}); 
    }

    // That means we have a user but is the correct password typed in.

    else
    {
   bcrypt.compare(password, user[0].password, function(err, passwordmatch) {
        if (err){
            //console.log("we having database problem inside the bcrypt");
            return done(err);
        }

        if (passwordmatch == false){

            //console.log("Incorrect password");
            return done(null, false, {message:'incorrect password'});

        }

        else
        {
            //console.log("we found our user");
            return done(null, user)
        }
      });
    }

   });  
}
));

/*
app.post('/rest/login', passport.authenticate('local'), function (req, res) {

    if(req.user.length== 1){
    console.log(req.user);
    return res.status(201).send(req.user);
    }

    else
    {   
        console.log("Invalid username or password");
    }
});
*/


app.post('/rest/login', (req, res, next) => {

    passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.status(401).send("no user"); }

    // req / res held in closure
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.status(201).send(user);
    });

  })(req, res, next);

});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
// we will use this function later. Not right now
function isloggedin(req, res, next){
    if(req.isAuthenticated()) return next();
    res.redirect('/login')
}

function isloggedout(req, res, next){
    if(!req.isAuthenticated()) return next();
    res.redirect('/home')
}

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});



/*
Copied this code from stackoverflow...
Link------https://stackoverflow.com/questions/37385833/node-js-mysql-database-disconnect
The reason why we are adding this part is because we may lose connection with mysql. we want to restart the connection.
It will introduce a small delay to avoid hot loop
*/
function handleDisconnect() {
  connection = mysql.createConnection(dbConfig);  // Recreate the connection, since the old one cannot be reused.
  connection.connect( function onConnect(err) {   // The server is either down
      if (err) {                                  // or restarting (takes a while sometimes).
          console.log('error when connecting to db:', err);
          setTimeout(handleDisconnect, 10000);    // We introduce a delay before attempting to reconnect,
      }                                           // to avoid a hot loop, and to allow our node script to
  });                                             // process asynchronous requests in the meantime.
                                                  // If you're also serving http, display a 503 error.
  connection.on('error', function onError(err) {
      console.log('db error', err);
      if (err.code == 'PROTOCOL_CONNECTION_LOST') {   // Connection to the MySQL server is usually
          handleDisconnect();                         // lost due to either server restart, or a
      } else {                                        // connnection idle timeout (the wait_timeout
          throw err;                                  // server variable configures this)
      }
  });
}
handleDisconnect();

app.listen(5000)


/*

        if(!user){
            
            console.log("either username or password is wrong");
            return res.status(401);
        }
        else
        {
            return res.send("Wrong combination");
        }
*/