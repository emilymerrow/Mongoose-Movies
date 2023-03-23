var express = require('express');
var router = express.Router();
const moviesCtrl = require('../controllers/movies');
const isLoggedIn = require('../config/auth')
/* GET users listing. */

router.get('/', moviesCtrl.index);
router.get('/new', moviesCtrl.new);
router.get('/:id', moviesCtrl.show);
router.post('/',isLoggedIn, moviesCtrl.create);
// check if the user is logged before they create a movie! Server side authorization!

module.exports = router;
