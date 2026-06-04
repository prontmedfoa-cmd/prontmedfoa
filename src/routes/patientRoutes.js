const express =
    require('express');

const router =
    express.Router();

const PatientController =
    require('../controllers/PatientController');

const authMiddleware =
    require('../middlewares/authMiddleware');

const permissionMiddleware =
    require('../middlewares/permissionMiddleware');

router.use(authMiddleware);

router.get(
    '/',
    permissionMiddleware(
        'patient.read'
    ),
    PatientController.search
);

router.get(
    '/:id/history',
    permissionMiddleware(
        'patient.read'
    ),
    PatientController.history
);

router.get(
    '/:id',
    permissionMiddleware(
        'patient.read'
    ),
    PatientController.findById
);

router.post(
    '/',
    permissionMiddleware(
        'patient.create'
    ),
    PatientController.create
);

router.put(
    '/:id',
    permissionMiddleware(
        'patient.update'
    ),
    PatientController.update
);

router.delete(
    '/:id',
    permissionMiddleware(
        'patient.update'
    ),
    PatientController.deactivate
);

module.exports = router;