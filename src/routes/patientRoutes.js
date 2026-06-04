const express =
    require('express');

const router =
    express.Router();

const PatientController =
    require('../controllers/PatientController');

const authMiddleware =
    require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get(
    '/',
    PatientController.search
);

router.get(
    '/:id/history',
    PatientController.history
);

router.get(
    '/:id',
    PatientController.findById
);

router.post(
    '/',
    PatientController.create
);

router.put(
    '/:id',
    PatientController.update
);

router.delete(
    '/:id',
    PatientController.deactivate
);

module.exports = router;