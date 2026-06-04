const express =
    require('express');

const router =
    express.Router();

const upload =
    require('../middlewares/uploadMiddleware');

const authMiddleware =
    require('../middlewares/authMiddleware');

const permissionMiddleware =
    require('../middlewares/permissionMiddleware');

const AttachmentController =
    require('../controllers/AttachmentController');

router.use(
    authMiddleware
);

router.post(

    '/',

    permissionMiddleware(
        'attachment.create'
    ),

    upload.single(
        'file'
    ),

    AttachmentController.upload

);

module.exports =
    router;