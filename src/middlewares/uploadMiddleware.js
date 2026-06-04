const multer =
    require('multer');

const path =
    require('path');

const fs =
    require('fs');

const storage =
    multer.diskStorage({

        destination:

            (req, file, cb) => {

                const patientId =
                    req.body.patient_id;

                const uploadDir =
                    path.join(

                        process.cwd(),

                        'uploads',

                        'patients',

                        String(patientId)

                    );

                fs.mkdirSync(
                    uploadDir,
                    { recursive: true }
                );

                cb(
                    null,
                    uploadDir
                );

            },

        filename:

            (req, file, cb) => {

                const timestamp =
                    Date.now();

                cb(

                    null,

                    `${timestamp}_${file.originalname}`

                );

            }

    });

module.exports =
    multer({

        storage,

        limits: {

            fileSize:
                20 * 1024 * 1024

        }

    });