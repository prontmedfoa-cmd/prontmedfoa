const PatientService =
    require('../services/PatientService');

class PatientController {

    async create(req, res, next) {

        try {

            const patient =
                await PatientService.create(
                    req.body
                );

            return res
                .status(201)
                .json(patient);

        } catch (error) {

            next(error);

        }

    }

    async findAll(req, res, next) {

        try {

            const patients =
                await PatientService.findAll();

            return res.json(
                patients
            );

        } catch (error) {

            next(error);

        }

    }

    async findById(req, res, next) {

        try {

            const patient =
                await PatientService.findById(
                    req.params.id
                );

            return res.json(
                patient
            );

        } catch (error) {

            next(error);

        }

    }

    async update(req, res, next) {

        try {

            const patient =
                await PatientService.update(
                    req.params.id,
                    req.body
                );

            return res.json(
                patient
            );

        } catch (error) {

            next(error);

        }

    }

    async deactivate(req, res, next) {

        try {

            await PatientService.deactivate(
                req.params.id
            );

            return res.json({
                message:
                    'Paciente desativado'
            });

        } catch (error) {

            next(error);

        }

    }

    async search(
        req,
        res,
        next
    ) {

        try {

            const result =
                await PatientService.search(
                    req.query
                );

            return res.json(
                result
            );

        } catch (error) {

            next(error);

        }

    }

    async history(
    req,
    res,
    next
) {

    try {

        const result =
            await PatientService.getHistory(
                req.params.id
            );

        return res.json(result);

    } catch (error) {

        next(error);

    }

}

}

module.exports =
    new PatientController();