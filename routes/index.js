const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');


router.get('/', async (req, res) => {
  console.log('index get');
  // display all contacts in a table
  const allContacts = await req.db.getAllContacts();
  console.log(allContacts.length);
  
  
  // res.render('index',{allContacts: allContacts});
  // res.json({allContacts});
  res.render('index',{allContacts});
});

router.post('/', async (req, res) => {
  console.log('index post');

  // console.log(req.body);
  //console.log(req.body.emailAddress);
  console.log(req.body.delete);
  if(req.body.delete == 1)
  {
    await req.db.deleteContact(req.body.id);
    res.redirect('/');
    return;
  }
  if(req.body.edit == 1)
  {
    const contact = await req.db.findContact(req.body.id);
    await req.db.recordContact(contact,req.body);
    res.redirect('/');
    return;
  }

  //if there is a new contact Id
  if(req.body.newContactId && req.body.title)
  {
    console.log("inside new contact if");
    const newContactId = await req.db.createContact();
    const contact = await req.db.findContact(req.body.newContactId);
    if (!contact) {
      res.writeHead(404);
      res.end();
      return;
    }
    //console.log(contact);
  
    await req.db.recordContact(contact,req.body);
    res.redirect('/');
    return;
  }


  
  //if there is a new user id
  if(req.body.newUserId)
  {
    console.log("inside if2");
    const user = await req.db.findUser(req.body.newUserId);

    const username = await req.db.findUserByUsername(req.body.username);
    if(username)
    {
      res.render('signup', {newUserId: req.body.newUserId, password: req.body.password, password2: req.body.password2, username: 0});
      return;
    }
    if(req.body.password != req.body.password2)
    {
      res.render('signup', {newUserId: req.body.newUserId, password: req.body.password, password2: req.body.password2, username: 1});
      return;
    }
    if (!user) {
      res.writeHead(404);
      res.end();
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    console.log(salt);
    console.log(hash);
    await req.db.recordUser(user,req.body,hash)
    
    const id = await req.db.findUserByUsername(req.body.username.trim());
    console.log("test");
    console.log(id);
    req.session.user = id;
    res.redirect('/');
    return;
    
    
  }

  const allContacts = await req.db.getAllContacts();

  //if logged in
  const exist = await req.db.findUserByUsername(req.body.username);
  console.log(exist);
  if(exist)
  {
    console.log("loggedIn");
    const username = req.body.username.trim();
    const password = req.body.password.trim();
    const user = await req.db.findUserByUsername(username);
    console.log(user);
    if(user && bcrypt.compareSync(password, user.password))
    {
      req.session.user = user;
      console.log(user.firstName);
      res.render('index',{allContacts: allContacts});
      return;
    }
    else
    {
      res.render('login', {error: 1});
      return;
    }
  }
  else
  {
    res.render('login', {error: 1});
    return;
  }

});

router.get('/logout', async (req, res) => {
  req.session.user = undefined;
  res.redirect('/');
})

router.get('/:id(\\d+)', async (req, res) => {
  console.log("index id get");

  console.log(req.params.id);
  const contact = await req.db.findContact(req.params.id);

  res.render('id',{contact: contact});
});

router.get('/:id/edit', async (req, res) => {
  console.log("edit");
  const contact = await req.db.findContact(req.params.id)
  res.render("edit",{id: req.params.id, contact: contact, edit: 0});
})

router.get('/:id/delete', async (req, res) => {
  console.log("delete");
  const contact = await req.db.findContact(req.params.id);
  res.render("delete",{id: req.params.id, contact: contact, delete: 0});
})

  module.exports = router;