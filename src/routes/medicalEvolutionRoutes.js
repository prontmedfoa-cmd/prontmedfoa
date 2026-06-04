const express =
    require('express');

const router =
    express.Router();

const authMiddleware =
    require('../middlewares/authMiddleware');

const MedicalEvolutionController =
    require(
        '../controllers/MedicalEvolutionController'
    );

router.use(
    authMiddleware
);

router.post(

    '/',

    MedicalEvolutionController.create

);

router.get(

    '/:id',

    MedicalEvolutionController.findById

);

router.get(

    '/patient/:patientId',

    MedicalEvolutionController.findByPatient

);

module.exports =
    router;