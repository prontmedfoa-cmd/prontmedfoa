const db =
    require('../config/database');

class PrescriptionItemRepository {

    async createMany(
        prescriptionId,
        items
    ) {

        if (!items.length) {

            return;
        }

        const values = [];
        const params = [];

        let index = 1;

        for (const item of items) {

            values.push(

                `(

                $${index},
                $${index + 1},
                $${index + 2},
                $${index + 3},
                $${index + 4}

            )`

            );

            params.push(

                prescriptionId,

                item.medication_id,

                item.dosage,

                item.instructions,

                item.duration_days

            );

            index += 5;
        }

        await db.query(

            `
        INSERT INTO prescription_items (

            prescription_id,

            medication_id,

            dosage,

            instructions,

            duration_days

        )

        VALUES

        ${values.join(',')}
        `,

            params

        );

    }

    async findByPrescription(
        prescriptionId
    ) {

        const { rows } =
            await db.query(
                `
                SELECT

                    pi.*,

                    m.name,
                    m.active_ingredient,
                    m.presentation

                FROM prescription_items pi

                INNER JOIN medications m

                    ON m.id =
                       pi.medication_id

                WHERE pi.prescription_id = $1

                ORDER BY m.name
                `,
                [prescriptionId]
            );

        return rows;
    }

}

module.exports =
    new PrescriptionItemRepository();