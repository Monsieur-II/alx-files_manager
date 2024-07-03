const express = require('express');

const router = express.Router();

// controllers
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');

// middlewares
const { basicAuth, bearerAuth } = require('../middlewares/auth');

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);
router.get('/connect', basicAuth, AuthController.getConnect);
router.get('/disconnect', bearerAuth, AuthController.getDisconnect);
router.get('/users/me', bearerAuth, AuthController.getMe);

module.exports = router;
