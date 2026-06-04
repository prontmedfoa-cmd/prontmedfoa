const db =
    require('../config/database');

class AttachmentRepository {

    async create(data) {

        const { rows } =
            await db.query(

                `
                INSERT INTO attachments (

                    patient_id,

                    uploaded_by,

                    file_name,

                    file_path,

                    mime_type,

                    file_size,

                    file_hash

                )

                VALUES (

                    $1,$2,$3,$4,$5,$6,$7

                )

                RETURNING *
                `,

                [

                    data.patient_id,

                    data.uploaded_by,

                    data.file_name,

                    data.file_path,

                    data.mime_type,

                    data.file_size,

                    data.file_hash

                ]

            );

        return rows[0];
    }

    async findByPatient(
        patientId
    ) {

        const { rows } =
            await db.query(

                `
                SELECT *

                FROM attachments

                WHERE patient_id = $1

                ORDER BY created_at DESC
                `,

                [patientId]

            );

        return rows;
    }

}

module.exports =
    new AttachmentRepository();