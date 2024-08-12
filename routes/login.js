const express = require('express');
const router = express.Router();

const adminCredentials = {
  email: 'aayush',
  password: 'aayush'
};

router.post('/login', (req, res) => {
  const { username, password } = req.body;  if (username === adminCredentials.email && password === adminCredentials.password) {
    return res.redirect('/admin');
  } else {
    return res.render('login', { alertMessage: 'Invalid Credentials' });
  }
});

module.exports = router;