const express = require('express');
const router = express.Router();

router.get('/triages', (req, res) => {
    res.render('triages/index');
});

router.get('/triages/new', (req, res) => {
    res.render('triages/create');
});

router.get('/triages/:id', (req, res) => {
    res.render('triages/show');
});

router.get('/triages/:id/edit', (req, res) => {
    res.render('triages/edit');
});

module.exports = router;
