const express =
    require('express');

const router =
    express.Router();

const authMiddleware =
    require('../middlewares/authMiddleware');

const PrescriptionController =
    require('../controllers/PrescriptionController');

router.use(authMiddleware);

router.post(

    '/',

    PrescriptionController.create

);

module.exports =
    router;