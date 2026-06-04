const express =
    require('express');

const router =
    express.Router();

const authMiddleware =
    require('../middlewares/authMiddleware');

const ConsultationController =
    require('../controllers/ConsultationController');

router.use(authMiddleware);

router.post(

    '/',

    ConsultationController.create

);

router.get(

    '/:id',

    ConsultationController.findById

);

router.put(

    '/:id',

    ConsultationController.update

);

router.get(

    '/patient/:patientId',

    ConsultationController.findByPatient

);

router.put(

    '/:id/cids',

    ConsultationController.saveCids

);

module.exports = router;