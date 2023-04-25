require('dotenv').config();
const Database = require('./wrapper.js');
const express = require('express');
const session = require('express-session');


//express instance
const app = express();
app.locals.pretty = true;
//port number
const port = 3000;
// initialize database
const db = new Database();
db.initialize();
console.log(db);



//enaable body parser
app.use(express.urlencoded({ extended: true }));
//tell express where pug templates are
app.set('view engine', 'pug');

app.use(express.static('public'))
// middleware
app.use((req, res, next) => {
    console.log("add database to request");
    req.db = db;
    next(); // ensures the route handlers will be called.
})

app.use(session({
  secret: 'cmps369',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use((req, res, next) => {
  if (req.session.user) {
      res.locals.user = {
          id: req.session.user.id,
          username: req.session.user.username,
          firstName: req.session.user.firstName,
          lastName: req.session.user.lastName
      }
  }
  next()
})


app.use('/', require('./routes/index'));
app.use('/create', require('./routes/create'));
app.use('/login', require('./routes/login'));
app.use('/logout', require('./routes/index'));
app.use('/signup', require('./routes/signup'));

app.use('/:id', require('./routes/index'));
app.use('/:id/edit', require('./routes/index'));
app.use('/:id/delete', require('./routes/index'));


// start server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
