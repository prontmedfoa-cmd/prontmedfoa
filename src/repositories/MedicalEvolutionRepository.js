const db =
    require('../config/database');

class MedicalEvolutionRepository {

    async create(data) {

        const query = `
            INSERT INTO medical_evolutions (

                patient_id,
                consultation_id,
                professional_id,

                evolution_type,

                evolution_text

            )

            VALUES (

                $1,$2,$3,
                $4,$5

            )

            RETURNING *
        `;

        const values = [

            data.patient_id,

            data.consultation_id,

            data.professional_id,

            data.evolution_type,

            data.evolution_text
        ];

        const { rows } =
            await db.query(
                query,
                values
            );

        return rows[0];
    }

    async findById(id) {

        const { rows } =
            await db.query(
                `
                SELECT

                    me.*,

                    u.full_name
                        AS professional_name

                FROM medical_evolutions me

                LEFT JOIN users u

                    ON u.id =
                       me.professional_id

                WHERE me.id = $1
                `,
                [id]
            );

        return rows[0] || null;
    }

    async findByPatient(patientId) {

        const { rows } =
            await db.query(
                `
                SELECT

                    me.*,

                    u.full_name
                        AS professional_name

                FROM medical_evolutions me

                LEFT JOIN users u

                    ON u.id =
                       me.professional_id

                WHERE me.patient_id = $1

                ORDER BY me.created_at DESC
                `,
                [patientId]
            );

        return rows;
    }

}

module.exports =
    new MedicalEvolutionRepository();