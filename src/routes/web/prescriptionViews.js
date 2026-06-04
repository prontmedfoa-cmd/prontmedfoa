const express = require('express');
const router = express.Router();

router.get('/prescriptions', (req, res) => {
    res.render('prescriptions/index');
});

router.get('/prescriptions/:id', (req, res) => {
    res.render('prescriptions/show');
});

module.exports = router;
