const express =
    require('express');

const router =
    express.Router();

const authMiddleware =
    require('../middlewares/authMiddleware');

const permissionMiddleware =
    require('../middlewares/permissionMiddleware');

const MedicalEvolutionController =
    require(
        '../controllers/MedicalEvolutionController'
    );

router.use(
    authMiddleware
);

router.post(

    '/',

    permissionMiddleware(
        'evolution.create'
    ),

    MedicalEvolutionController.create

);

router.get(

    '/:id',

    permissionMiddleware(
        'evolution.read'
    ),

    MedicalEvolutionController.findById

);

router.get(

    '/patient/:patientId',

    permissionMiddleware(
        'evolution.read'
    ),

    MedicalEvolutionController.findByPatient

);

module.exports =
    router;