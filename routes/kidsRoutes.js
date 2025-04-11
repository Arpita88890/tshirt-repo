const express = require('express');
const router = express.Router();
const kidsController = require('../controllers/kidsController');

router.get('/', kidsController.dashboard);
router.post('/add', kidsController.add);
router.get('/delete/:id', kidsController.delete);
router.post('/update/:id', kidsController.update);
router.get('/export/pdf', kidsController.exportPDF);

module.exports = router;