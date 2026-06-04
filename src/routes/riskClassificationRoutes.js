const express =
    require('express');

const router =
    express.Router();

const authMiddleware =
    require('../middlewares/authMiddleware');

const RiskClassificationRepository =
    require(
        '../repositories/RiskClassificationRepository'
    );

router.get(

    '/',

    authMiddleware,

    async (req, res, next) => {

        try {

            const data =
                await RiskClassificationRepository.findAll();

            res.json(data);

        } catch (error) {

            next(error);

        }

    }

);

module.exports = router;