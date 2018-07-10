var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var User = require('./models/user');
var Coin = require('./models/coin');
var Sequelize = require('sequelize');
const keys = require('./config/keys');
// create a sequelize instance with our local postgres database information.
var sequelize = new Sequelize(keys.pgString);
// var schedule = require('node-schedule');
var schedule = require('./schedule');
// invoke an instance of express application.
var app = express();

// set our application port
app.set('port', 9000);

// set morgan to log info about our requests for development use.
app.use(morgan('dev'));

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));

// initialize cookie-parser to allow us access the cookies stored in the browser.
app.use(cookieParser());

schedule.ns();
// initialize express-session to allow us track the logged-in user across sessions.
app.use(
  session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000
    }
  })
);

// SELECT "id", "coin", "confirmed", "unconfirmed", "ae_confirmed", "ae_unconfirmed", "exchange", "cashConfirmed", "cashPrice", "createdAt", "updatedAt" FROM "coins" AS "coin" WHERE "coin"."id" = 2;

// Coin.findAll({
//   raw: true,
//   where: {
//     coin: 'LITECOIN'
//   }
// }).then(fish => {
//   let stringin = JSON.stringify(fish);
//   console.log(fish[23].coin);
// });
//! Working Coin Query

// Coin.findOne({
//   id: '2000'
// }).then(coin => {
//   console.log(`Found coin: ${coin.dataValues.coin}`);
//   console.log(`Found coin: ${coin.dataValues.cashConfirmed}`);
//   console.log(`Found coin: ${coin.dataValues.updatedAt}`);
//   console.log(`Found coin: ${coin.dataValues.confirmed}`);
// });

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie('user_sid');
  }
  next();
});

// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    res.redirect('/dashboard');
  } else {
    next();
  }
};

// route for Home-Page
app.get('/', sessionChecker, (req, res) => {
  res.redirect('/login');
});

// app.get('/minerdata', (req, res) => {
//   if (req.session.user && req.cookies.user_sid) {
//     sequelize
//       .query(
//         'set timezone = `America/New_York` SELECT DISTINCT ON (a.coin) * FROM public.coins as a ORDER BY a.coin, `a.updatedAt` DESC',
//         {
//           type: sequelize.QueryTypes.SELECT
//         }
//       )
//       .then(coins => {
//         console.log(coins);
//         res.send(coins);
//         // We don't need spread here, since only the results will be returned for select queries
//       });
//   } else {
//     res.redirect('/login');
//   }
// });

// res.redirect('/login');

// route for user signup
app
  .route('/signup')
  .get(sessionChecker, (req, res) => {
    res.sendFile(__dirname + '/public/signup.html');
  })
  .post((req, res) => {
    User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    })
      .then(user => {
        req.session.user = user.dataValues;
        res.redirect('/dashboard');
      })
      .catch(error => {
        res.redirect('/signup');
      });
  });

// route for user Login
app
  .route('/login')
  .get(sessionChecker, (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
  })
  .post((req, res) => {
    var username = req.body.username,
      password = req.body.password;

    User.findOne({ where: { username: username } }).then(function(user) {
      if (!user) {
        res.redirect('/login');
      } else if (!user.validPassword(password)) {
        res.redirect('/login');
      } else {
        req.session.user = user.dataValues;
        res.redirect('/dashboard');
      }
    });
  });

// route for user's dashboard
app.get('/dashboard', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.sendFile(__dirname + '/public/dashboard.html');
  } else {
    res.redirect('/login');
  }
});

// route for user logout
app.get('/logout', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.clearCookie('user_sid');
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});

// route for handling 404 requests(unavailable routes)
app.use(function(req, res, next) {
  res.status(404).send("Sorry can't find that!");
});

// start the express server
app.listen(app.get('port'), () =>
  console.log(`App started on port ${app.get('port')}`)
);
