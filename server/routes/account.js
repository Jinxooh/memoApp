import express from 'express';
import Account from '../models/account';

const router = express.Router();

router.post('/signup', (req, res) => {
  let usernameRegex = /^[a-z0-9]+$/;
  let emailRegex = /^[_0-9a-zA-Z-]+(\.[_0-9a-zA-Z-]+)*@[0-9a-zA-Z-]+(\.)+([0-9a-zA-Z-]+)([\.0-9a-zA-Z-])*$/;

  if(!usernameRegex.test(req.body.username)){
    return res.status(400).json({
      error: "BAD USERNAME",
      code: 1
    });
  }

  if(req.body.password.length < 4 || typeof req.body.password !== "string") {
    return res.status(400).json({
      error: "BAD PASSWORD",
      code: 2
    });
  }

  if(!emailRegex.test(req.body.email)){
    return res.status(400).json({
      error: "BAD EMAIL ADDRESS",
      code: 3
    });
  }

  /* need to check email exist */

  Account.findOne({ username: req.body.username }, (err, exists) => {
    if(err) throw err;
    if(exists){
      return res.status(409).json({
        error: "USERNAME EXISTS",
        code: 4
      });
    }

    let account = new Account({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email
    });

    account.password = account.generateHash(account.password);
    account.save( err => {
      if(err) throw err;
      return res.json({ success: true });
    });
  });
});

router.post('/signin', (req, res) => {
  if(typeof req.body.password !== "string") {
    return res.status(401).json({
      error: "LOGIN FAILED",
      code: 1
    });
  }

  Account.findOne({ username: req.body.username }, (err, account) => {
    if(err) throw err;

    if(!account) {
      return res.status(401).json({
        error: "LOGIN FAIED",
        code: 1
      });
    }
    if(!account.validateHash(req.body.password)) {
      return res.status(401).json({
        error: "LOGIN FAILED",
        code: 1
      });
    }

    let session = req.session;
    session.loginInfo = {
      _id: account._id,
      username: account.username
    };

    return res.json({
      success: true
    });
  });
});

router.get('/getinfo', (req, res) => {
  if(typeof req.session.loginInfo === "undefined") {
    return res.status(401).json({
      error: 1
    });
  }

  res.json({ info: req.session.loginInfo });
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => { if(err) throw err; });
  return res.json({ success: true });
});

/*
    SEARCH USER: GET /api/account/search/:username
*/
router.get('/search/:username', (req, res) => {
    // SEARCH USERNAMES THAT STARTS WITH GIVEN KEYWORD USING REGEX
    var re = new RegExp('^' + req.params.username);
    Account.find({username: {$regex: re}}, {_id: false, username: true})
    .limit(5)
    .sort({username: 1})
    .exec((err, accounts) => {
        if(err) throw err;
        res.json(accounts);
    });
});

// EMPTY SEARCH REQUEST: GET /api/account/search
router.get('/search', (req, res) => {
    res.json([]);
});

export default router;
