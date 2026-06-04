const AttachmentService =
    require('../services/AttachmentService');

class AttachmentController {

    async upload(
        req,
        res,
        next
    ) {

        try {

            const result =
                await AttachmentService.upload({

                    patient_id:
                        req.body.patient_id,

                    user_id:
                        req.user.id,

                    file:
                        req.file

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
    new AttachmentController();