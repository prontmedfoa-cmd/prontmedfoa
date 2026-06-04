const express =
    require('express');

const router =
    express.Router();

const authMiddleware =
    require('../middlewares/authMiddleware');

const permissionMiddleware =
    require('../middlewares/permissionMiddleware');

const ConsultationController =
    require('../controllers/ConsultationController');

router.use(authMiddleware);

router.post(

    '/',

    permissionMiddleware(
        'consultation.create'
    ),

    ConsultationController.create

);

router.get(

    '/:id',

    permissionMiddleware(
        'consultation.read'
    ),

    ConsultationController.findById

);

router.put(

    '/:id',

    permissionMiddleware(
        'consultation.update'
    ),

    ConsultationController.update

);

router.get(

    '/patient/:patientId',

    permissionMiddleware(
        'consultation.read'
    ),

    ConsultationController.findByPatient

);

router.put(

    '/:id/cids',

    permissionMiddleware(
        'consultation.update'
    ),

    ConsultationController.saveCids

);

module.exports = router;