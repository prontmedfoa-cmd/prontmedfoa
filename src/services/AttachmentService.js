const crypto =
    require('crypto');

const fs =
    require('fs');

const AttachmentRepository =
    require('../repositories/AttachmentRepository');

class AttachmentService {

    async upload(data) {

        const fileBuffer =
            fs.readFileSync(
                data.file.path
            );

        const hash =
            crypto
                .createHash(
                    'sha256'
                )
                .update(
                    fileBuffer
                )
                .digest(
                    'hex'
                );

        return AttachmentRepository.create({

            patient_id:
                data.patient_id,

            uploaded_by:
                data.user_id,

            file_name:
                data.file.filename,

            file_path:
                data.file.path,

            mime_type:
                data.file.mimetype,

            file_size:
                data.file.size,

            file_hash:
                hash

        });

    }

}

module.exports =
    new AttachmentService();