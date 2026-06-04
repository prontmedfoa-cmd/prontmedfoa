const express =
    require('express');

const router =
    express.Router();

const UserController =
    require('../controllers/UserController');

const authMiddleware =
    require('../middlewares/authMiddleware');

const adminMiddleware =
    require('../middlewares/adminMiddleware');

const permissionMiddleware =
    require('../middlewares/permissionMiddleware');

router.get(
    '/',
    authMiddleware,
    adminMiddleware,
    UserController.list
);

router.get(
    '/:id',
    authMiddleware,
    adminMiddleware,
    UserController.show
);

router.post(
    '/',
    authMiddleware,
    adminMiddleware,
    UserController.create
);

router.put(
    '/:id',
    authMiddleware,
    adminMiddleware,
    UserController.update
);

router.delete(
    '/:id',
    authMiddleware,
    adminMiddleware,
    UserController.delete
);

module.exports =
    router;