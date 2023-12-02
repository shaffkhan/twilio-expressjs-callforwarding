const express = require('express');
const router = express.Router();
const callController = require('../controllers/callController.js')

router.post('/handle-call', callController.handleCall);
router.post('/handle-input', callController.handleInput);
router.post('/handle-recording', callController.handleRecording);
router.get('/get-all-call-logs', callController.getAllCallLogs);


module.exports = router;