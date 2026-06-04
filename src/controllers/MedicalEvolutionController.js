const MedicalEvolutionService =
    require(
        '../services/MedicalEvolutionService'
    );

class MedicalEvolutionController {

    async create(
        req,
        res,
        next
    ) {

        try {

            const result =
                await MedicalEvolutionService.create({

                    ...req.body,

                    professional_id:
                        req.user.id

                });

            return res
                .status(201)
                .json(result);

        } catch (error) {

            next(error);

        }

    }

    async findById(
        req,
        res,
        next
    ) {

        try {

            const result =
                await MedicalEvolutionService.findById(
                    req.params.id
                );

            return res.json(
                result
            );

        } catch (error) {

            next(error);

        }

    }

    async findByPatient(
        req,
        res,
        next
    ) {

        try {

            const result =
                await MedicalEvolutionService.findByPatient(
                    req.params.patientId
                );

            return res.json(
                result
            );

        } catch (error) {

            next(error);

        }

    }

}

module.exports =
    new MedicalEvolutionController();