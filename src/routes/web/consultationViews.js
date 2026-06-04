const express = require('express');
const router = express.Router();

router.get('/consultations', (req, res) => {
    res.render('consultations/index');
});

router.get('/consultations/new', (req, res) => {
    res.render('consultations/create');
});

router.get('/consultations/:id', (req, res) => {
    res.render('consultations/show');
});

router.get('/consultations/:id/edit', (req, res) => {
    res.render('consultations/edit');
});

module.exports = router;
