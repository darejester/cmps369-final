const express = require('express')
const router = express.Router();

router.get('/', async (req, res) => {
    console.log("signup get");
    // display signup form
    // post to /signup
    const newUserId = await req.db.createUser();
    res.render('signup', {newUserId: newUserId, password: 0, password2: 0, username: 1});
  });
  
  // router.post('/', async(req, res) => {
  //   console.log("signup post");
  //   // signup logic
  //   // redirect to /login if successful
  //   // display signup page with an error message if unsuccessful
  // });

  module.exports = router;