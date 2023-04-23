const express = require('express')
const router = express.Router();

router.get('/', async (req, res) => {
    // display create contact form
    // post to /create
    const newContactId = await req.db.createContact();
    //console.log(newContactId)
    res.render('create',{newContactId: newContactId});
  });
  
  // app.post('/', requireLogin, (req, res) => {
  //   // create contact logic
  //   // redirect to / if successful
  //   // display create contact form with an error message if unsuccessful
  // });

  module.exports = router;