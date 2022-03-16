'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const { check, validationResult } = require('express-validator'); // validation middleware
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions

const dao = require('./dao');
const administratorsDao = require('./administrators-dao'); // module for accessing the administrators in the DB
const URL_API = '/api';

// init express
const app = new express();
const port = 3001;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());

/*** Set up Passport ***/

// initialize and configure passport
passport.use(new LocalStrategy(
      function (username, password, done) {

            administratorsDao.getAdmin(username, password).then((user) => {

                  if (!user)
                        return done(null, false, { message: 'Incorrect username and/or password.' });

                  return done(null, user);
            })
      }
));


// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
      done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {

      administratorsDao.getAdminById(id)
            .then(user => {
                  done(null, user); // this will be available in req.user
            }).catch(err => {
                  done(err, null);
            });
});

/* custom middleware: check if a given request is coming from an authenticated user */
const isLoggedIn = (req, res, next) => {
      if (req.isAuthenticated())
            return next();

      return res.status(401).json({ error: 'not authenticated' });
}


/* set up the session */
app.use(session({
      // by default, Passport uses a MemoryStore to keep track of the sessions
      secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
      resave: false,
      saveUninitialized: false,
}));

/* then, init passport */
app.use(passport.initialize());
app.use(passport.session());

/*** APIs ***/

/* GET /api/surveys */
app.get(URL_API + '/surveys', async (req, res) => {
      try {
            const surveys = await dao.getSurveys();
            res.status(200).json(surveys);
      } catch (err) {
            res.status(500).end()
      }
});

/* GET /api/admin/surveys */
app.get(URL_API + '/admin/surveys', isLoggedIn, async (req, res) => {
      try {
            const surveys = await dao.getAdminSurveys(req.user.id);

            if (surveys.error) {
                  res.status(404).json(surveys);
            } else {
                  res.status(200).json(surveys);
            }
      } catch (err) {
            res.status(500).end();
      }
});

/* GET /api/survey/:surveyId */
app.get(URL_API + '/survey/:surveyId', async (req, res) => {
      try {
            const survey = await dao.getQABySurveyId(req.params.surveyId);
            res.status(200).json(survey);
      } catch (err) {
            res.status(500).end();
      }
});


/* POST /api/admin/survey/create   */
app.post(URL_API + '/admin/survey/create', isLoggedIn, [
      check('questions.*.*').not().isEmpty(),
      check(['answers.*.idAnswer', 'answers.*.idQuestion']).not().isEmpty(),
      check(['questions.*.min', 'questions.*.max']).isInt({ min: 0, max: 200 }),
      check(['questions.*.idQuestion', 'answers.*.idAnswer', 'answers.*.idQuestion']).isInt(),
      check(['title', 'questions.*.question', 'answers.*.answer']).isString()
], async (req, res) => {

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
      }

      const adminId = req.user.id;
      const title = req.body.title;
      const quests = req.body.questions;
      const ans = req.body.answers;

      try {
            await dao.createSurvey(title, adminId, ans, quests);
            res.status(201).end()
      } catch (err) {
            res.status(503).json({ error: `Database error ${err}.` });

      }
});

/* POST /api/admin/survey/results/set   */
app.post(URL_API + '/admin/survey/results/set', [
      check(['guestName', 'results.*.idAnswer', 'results.*.idQuestion', 'results.*.selected']).not().isEmpty(),
      check(['results.*.idQuestion', 'results.*.idAnswer']).isInt(),
      check(['guestName', 'results.*.answer']).isString()
], async (req, res) => {

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
      }

      const surveyId = req.body.surveyId;
      const guestName = req.body.guestName;
      const results = JSON.stringify(req.body.results);

      try {
            await dao.setSurveyResults(surveyId, guestName, results);
            res.status(201).end()
      } catch (err) {
            res.status(503).json({ error: `Database error ${err}.` });

      }
});

/* GET /api/admin/survey/results */
app.get(URL_API + '/admin/survey/:surveyId/results', async (req, res) => {
      try {
            const survey = await dao.getQRBySurvey(req.params.surveyId);
            res.status(200).json(survey);
      } catch (err) {
            res.status(500).end();
      }
});




/*** Users APIs ***/

app.post(URL_API + '/sessions', passport.authenticate('local'), (req, res) => {
      // If this function gets called, authentication was successful.
      // `req.user` contains the authenticated user.
      res.json(req.user);
});

/* logout:  DELETE /sessions/current */
app.delete(URL_API + '/sessions/current', (req, res) => {
      req.logout();
      res.end();
});

// GET /sessions/current
// check whether the user is logged in or not
app.get(URL_API + '/sessions/current', (req, res) => {
      if (req.isAuthenticated()) {
            res.status(200).json(req.user);
      }
      else
            res.status(401).json({ error: 'Unauthenticated user!' });;
});


/*** Other express-related instructions ***/

// activate the server
app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
});