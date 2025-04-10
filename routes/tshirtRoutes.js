const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const tshirtController = require('../controllers/tshirtController');

// Auth routes
router.get('/login', userController.loginForm);
router.post('/login', userController.login);
router.get('/logout', userController.logout);

// Dashboard
router.get('/', tshirtController.dashboard);

// T-shirt CRUD
router.post('/add', tshirtController.add);
router.post('/update/:id', tshirtController.update);
router.get('/delete/:id', tshirtController.delete);

// Export
router.get('/export/csv', tshirtController.exportCSV);
router.get('/export/pdf', tshirtController.exportPDF);

module.exports = router;