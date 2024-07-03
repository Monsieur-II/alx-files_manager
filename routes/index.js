const express = require('express');

const router = express.Router();

// controllers
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');
const FilesController = require('../controllers/FilesController');

// middlewares
const { basicAuth, bearerAuth } = require('../middlewares/auth');

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);
router.get('/connect', basicAuth, AuthController.getConnect);
router.get('/disconnect', bearerAuth, AuthController.getDisconnect);
router.get('/users/me', bearerAuth, AuthController.getMe);
router.post('/files', bearerAuth, FilesController.postUpload);
router.get('/files/:id', bearerAuth, FilesController.getShow);
router.get('/files', bearerAuth, FilesController.getIndex);
router.put('/files/:id/publish', bearerAuth, FilesController.putPublish);
router.put('/files/:id/unpublish', bearerAuth, FilesController.putUnPublish);
router.get('/files/:id/data', bearerAuth, FilesController.getFile);

module.exports = router;
