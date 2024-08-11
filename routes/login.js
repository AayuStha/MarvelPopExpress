const express = require('express');
const router = express.Router();

const adminCredentials = {
  email: 'admin@example.com',
  password: 'admin123'
};

router.post('/login', (req, res) => {
  const { username, password } = req.body;  if (username === adminCredentials.email && password === adminCredentials.password) {
    return res.redirect('/admin');
  } else {
    return res.redirect('/login?error=Invalid%20credentials');
  }
});

module.exports = router;