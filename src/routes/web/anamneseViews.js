const express = require('express');
const router = express.Router();

router.get('/anamneses', (req, res) => {
    res.render('anamneses/index');
});

router.get('/anamneses/new', (req, res) => {
    res.render('anamneses/create');
});

router.get('/anamneses/:id', (req, res) => {
    res.render('anamneses/show');
});

router.get('/anamneses/:id/edit', (req, res) => {
    res.render('anamneses/edit');
});

module.exports = router;
