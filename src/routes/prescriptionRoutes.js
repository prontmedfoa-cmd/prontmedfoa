const express =
    require('express');

const router =
    express.Router();

const authMiddleware =
    require('../middlewares/authMiddleware');

const permissionMiddleware =
    require('../middlewares/permissionMiddleware');

const PrescriptionController =
    require('../controllers/PrescriptionController');

router.use(authMiddleware);

router.post(

    '/',

    permissionMiddleware(
        'prescription.create'
    ),

    PrescriptionController.create

);

module.exports =
    router;