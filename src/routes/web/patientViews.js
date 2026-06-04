const express =
    require('express');

const router =
    express.Router();

router.get(
    '/patients',
    (req, res) => {

        res.render(
            'patients/list'
        );

    }
);

router.get(
    '/patients/new',
    (req, res) => {

        res.render(
            'patients/create'
        );

    }
);

router.get(
    '/patients/:id/edit',
    (req, res) => {

        res.render(
            'patients/edit'
        );

    }
);

router.get(
    '/patients/:id/record',
    (req, res) => {

        res.render(
            'patients/medical-record'
        );

    }
);

module.exports =
    router;