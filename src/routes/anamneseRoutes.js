const express =
    require('express');

const router =
    express.Router();

const authMiddleware =
    require('../middlewares/authMiddleware');

const AnamneseController =
    require('../controllers/AnamneseController');

router.use(authMiddleware);

router.post(

    '/',

    AnamneseController.create

);

router.put(

    '/:id',

    AnamneseController.update

);

router.get(

    '/:id',

    AnamneseController.findById

);

router.get(

    '/patient/:patientId',

    AnamneseController.findByPatient

);

router.get(

    '/patient/:patientId/history',

    AnamneseController.history

);

module.exports = router;