const express = require('express')
const router = express.Router();

router.get('/', async (req, res) => {

    console.log('login get');
    res.render('login',{error: 0});
  });
  
  router.post('/', (req, res) => {
    // login logic
    // redirect to / if successful
    // display login page with an error message if unsuccessful
    console.log('login post');
    res.render('index')
  });

  module.exports = router;