const db =
    require('../config/database');

class PrescriptionRepository {

    async create(data) {

        const { rows } =
            await db.query(
                `
                INSERT INTO prescriptions (

                    consultation_id,
                    doctor_id,
                    notes

                )

                VALUES (

                    $1,$2,$3

                )

                RETURNING *
                `,
                [

                    data.consultation_id,

                    data.doctor_id,

                    data.notes

                ]
            );

        return rows[0];
    }

    async findById(id) {

        const { rows } =
            await db.query(
                `
                SELECT *

                FROM prescriptions

                WHERE id = $1
                `,
                [id]
            );

        return rows[0] || null;
    }

}

module.exports =
    new PrescriptionRepository();