const PrescriptionService =
    require('../services/PrescriptionService');

class PrescriptionController {

    async create(
        req,
        res,
        next
    ) {

        try {

            const result =
                await PrescriptionService.create({

                    ...req.body,

                    doctor_id:
                        req.user.id

                });

            return res
                .status(201)
                .json(result);

        } catch (error) {

            next(error);

        }

    }

}

module.exports =
    new PrescriptionController();