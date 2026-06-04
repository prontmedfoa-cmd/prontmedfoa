const express =
    require('express');

const router =
    express.Router();

const authMiddleware =
    require('../middlewares/authMiddleware');

const TriageController =
    require('../controllers/TriageController');

router.use(
    authMiddleware
);

router.post(

    '/',

    TriageController.create

);

router.get(

    '/patient/:patientId',

    TriageController.findByPatient

);

router.get(

    '/:id',

    TriageController.findById

);

router.put(

    '/:id',

    TriageController.update

);

module.exports =
    router;