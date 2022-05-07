const express = require('express');
const router = express.Router();

router.all('/', function(req, res) {
  res.send('SSO API');
});

module.exports = router;
